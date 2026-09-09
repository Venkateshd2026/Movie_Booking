import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminBookings() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        loadBookings();

    }, [user]);

    const loadBookings = async () => {

        try {

            const response = await api.get("/bookings");

            setBookings(response.data);

        } catch (error) {

            console.error(error);
            setError("Unable to load bookings");

        } finally {

            setLoading(false);

        }
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this booking?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/bookings/${id}`);

            setBookings(
                bookings.filter(booking => booking.bookingId !== id)
            );

        } catch (error) {

            console.error(error);
            setError("Unable to delete booking");

        }
    };

    if (loading) {

        return (
            <div className="container py-5 text-center">
                <h2>Loading bookings...</h2>
            </div>
        );
    }

    return (

        <div className="container py-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h1>🎟️ Manage Bookings</h1>

                    <p className="text-secondary">
                        View all customer bookings
                    </p>
                </div>

                <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/admin")}
                >
                    ← Admin Dashboard
                </button>

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Booking Count */}

            <div className="admin-stat-card mb-4">

                <h5>Total Bookings</h5>

                <h2>{bookings.length}</h2>

            </div>

            {/* Bookings */}

            {bookings.length === 0 ? (

                <div className="admin-card text-center">

                    <h3>No bookings found</h3>

                    <p className="text-secondary">
                        Customer bookings will appear here.
                    </p>

                </div>

            ) : (

                <div className="admin-card">

                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle">

                            <thead>

                                <tr>

                                    <th>Booking ID</th>

                                    <th>Customer</th>

                                    <th>Movie</th>

                                    <th>Theatre</th>

                                    <th>Screen</th>

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Seats</th>

                                    <th>Amount</th>

                                    <th>Status</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {bookings.map(booking => (

                                    <tr key={booking.bookingId}>

                                        <td>
                                            #{booking.bookingId}
                                        </td>

                                        <td>
                                            {booking.userName}
                                        </td>

                                        <td>
                                            {booking.movieName}
                                        </td>

                                        <td>
                                            {booking.theatreName}
                                        </td>

                                        <td>
                                            {booking.screenName}
                                        </td>

                                        <td>
                                            {booking.showDate}
                                        </td>

                                        <td>
                                            {booking.showTime}
                                        </td>

                                        <td>
                                            {booking.numberOfSeats}
                                        </td>

                                        <td>
                                            ₹{booking.totalAmount}
                                        </td>

                                        <td>

                                            <span className="badge bg-success">
                                                {booking.status}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(
                                                        booking.bookingId
                                                    )
                                                }
                                            >
                                                🗑 Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminBookings;