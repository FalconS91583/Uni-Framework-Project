const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    try {
        // Walidacja danych wejściowych
        if (!req.body.items || !Array.isArray(req.body.items)) {
            return res.status(400).send({ message: "Invalid items data" });
        }

        const items = req.body.items.map(item => ({
            ...item,
            price: Number(item.price) || 0
        }));

        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({
            user: req.user._id,
            items,
            totalPrice,
            paid: false
        });

        await order.save();
        res.status(201).send({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).send({ message: "Something went wrong!" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("user", "firstName lastName email");
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ message: "Unable to fetch orders!" });
    }
});
router.delete("/:orderId", auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send({ message: "Order canceled successfully" });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong!" });
    }
});
router.post("/:orderId/pay", auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { paid: true },
            { new: true }
        );
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send({ message: "Order paid successfully", order });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong!" });
    }
});

// Backend (Express.js) - Aktualizacja zamówienia
router.put("/:orderId", auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send({ message: "Order updated successfully", order });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong!" });
    }
});
module.exports = router;
