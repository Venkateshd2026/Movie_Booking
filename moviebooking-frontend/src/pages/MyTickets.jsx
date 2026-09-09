import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyTickets() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const loadTickets = async () => {
            try {
                const response = await api.get(`/tickets/user/${user.id}`);
                setTickets(response.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load your tickets");
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h2>Loading your tickets...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 text-center">
                <h2>{error}</h2>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="text-center mb-5">
                <h1>🎟️ My Tickets</h1>
                <p className="text-secondary">
                    View your confirmed movie tickets
                </p>
            </div>

            {tickets.length === 0 ? (
                <div className="text-center">
                    <h3>No tickets found</h3>

                    <p className="text-secondary">
                        You haven't generated any tickets yet.
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Browse Movies
                    </button>
                </div>
            ) : (
                <div className="row g-4">

                    {tickets.map((ticket) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={ticket.ticketId}
                        >

                            <div className="ticket-card h-100">

                                <div className="ticket-header">
                                    <div>
                                        <h3>{ticket.movieName}</h3>

                                        <p className="ticket-number">
                                            {ticket.ticketNumber}
                                        </p>
                                    </div>

                                    <span className="ticket-status">
                                        {ticket.ticketStatus}
                                    </span>
                                </div>

                                <hr />

                                <p>
                                    <strong>Booking ID:</strong>{" "}
                                    {ticket.bookingId}
                                </p>

                                <p>
                                    <strong>Theatre:</strong>{" "}
                                    {ticket.theatreName}
                                </p>

                                <p>
                                    <strong>Screen:</strong>{" "}
                                    {ticket.screenName}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {ticket.showDate}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {ticket.showTime}
                                </p>

                                <p>
                                    <strong>Seats:</strong>{" "}
                                    {ticket.numberOfSeats}
                                </p>

                                <p>
                                    <strong>Total:</strong>{" "}
                                    ₹{ticket.totalAmount}
                                </p>

                                <p>
                                    <strong>Issued:</strong>{" "}
                                    {ticket.issuedAt}
                                </p>

                                <button
                                    className="btn btn-primary w-100 mt-3"
                                    onClick={() =>
                                        navigate(`/ticket/${ticket.bookingId}`)
                                    }
                                >
                                    View Ticket
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default MyTickets;