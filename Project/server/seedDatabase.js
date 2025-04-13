const mongoose = require('mongoose');
const Set = require('./models/set');
require('dotenv').config();

const setsData = [
    {
        name: "LEGO Technic Ferrari Daytona SP3",
        image: "https://www.lego.com/cdn/cs/set/assets/blt77a1e8f1879e9e9e/42143.jpg",
        price: 1999.99,
        description: "Ekskluzywny model Ferrari Daytona SP3 z serii Technic.",
        pieces: 3778,
        age: "18+",
        theme: "Technic" // Dodane
    },
    {
        name: "LEGO Star Wars Millennium Falcon",
        image: "https://www.lego.com/cdn/cs/set/assets/blt1e5c9f22e45a5a96/75192.jpg",
        price: 3499.99,
        description: "Ogromny model kultowego statku Millennium Falcon.",
        pieces: 7541,
        age: "16+",
        theme: "Star Wars" // Dodane
    },
    {
        name: "LEGO Ideas Fender Stratocaster",
        image: "https://www.lego.com/cdn/cs/set/assets/blt1c1a8d5a3b7a8a2e/21329.jpg",
        price: 799.99,
        description: "Kultowa gitara Fender Stratocaster w wersji LEGO.",
        pieces: 1074,
        age: "18+",
        theme: "Ideas" // Dodane
    },
    {
        name: "LEGO Creator Expert Taj Mahal",
        image: "https://www.lego.com/cdn/cs/set/assets/blt0a8e696d0a8f321f/10256.jpg",
        price: 1299.99,
        description: "Imponujący model słynnego Taj Mahal.",
        pieces: 5923,
        age: "16+",
        theme: "Creator" // Dodane
    },
    {
        name: "LEGO Harry Potter Hogwarts Castle",
        image: "https://www.lego.com/cdn/cs/set/assets/blt5a0e0a9a9a0a0a0a/71043.jpg",
        price: 1599.99,
        description: "Ogromny model zamku Hogwart z serii Harry Potter.",
        pieces: 6020,
        age: "16+",
        theme: "Harry Potter" // Dodane
    },
    {
        name: "LEGO Technic Lamborghini Sián FKP 37",
        image: "https://www.lego.com/cdn/cs/set/assets/blt1a0a0a0a0a0a0a0a/42115.jpg",
        price: 1799.99,
        description: "Supersamochód Lamborghini Sián w wersji LEGO Technic.",
        pieces: 3696,
        age: "18+",
        theme: "Technic" // Dodane
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to database for seeding');

        const count = await Set.countDocuments();
        if (count === 0) {
            await Set.insertMany(setsData);
            console.log('Database seeded successfully');
        } else {
            console.log('Database already contains sets');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();