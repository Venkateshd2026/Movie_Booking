import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Movies", icon: "🎬", path: "/admin/movies" },
    { label: "Screens", icon: "🖥️", path: "/admin/screens" },
    { label: "Shows", icon: "🗓️", path: "/admin/shows" },
    { label: "Bookings", icon: "🎟️", path: "/admin/bookings" }
];

function AdminLayout({ title, children }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-shell">

            <aside className="admin-sidebar">

                <div className="admin-sidebar-brand">
                    🎬 MovieBook
                </div>

                <nav className="admin-sidebar-nav">

                    {NAV_ITEMS.map((item) => (

                        <Link
                            key={item.path}
                            to={item.path}
                            className={
                                "admin-sidebar-link" +
                                (location.pathname === item.path
                                    ? " active"
                                    : "")
                            }
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>

                    ))}

                </nav>

                <button
                    className="admin-sidebar-logout"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </aside>

            <div className="admin-main">

                <header className="admin-topbar">

                    <h1>{title}</h1>

                    <div className="admin-topbar-actions">

                        <button
                            type="button"
                            className="icon-btn"
                            title="No new notifications"
                        >
                            🔔
                        </button>

                        <div className="admin-profile">
                            <span className="admin-profile-avatar">
                                👤
                            </span>
                            {user?.name}
                        </div>

                    </div>

                </header>

                <main className="admin-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;
