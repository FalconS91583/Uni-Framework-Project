const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            set_id: { type: mongoose.Schema.Types.ObjectId, ref: "Set" },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, default: 1 },
            image: { type: String, required: true },
            pieces: { type: Number },
            theme: { type: String }
        }
    ],
    totalPrice: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered"],
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

orderSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;