const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const connectDB = require("../config/db");

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await MenuItem.deleteMany({});

  console.log("Cleared existing data...");

  // Create admin user
  const admin = await User.create({
    firstName: "Admin",
    lastName: "Manager",
    email: "admin@thefoundry.com",
    password: "admin123",
    role: "admin",
  });

  // Create test user
  const user = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "user123",
    role: "user",
  });

  console.log("Created users...");

  // Create menu items
  const menuItems = [
    // Main Courses
    {
      name: "Foundry Signature Steak",
      description:
        "A 12oz prime ribeye, dry-aged for 28 days, seared to perfection and finished with herb-compound butter. Served alongside truffle mashed potatoes and seasonal roasted vegetables.",
      price: 42.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600",
      ingredients: ["Prime Ribeye", "Herb Butter", "Truffle Oil", "Potatoes", "Seasonal Vegetables"],
      allergens: ["Dairy"],
      dietaryTags: ["gluten-free"],
      isAvailable: true,
      isSpecial: true,
      prepTime: 30,
    },
    {
      name: "Pan-Seared Salmon",
      description:
        "Wild-caught Atlantic salmon fillet with a crispy skin, drizzled with lemon-dill beurre blanc. Accompanied by jasmine rice and grilled asparagus.",
      price: 34.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
      ingredients: ["Atlantic Salmon", "Lemon", "Dill", "Butter", "Jasmine Rice", "Asparagus"],
      allergens: ["Fish", "Dairy"],
      dietaryTags: ["gluten-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 25,
    },
    {
      name: "Braised Short Ribs",
      description:
        "Slow-braised beef short ribs in a rich red wine reduction with aromatic root vegetables. Fall-off-the-bone tender, served with creamy polenta.",
      price: 38.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
      ingredients: ["Beef Short Ribs", "Red Wine", "Carrots", "Onion", "Polenta"],
      allergens: [],
      dietaryTags: ["gluten-free"],
      isAvailable: true,
      isSpecial: true,
      prepTime: 35,
    },
    {
      name: "Mushroom Risotto",
      description:
        "Creamy Arborio rice with a medley of wild mushrooms — porcini, chanterelle, and shiitake — finished with aged Parmesan and fresh thyme.",
      price: 26.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600",
      ingredients: ["Arborio Rice", "Wild Mushrooms", "Parmesan", "Thyme", "White Wine"],
      allergens: ["Dairy"],
      dietaryTags: ["vegetarian", "gluten-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 25,
    },
    {
      name: "Grilled Chicken Parmesan",
      description:
        "Herb-marinated free-range chicken breast, lightly breaded and grilled, topped with marinara sauce and melted mozzarella. Served with garlic bread and pasta.",
      price: 24.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600",
      ingredients: ["Chicken Breast", "Marinara", "Mozzarella", "Breadcrumbs", "Pasta"],
      allergens: ["Dairy", "Gluten"],
      dietaryTags: [],
      isAvailable: true,
      isSpecial: false,
      prepTime: 20,
    },
    {
      name: "Lobster Linguine",
      description:
        "Fresh Maine lobster tossed with al dente linguine in a light garlic-white wine sauce with cherry tomatoes and fresh basil.",
      price: 46.99,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600",
      ingredients: ["Maine Lobster", "Linguine", "Garlic", "White Wine", "Cherry Tomatoes", "Basil"],
      allergens: ["Shellfish", "Gluten"],
      dietaryTags: [],
      isAvailable: true,
      isSpecial: true,
      prepTime: 30,
    },

    // Appetizers
    {
      name: "Crispy Calamari",
      description:
        "Lightly battered calamari rings fried to golden perfection, served with zesty marinara and garlic aioli.",
      price: 14.99,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600",
      ingredients: ["Calamari", "Flour", "Marinara", "Garlic Aioli"],
      allergens: ["Gluten", "Shellfish"],
      dietaryTags: [],
      isAvailable: true,
      isSpecial: false,
      prepTime: 10,
    },
    {
      name: "Bruschetta Trio",
      description:
        "Three toasted crostini topped with classic tomato-basil, roasted pepper-goat cheese, and wild mushroom-truffle oil.",
      price: 12.99,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600",
      ingredients: ["Baguette", "Tomatoes", "Basil", "Goat Cheese", "Mushrooms", "Truffle Oil"],
      allergens: ["Gluten", "Dairy"],
      dietaryTags: ["vegetarian"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 10,
    },
    {
      name: "Soup of the Day",
      description:
        "Chef's daily creation using the freshest seasonal ingredients. Ask your server for today's selection.",
      price: 9.99,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
      ingredients: ["Seasonal Vegetables", "Herbs", "Stock"],
      allergens: [],
      dietaryTags: ["vegetarian", "gluten-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 5,
    },

    // Beverages
    {
      name: "Signature Old Fashioned",
      description:
        "The Foundry's twist on the classic — premium bourbon muddled with demerara sugar, Angostura bitters, and a flamed orange peel.",
      price: 16.99,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600",
      ingredients: ["Bourbon", "Demerara Sugar", "Angostura Bitters", "Orange Peel"],
      allergens: [],
      dietaryTags: ["vegan", "gluten-free"],
      isAvailable: true,
      isSpecial: true,
      prepTime: 5,
    },
    {
      name: "Sparkling Lavender Lemonade",
      description:
        "Refreshing house-made lemonade infused with lavender syrup and sparkling water, garnished with a sprig of fresh lavender.",
      price: 7.99,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600",
      ingredients: ["Lemon Juice", "Lavender Syrup", "Sparkling Water"],
      allergens: [],
      dietaryTags: ["vegan", "gluten-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 3,
    },
    {
      name: "Espresso Martini",
      description:
        "Freshly brewed espresso shaken with premium vodka, coffee liqueur, and a touch of vanilla — served ice cold.",
      price: 15.99,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600",
      ingredients: ["Espresso", "Vodka", "Coffee Liqueur", "Vanilla"],
      allergens: [],
      dietaryTags: ["vegan", "gluten-free", "dairy-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 5,
    },
    {
      name: "Fresh Mint Iced Tea",
      description:
        "Cold-brewed black tea sweetened with house honey and fresh muddled mint. A refreshing non-alcoholic option.",
      price: 5.99,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600",
      ingredients: ["Black Tea", "Honey", "Fresh Mint"],
      allergens: [],
      dietaryTags: ["vegan", "gluten-free", "dairy-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 3,
    },

    // Desserts
    {
      name: "Molten Chocolate Lava Cake",
      description:
        "Rich Valrhona dark chocolate cake with a warm, gooey center, served with vanilla bean ice cream and raspberry coulis.",
      price: 14.99,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600",
      ingredients: ["Dark Chocolate", "Butter", "Eggs", "Flour", "Vanilla Ice Cream", "Raspberries"],
      allergens: ["Dairy", "Gluten", "Eggs"],
      dietaryTags: [],
      isAvailable: true,
      isSpecial: true,
      prepTime: 15,
    },
    {
      name: "Crème Brûlée",
      description:
        "Classic French custard with a perfectly caramelized sugar crust, infused with Madagascar vanilla bean.",
      price: 12.99,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600",
      ingredients: ["Heavy Cream", "Egg Yolks", "Vanilla Bean", "Sugar"],
      allergens: ["Dairy", "Eggs"],
      dietaryTags: ["gluten-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 10,
    },
    {
      name: "Tiramisu",
      description:
        "Layers of espresso-soaked ladyfingers with mascarpone cream, dusted with cocoa powder. A timeless Italian classic.",
      price: 13.99,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600",
      ingredients: ["Mascarpone", "Ladyfingers", "Espresso", "Cocoa", "Eggs"],
      allergens: ["Dairy", "Gluten", "Eggs"],
      dietaryTags: ["vegetarian"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 10,
    },
    {
      name: "Seasonal Fruit Sorbet",
      description:
        "A trio of house-made sorbets featuring the season's finest fruits. Light, refreshing, and naturally sweetened.",
      price: 9.99,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600",
      ingredients: ["Seasonal Fruits", "Sugar", "Lemon Juice"],
      allergens: [],
      dietaryTags: ["vegan", "gluten-free", "dairy-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 5,
    },

    // Sides
    {
      name: "Truffle Fries",
      description:
        "Hand-cut fries tossed in truffle oil and fresh Parmesan, served with garlic aioli.",
      price: 10.99,
      category: "side",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
      ingredients: ["Potatoes", "Truffle Oil", "Parmesan", "Garlic Aioli"],
      allergens: ["Dairy"],
      dietaryTags: ["vegetarian", "gluten-free"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 10,
    },
    {
      name: "Caesar Salad",
      description:
        "Crisp romaine lettuce with house-made Caesar dressing, shaved Parmesan, and garlic croutons.",
      price: 11.99,
      category: "side",
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600",
      ingredients: ["Romaine Lettuce", "Parmesan", "Croutons", "Caesar Dressing"],
      allergens: ["Dairy", "Gluten", "Eggs"],
      dietaryTags: ["vegetarian"],
      isAvailable: true,
      isSpecial: false,
      prepTime: 5,
    },
  ];

  await MenuItem.insertMany(menuItems);
  console.log(`Created ${menuItems.length} menu items...`);

  console.log("\n=== Seed Complete ===");
  console.log("Admin login: admin@thefoundry.com / admin123");
  console.log("User login:  john@example.com / user123");
  console.log("====================\n");

  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
