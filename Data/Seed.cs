using RichardAde.Models;

namespace RichardAde.Data
{
    public static class Seed
    {
        public static void Initialize(RichardContext context) 
        {
            if (context.Products.Any())
            {
                Console.WriteLine("Database has been seeded");
                return; // Database has been seeded
            }

           
            Console.WriteLine("Database has not been seeded");

            List<Product> products = new()
            {
                new Product {Name = "Binoculars", Description = "A new one"},
                new Product {Name = "Binoculars", Description = "A new one"},
                new Product {Name = "Binoculars", Description = "A new one"},
                new Product {Name = "Binoculars", Description = "A new one"},
            };

            products.ForEach(pr => context.Products.Add(pr));
            context.SaveChanges();

            Console.WriteLine("Database has been seeded");
        }
    }
}
