import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./styles.module.css";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const navigate = useNavigate();
    // Schemat walidacji Yup
    const signupSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/, {
                message: "Imię musi zaczynać się od dużej litery i zawierać tylko litery",
                excludeEmptyString: true
            })
            .required("Imię jest wymagane"),
        lastName: Yup.string()
            .matches(/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/, {
                message: "Nazwisko musi zaczynać się od dużej litery i zawierać tylko litery",
                excludeEmptyString: true
            })
            .required("Nazwisko jest wymagane"),
        email: Yup.string()
            .email("Nieprawidłowy adres email")
            .required("Email jest wymazany"),
        password: Yup.string()
            .min(6, "Hasło musi mieć co najmniej 6 znaków")
            .required("Hasło jest wymagane"),
    });

    // Funkcja obsługująca wysłanie formularza
    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
            const url = "http://127.0.0.1:8080/api/users";
            const response = await axios.post(url, values);


            if (response.status === 201) {
                alert("Rejestracja zakończona pomyślnie!");
                resetForm();
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                // Błąd walidacji (400)
                if (error.response.status === 400 && error.response.data.errors) {
                    const validationErrors = {};
                    error.response.data.errors.forEach(err => {
                        // Mapowanie pól
                        const fieldMap = {
                            'First Name': 'firstName',
                            'Last Name': 'lastName',
                            'Email': 'email',
                            'Password': 'password'
                        };
                        const fieldName = fieldMap[err.field] || err.field;
                        validationErrors[fieldName] = err.message;
                    });
                    setErrors(validationErrors);
                }
                // Konflikt (409)
                else if (error.response.status === 409) {
                    setErrors({ email: error.response.data.message || "Użytkownik o podanym emailu już istnieje" });
                }
                // Inne błędy
                else {
                    alert(error.response.data.message || "Wystąpił błąd podczas rejestracji");
                }
            } else {
                alert("Problem z połączeniem. Sprawdź swoje połączenie internetowe.");
            }
            console.error("Registration error:", error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <h1>Zarejestruj się</h1>
                    <Formik
                        initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
                        validationSchema={signupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className={styles.form_container}>
                                <Field
                                    type="text"
                                    name="firstName"
                                    placeholder="Imię"
                                    className={styles.input}
                                />
                                <ErrorMessage name="firstName" component="div" className={styles.error_msg} />

                                <Field
                                    type="text"
                                    name="lastName"
                                    placeholder="Nazwisko"
                                    className={styles.input}
                                />
                                <ErrorMessage name="lastName" component="div" className={styles.error_msg} />

                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className={styles.input}
                                />
                                <ErrorMessage name="email" component="div" className={styles.error_msg} />

                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Hasło"
                                    className={styles.input}
                                />
                                <ErrorMessage name="password" component="div" className={styles.error_msg} />

                                <button type="submit" disabled={isSubmitting} className={styles.green_btn}>
                                    {isSubmitting ? "Rejestracja..." : "Zarejestruj się"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Signup;