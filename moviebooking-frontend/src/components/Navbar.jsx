import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
    );

    useEffect(() => {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem("theme", theme);

    }, [theme]);

    const toggleTheme = () => {

        setTheme((current) =>
            current === "light" ? "dark" : "light"
        );
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light site-navbar">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    🎬 MovieBook
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Movies
                            </Link>
                        </li>

                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to={`/bookings/user/${user.id}`}
                                    >
                                        My Bookings
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to={`/tickets/user/${user.id}`}
                                    >
                                        My Tickets
                                    </Link>
                                </li>
                            </>
                        )}

                    </ul>

                    <div className="d-flex align-items-center">

                        <button
                            type="button"
                            className="icon-btn me-2"
                            onClick={toggleTheme}
                            title={
                                theme === "light"
                                    ? "Switch to dark mode"
                                    : "Switch to light mode"
                            }
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        {user && (
                            <button
                                type="button"
                                className="icon-btn me-3"
                                title="No new notifications"
                            >
                                🔔
                            </button>
                        )}

                        {user ? (
                            <>
                                <span className="navbar-username me-3">
                                    👤 {user.name}
                                </span>

                                {user.role === "ADMIN" && (
                                    <Link
                                        className="btn btn-warning me-2"
                                        to="/admin"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                className="btn btn-primary"
                                to="/login"
                            >
                                Login
                            </Link>
                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;