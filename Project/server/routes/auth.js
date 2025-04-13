const router = require("express").Router();
const { User } = require("../Models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.label,
                message: detail.message
                    .replace(/".*"/, '') // Usuwa cudzysłowy z komunikatu
                    .trim()
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();

        // pendingOrder
        const pendingOrder = req.app.locals.pendingOrders?.[user._id];
        if (pendingOrder) {
            delete req.app.locals.pendingOrders[user._id];
            return res.status(200).send({
                data: token,
                message: "Logged in successfully",
                pendingOrder: pendingOrder
            });
        }

        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    return Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    }).validate(data);
};

module.exports = router;