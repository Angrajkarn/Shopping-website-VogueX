import random
from django.core.management.base import BaseCommand
from products.models import Product, Review
from users.models import User
from faker import Faker

fake = Faker()

class Command(BaseCommand):
    help = 'Seeds reviews for products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding reviews...')
        
        products = Product.objects.all()[:1000] # Seed for first 1000 products for now to be fast
        users = User.objects.all()
        
        if not users.exists():
            self.stdout.write('No users found. Creating a dummy user.')
            user = User.objects.create_user(username='reviewer', email='reviewer@example.com', password='password')
            users = [user]

        reviews = []
        for product in products:
            # Create 1-5 reviews per product
            for _ in range(random.randint(1, 5)):
                user = random.choice(users)
                rating = random.randint(3, 5)
                comment = fake.paragraph(nb_sentences=2)
                
                reviews.append(Review(
                    product=product,
                    user=user,
                    rating=rating,
                    comment=comment
                ))
        
        Review.objects.bulk_create(reviews)
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(reviews)} reviews!'))
