<#
.SYNOPSIS
    Deploys the VogueX Shopping Website to AWS EC2 using a single-server architecture.
.DESCRIPTION
    This script automates the deployment process of the Next.js frontend and Django backend
    to an AWS EC2 instance. It assumes you have the AWS CLI installed and configured.
    
    The script performs the following actions:
    1. Creates an AWS Security Group for web traffic (ports 80, 443, 3000, 8000).
    2. Provisions an EC2 instance with an initialization script (User Data).
    3. The EC2 instance will automatically install Docker, clone your repository, setup env files and run the app.
#>

$ErrorActionPreference = "Stop"

# Configuration Variables
$AwsRegion = "ap-south-1" # Replace with your preferred region
$InstanceType = "t3.medium"
$AmiNamePattern = "al2023-ami-2023.*-x86_64" # Amazon Linux 2023
$SecurityGroupName = "VogueX-Web-SG"
$KeyName = "voguex-deploy-key" 

# 1. Fetch Latest Amazon Linux 2023 AMI
Write-Host "Fetching latest Amazon Linux 2023 AMI..." -ForegroundColor Cyan
$AmiId = (aws ec2 describe-images `
        --region $AwsRegion `
        --owners amazon `
        --filters "Name=name,Values=$AmiNamePattern" "Name=state,Values=available" "Name=architecture,Values=x86_64" `
        --query "sort_by(Images, &CreationDate)[-1].[ImageId]" `
        --output text).Trim()

if (-not $AmiId) {
    Write-Host "Failed to find AMI." -ForegroundColor Red
    exit
}
Write-Host "Using AMI: $AmiId" -ForegroundColor Green

# 2. Setup Security Group
Write-Host "Setting up Security Group '$SecurityGroupName'..." -ForegroundColor Cyan
$VpcId = (aws ec2 describe-vpcs --region $AwsRegion --query "Vpcs[0].VpcId" --output text).Trim()

# Check if SG exists
$SgId = (aws ec2 describe-security-groups --region $AwsRegion --filters "Name=group-name,Values=$SecurityGroupName" --query "SecurityGroups[0].GroupId" --output text 2>$null).Trim()

if ($SgId -eq "None" -or -not $SgId) {
    Write-Host "Creating Security Group..."
    $SgId = (aws ec2 create-security-group --region $AwsRegion --group-name $SecurityGroupName --description "Security group for VogueX" --vpc-id $VpcId --query "GroupId" --output text).Trim()
    
    # Add rules
    aws ec2 authorize-security-group-ingress --region $AwsRegion --group-id $SgId --protocol tcp --port 80 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $AwsRegion --group-id $SgId --protocol tcp --port 443 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $AwsRegion --group-id $SgId --protocol tcp --port 22 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $AwsRegion --group-id $SgId --protocol tcp --port 3000 --cidr 0.0.0.0/0 | Out-Null
    aws ec2 authorize-security-group-ingress --region $AwsRegion --group-id $SgId --protocol tcp --port 8000 --cidr 0.0.0.0/0 | Out-Null
    Write-Host "Security Group rules added."
}
else {
    Write-Host "Security Group already exists: $SgId"
}


# 3. Create SSH Key
$KeyCheckRaw = aws ec2 describe-key-pairs --region $AwsRegion --key-names $KeyName --query "KeyPairs[0].KeyName" --output text 2>$null
if ($null -ne $KeyCheckRaw) {
    $KeyCheck = $KeyCheckRaw.Trim()
}
else {
    $KeyCheck = $null
}

if ([string]::IsNullOrWhiteSpace($KeyCheck) -or $KeyCheck -eq "None") {
    Write-Host "Creating SSH Key pair '$KeyName'..." -ForegroundColor Cyan
    aws ec2 create-key-pair --region $AwsRegion --key-name $KeyName --query "KeyMaterial" --output text > "$KeyName.pem"
    Write-Host "Saved key to $KeyName.pem"
}
else {
    Write-Host "SSH Key '$KeyName' already exists." -ForegroundColor Cyan
}


# Generate a random string for Django Secret Key
$DjangoSecretKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 50 | % { [char]$_ })

# 4. User Data Script (Instance Initialization)
$UserData = @"
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting deployment setup..."

# Install Git and Docker
dnf update -y
dnf install -y git cronie
dnf install -y docker
systemctl enable docker
systemctl start docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Fetch Public IP
PUBLIC_IP=`$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Clone Repository
cd /home/ec2-user
git clone https://github.com/Angrajkarn/Shopping-website-VogueX.git app
cd app

# Ensure next.config.ts uses standalone output natively in repository, but we can verify it here.

# Generate Backend Environment variables
cat << EOF > backend/.env
SECRET_KEY=django-insecure-prod-key-$($DjangoSecretKey)
DEBUG=False
ALLOWED_HOSTS=*,\$PUBLIC_IP
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://\$PUBLIC_IP:3000
DATABASE_URL=postgres://voguex_user:securepassword@db:5432/voguex_db
CELERY_BROKER_URL=redis://redis:6379/0
EOF

# Update docker-compose to use the public IP for the frontend to backend connection
sed -i "s|<EC2_PUBLIC_IP>|\$PUBLIC_IP|g" docker-compose.prod.yml

# Start the application
docker-compose -f docker-compose.prod.yml up -d --build

# Run Django Migrations and collectstatic (Wait for db to be ready)
sleep 20
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput

echo "Deployment via user-data script complete!"
"@

$UserDataEncoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($UserData))


# 5. Launch EC2 Instance
Write-Host "Launching EC2 Instance..." -ForegroundColor Cyan

$InstanceId = (aws ec2 run-instances `
        --region $AwsRegion `
        --image-id $AmiId `
        --instance-type $InstanceType `
        --key-name $KeyName `
        --security-group-ids $SgId `
        --user-data $UserDataEncoded `
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=VogueX-Server}]" `
        --query "Instances[0].InstanceId" `
        --output text).Trim()

Write-Host "Instance created with ID: $InstanceId" -ForegroundColor Green
Write-Host "Waiting for instance to be running (this may take a minute)..."

aws ec2 wait instance-running --region $AwsRegion --instance-ids $InstanceId

$PublicIp = (aws ec2 describe-instances --region $AwsRegion --instance-ids $InstanceId --query "Reservations[0].Instances[0].PublicIpAddress" --output text).Trim()

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Deployment Initiated Successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Instance Public IP: $PublicIp"
Write-Host ""
Write-Host "The server is now booting up and running the installation script."
Write-Host "It will take approximately 5-10 minutes to install Docker, build the images,"
Write-Host "and start the containers. After that, you can access your app at:"
Write-Host ""
Write-Host "Frontend: http://$PublicIp:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://$PublicIp:8000" -ForegroundColor Cyan
Write-Host "Backend Admin: http://$PublicIp:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "To SSH into the server:"
Write-Host "ssh -i $KeyName.pem ec2-user@$PublicIp"
Write-Host "==========================================================" -ForegroundColor Green
