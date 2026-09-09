import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            navigate("/");
            return;
        }

        const loadAdminData = async () => {

            try {

                const movieResponse = await api.get("/movies");
                setMovies(movieResponse.data);

                const theatreResponse = await api.get("/theatres");
                setTheatres(theatreResponse.data);

                const bookingResponse = await api.get("/bookings");
                setBookings(bookingResponse.data);

            } catch (error) {

                console.error("Unable to load admin data:", error);

            } finally {

                setLoading(false);

            }
        };

        loadAdminData();

    }, [user, navigate]);


    if (loading) {

        return (
            <div className="container mt-5 text-center">
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );

    }


    return (

        <AdminLayout title="Dashboard">

            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                Welcome, {user.name}
            </p>


            {/* Statistics */}

            <div className="row g-4 mb-5">

                <div className="col-md-4">

                    <div className="admin-stat-card">

                        <h5>Total Movies</h5>

                        <h2>{movies.length}</h2>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="admin-stat-card">

                        <h5>Total Theatres</h5>

                        <h2>{theatres.length}</h2>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="admin-stat-card">

                        <h5>Total Bookings</h5>

                        <h2>{bookings.length}</h2>

                    </div>

                </div>

            </div>


            {/* Management Cards */}

            <h2 className="mb-4">
                Management
            </h2>


            <div className="row g-4">

                {/* Movies */}

                <div className="col-md-6 col-lg-4">

                    <div className="admin-card">

                        <div className="admin-icon">
                            🎬
                        </div>

                        <h3>Movies</h3>

                        <p>
                            Add, update and manage movies.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/movies")}
                        >
                            Manage Movies
                        </button>

                    </div>

                </div>


                {/* Theatres */}

                <div className="col-md-6 col-lg-4">

                    <div className="admin-card">

                        <div className="admin-icon">
                            🏢
                        </div>

                        <h3>Theatres</h3>

                        <p>
                            Manage theatres and locations.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/theatres")}
                        >
                            Manage Theatres
                        </button>

                    </div>

                </div>


                {/* Screens */}

                <div className="col-md-6 col-lg-4">

                    <div className="admin-card">

                        <div className="admin-icon">
                            🖥️
                        </div>

                        <h3>Screens</h3>

                        <p>
                            Manage screens inside theatres.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/screens")}
                        >
                            Manage Screens
                        </button>

                    </div>

                </div>


                {/* Seats */}

                <div className="col-md-6 col-lg-4">

                    <div className="admin-card">

                        <div className="admin-icon">
                            💺
                        </div>

                        <h3>Seats</h3>

                        <p>
                            Add and manage theatre seats.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/seats")}
                        >
                            Manage Seats
                        </button>

                    </div>

                </div>


                {/* Shows */}

                <div className="col-md-6 col-lg-4">

                    <div className="admin-card">

                        <div className="admin-icon">
                            🕐
                        </div>

                        <h3>Shows</h3>

                        <p>
                            Schedule movies and show timings.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/shows")}
                        >
                            Manage Shows
                        </button>

                    </div>

                </div>


                {/* Bookings */}

                <div className="col-md-6 col-lg-4">

                    <div className="admin-card">

                        <div className="admin-icon">
                            🎟️
                        </div>

                        <h3>Bookings</h3>

                        <p>
                            View all customer bookings.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/bookings")}
                        >
                            View Bookings
                        </button>

                    </div>

                </div>

            </div>

        </AdminLayout>

    );
}

export default AdminDashboard;