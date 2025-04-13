const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model("User", userSchema);
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .required()
            .label("First Name")
            .pattern(/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/)
            .messages({
                'string.pattern.base': 'Imię musi zaczynać się od dużej litery i zawierać tylko litery',
                'any.required': 'Imię jest wymagane'
            }),
        lastName: Joi.string()
            .required()
            .label("Last Name")
            .pattern(/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*)?$/)
            .messages({
                'string.pattern.base': 'Nazwisko musi zaczynać się od dużej litery i zawierać tylko litery (dozwolone są łączniki)',
                'any.required': 'Nazwisko jest wymagane'
            }),
        email: Joi.string()
            .email()
            .required()
            .label("Email"),
        password: passwordComplexity({
            min: 6,
            max: 25,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4,
        })
            .required()
            .label("Password")
            .messages({
                'passwordComplexity.tooShort': 'Hasło musi mieć co najmniej {#limit} znaków',
                'passwordComplexity.uppercase': 'Hasło musi zawierać co najmniej jedną wielką literę',
                'passwordComplexity.lowercase': 'Hasło musi zawierać co najmniej jedną małą literę',
                'passwordComplexity.numeric': 'Hasło musi zawierać co najmniej jedną cyfrę',
                'passwordComplexity.symbol': 'Hasło musi zawierać co najmniej jeden znak specjalny',
                'any.required': 'Hasło jest wymagane'
            })
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { User, validate };
