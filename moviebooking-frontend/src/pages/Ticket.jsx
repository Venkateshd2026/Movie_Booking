import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Ticket() {

    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        loadTicket();

    }, [bookingId]);


    const loadTicket = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/tickets/booking/${bookingId}`);

            setTicket(response.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "We couldn't find this ticket. " +
                "Please check your booking or try again."
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (
            <div className="container text-center mt-5">

                <h3>
                    Loading ticket...
                </h3>

            </div>
        );
    }


    if (error) {

        return (
            <div className="container text-center mt-5">

                <h3 className="text-danger">
                    {error}
                </h3>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Go Home
                </button>

            </div>
        );
    }


    if (!ticket) {

        return (
            <div className="container text-center mt-5">

                <h3>
                    Ticket not found
                </h3>

            </div>
        );
    }


    return (

        <div className="container py-5">

            <div className="ticket-card">

                {/* HEADER */}

                <div className="ticket-header text-center">

                    <h1>
                        🎬 MovieBook
                    </h1>

                    <p>
                        Movie Ticket
                    </p>

                </div>


                {/* TICKET NUMBER */}

                <div className="text-center mt-4">

                    <h3>
                        {ticket.ticketNumber}
                    </h3>

                    <span className="badge bg-success">
                        {ticket.ticketStatus}
                    </span>

                </div>


                {/* MOVIE DETAILS */}

                <div className="ticket-details mt-4">

                    <h2 className="text-center">
                        {ticket.movieName}
                    </h2>


                    <p>
                        <strong>Customer:</strong>{" "}
                        {ticket.userName}
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
                        <strong>Number of Seats:</strong>{" "}
                        {ticket.numberOfSeats}
                    </p>


                    {/* SEAT NUMBERS */}

                    <p>

                        <strong>Seats:</strong>{" "}

                        {Array.isArray(ticket.seatNumbers) &&
                        ticket.seatNumbers.length > 0

                            ? ticket.seatNumbers.join(", ")

                            : `${ticket.numberOfSeats} seat(s)`

                        }

                    </p>


                    {/* SEAT BADGES */}

                    {Array.isArray(ticket.seatNumbers) &&
                    ticket.seatNumbers.length > 0 && (

                        <div className="ticket-seats text-center mt-4">

                            <h4>
                                🎫 Your Seats
                            </h4>


                            <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">

                                {ticket.seatNumbers.map(
                                    (seat, index) => (

                                        <span
                                            key={index}
                                            className="seat-badge"
                                        >
                                            {seat}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* TOTAL */}

                    <div className="ticket-total text-center mt-4">

                        <h3>
                            Total Amount
                        </h3>

                        <h2>
                            ₹{ticket.totalAmount}
                        </h2>

                    </div>


                    {/* QR CODE */}

                    <div className="text-center mt-4">

                        <h5>
                            Scan Ticket
                        </h5>

                        <div className="qr-container">

                            <QRCode
                                value={
                                    `BOOKING-${ticket.bookingId}-` +
                                    `${ticket.ticketNumber}`
                                }
                                size={180}
                            />

                        </div>

                    </div>


                    {/* ISSUED TIME */}

                    <p className="text-center mt-4">

                        <strong>
                            Issued At:
                        </strong>{" "}

                        {ticket.issuedAt}

                    </p>

                </div>


                {/* BUTTONS */}

                <div className="text-center mt-4">

                    <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                            navigate(
                                user
                                    ? `/bookings/user/${user.id}`
                                    : "/login"
                            )
                        }
                    >
                        My Bookings
                    </button>


                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Home
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Ticket;