import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {

            setError("Passwords do not match");
            return;
        }

        if (password.length < 4) {

            setError("Password must be at least 4 characters");
            return;
        }

        try {

            setSubmitting(true);

            // New sign-ups are always CUSTOMER accounts.
            // ADMIN accounts are provisioned separately.
            await api.post("/users", {
                name: name,
                email: email,
                password: password,
                role: "CUSTOMER"
            });

            // Registration succeeded - log the user straight in.
            const loginResponse = await api.post("/auth/login", {
                email: email,
                password: password
            });

            login(loginResponse.data);

            navigate("/");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to create account"
            );

        } finally {

            setSubmitting(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="auth-card mx-auto">

                <h1 className="text-center">🎬 MovieBook</h1>

                <h2 className="text-center mb-4">Create Account</h2>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>

                    <div className="mb-3">
                        <label className="form-label">Name</label>

                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>

                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Re-enter password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={submitting}
                    >
                        {submitting ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="text-center mt-4 mb-0">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>

        </div>
    );
}

export default Register;
