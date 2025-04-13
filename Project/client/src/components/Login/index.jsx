import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);

            localStorage.setItem("token", res.data);
            setError("");

            // Przetwarzanie pendingOrder po zalogowaniu
            const pendingOrder = localStorage.getItem("pendingOrder");
            if (pendingOrder) {
                try {
                    await axios.post("http://localhost:8080/api/orders", JSON.parse(pendingOrder), {
                        headers: {
                            "x-auth-token": res.data,
                        },
                    });
                    localStorage.removeItem("pendingOrder");
                } catch (orderError) {
                    console.error("Order submission error:", orderError);
                }
            }

            navigate("/orders");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400 || error.response.status === 401) {
                    setError(error.response.data.message || "Invalid email or password");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Sign In
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h2>New Here?</h2>
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;