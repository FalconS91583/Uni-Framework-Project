const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: {
        type: Number,
        required: true,
        set: v => typeof v === 'string' ? parseFloat(v.replace(' PLN', '')) : v
    },
    description: { type: String, required: true },
    pieces: { type: Number, required: true, default: 0 },
    age: { type: String, required: true },
    theme: { type: String, required: true } 
});

const Set = mongoose.model('Set', setSchema);

module.exports = Set;