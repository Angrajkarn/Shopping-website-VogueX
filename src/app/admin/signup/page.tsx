import { redirect } from 'next/navigation';

export default function AdminSignupPage() {
    // Signup is disabled for security. Admin accounts must be created via backend CLI.
    redirect('/admin/login');
}
