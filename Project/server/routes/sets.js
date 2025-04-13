// routes/sets.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Set = mongoose.model("Set", new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    pieces: Number,
    age: String
}));

// Wstępne dane zestawów
const seedSets = async () => {
    const count = await Set.countDocuments();
    if (count === 0) {
        await Set.insertMany([
            {
                name: "LEGO Technic Ferrari Daytona SP3",
                image: "https://www.lego.com/cdn/cs/set/assets/blt77a1e8f1879e9e9e/42143.jpg",
                price: 1999.99,
                description: "Ekskluzywny model Ferrari Daytona SP3 z serii Technic.",
                pieces: 3778,
                age: "18+"
            },
            {
                id: 2,
                name: "LEGO Star Wars Millennium Falcon",
                image: "https://www.lego.com/cdn/cs/set/assets/blt1e5c9f22e45a5a96/75192.jpg",
                price: "3499.99 PLN",
                description: "Ogromny model kultowego statku Millennium Falcon.",
                pieces: 7541,
                age: "16+",
            },
            {
                id: 3,
                name: "LEGO Ideas Fender Stratocaster",
                image: "https://www.lego.com/cdn/cs/set/assets/blt1c1a8d5a3b7a8a2e/21329.jpg",
                price: "799.99 PLN",
                description: "Kultowa gitara Fender Stratocaster w wersji LEGO.",
                pieces: 1074,
                age: "18+",
            },
            {
                id: 4,
                name: "LEGO Creator Expert Taj Mahal",
                image: "https://www.lego.com/cdn/cs/set/assets/blt0a8e696d0a8f321f/10256.jpg",
                price: "1299.99 PLN",
                description: "Imponujący model słynnego Taj Mahal.",
                pieces: 5923,
                age: "16+",
            },
            {
                id: 5,
                name: "LEGO Harry Potter Hogwarts Castle",
                image: "https://www.lego.com/cdn/cs/set/assets/blt5a0e0a9a9a0a0a0a/71043.jpg",
                price: "1599.99 PLN",
                description: "Ogromny model zamku Hogwart z serii Harry Potter.",
                pieces: 6020,
                age: "16+",
            },
            {
                id: 6,
                name: "LEGO Technic Lamborghini Sián FKP 37",
                image: "https://www.lego.com/cdn/cs/set/assets/blt1a0a0a0a0a0a0a0a/42115.jpg",
                price: "1799.99 PLN",
                description: "Supersamochód Lamborghini Sián w wersji LEGO Technic.",
                pieces: 3696,
                age: "18+",
            }
        ]);
    }
};
// Middleware do konwersji cen
const convertPrices = (sets) => {
    return sets.map(set => ({
        ...set._doc,
        price: Number(set.price),
        priceDisplay: `${set.price} PLN` 
    }));
};

router.get("/", async (req, res) => {
    try {
        let sets = await Set.find().lean();

        res.status(200).send(sets);
    } catch (error) {
        console.error("Błąd pobierania zestawów:", error);
        res.status(200).send(temporarySets);
    }
});

module.exports = router;