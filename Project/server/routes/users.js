const router = require("express").Router();
const { User, validate } = require("../Models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.label,
                message: detail.message
            }));
            return res.status(400).json({
                message: "Walidacja nie powiodła się",
                errors
            });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).json({
                message: "Użytkownik o podanym emailu już istnieje",
                field: "email"
            });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();

        res.status(201).json({
            success: true,
            message: "Użytkownik został pomyślnie zarejestrowany"
        });
    } catch (error) {
        console.error("Błąd rejestracji:", error);
        res.status(500).json({
            message: "Wystąpił błąd serwera podczas rejestracji",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
