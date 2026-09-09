import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function MyBookings() {

    const { userId } = useParams();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadBookings();
    }, [userId]);


    const loadBookings = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/bookings/user/${userId}`);

            setBookings(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load your bookings."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleViewBooking = (bookingId) => {

        navigate(`/booking/${bookingId}`);
    };


    const handlePayment = (bookingId) => {

        navigate(`/payment/${bookingId}`);
    };


    const handleTicket = (bookingId) => {

        navigate(`/ticket/${bookingId}`);
    };


    if (loading) {

        return (
            <div className="container text-center py-5">

                <h3>
                    Loading your bookings...
                </h3>

            </div>
        );
    }


    if (error) {

        return (
            <div className="container text-center py-5">

                <h3 className="text-danger">
                    {error}
                </h3>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>

            </div>
        );
    }


    return (

        <div className="container py-5">

            <div className="text-center mb-5">

                <h1>
                    🎟️ My Bookings
                </h1>

                <p className="text-secondary">
                    View and manage your movie bookings
                </p>

            </div>


            {bookings.length === 0 ? (

                <div className="text-center py-5">

                    <h3>
                        No bookings found
                    </h3>

                    <p>
                        You haven't booked any movie tickets yet.
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

                    {bookings.map((booking) => (

                        <div
                            className="col-lg-6"
                            key={booking.bookingId}
                        >

                            <div className="booking-card">

                                {/* MOVIE */}

                                <div className="booking-header">

                                    <h3>
                                        🎬 {booking.movieName}
                                    </h3>

                                    <span
                                        className={
                                            booking.status === "CONFIRMED"
                                                ? "badge bg-success"
                                                : "badge bg-warning text-dark"
                                        }
                                    >
                                        {booking.status}
                                    </span>

                                </div>


                                {/* DETAILS */}

                                <div className="booking-details">

                                    <p>
                                        <strong>
                                            Booking ID:
                                        </strong>{" "}
                                        #{booking.bookingId}
                                    </p>


                                    <p>
                                        <strong>
                                            Customer:
                                        </strong>{" "}
                                        {booking.userName}
                                    </p>


                                    <p>
                                        <strong>
                                            Theatre:
                                        </strong>{" "}
                                        {booking.theatreName}
                                    </p>


                                    <p>
                                        <strong>
                                            Screen:
                                        </strong>{" "}
                                        {booking.screenName}
                                    </p>


                                    <p>
                                        <strong>
                                            Date:
                                        </strong>{" "}
                                        {booking.showDate}
                                    </p>


                                    <p>
                                        <strong>
                                            Time:
                                        </strong>{" "}
                                        {booking.showTime}
                                    </p>


                                    <p>
                                        <strong>
                                            Seats:
                                        </strong>{" "}

                                        {Array.isArray(
                                            booking.seatNumbers
                                        ) &&
                                        booking.seatNumbers.length > 0
                                            ? booking.seatNumbers.join(", ")
                                            : `${booking.numberOfSeats} seat(s)`
                                        }

                                    </p>


                                    <p>
                                        <strong>
                                            Total:
                                        </strong>{" "}

                                        ₹{booking.totalAmount}
                                    </p>

                                </div>


                                {/* SEAT BADGES */}

                                {Array.isArray(
                                    booking.seatNumbers
                                ) &&
                                booking.seatNumbers.length > 0 && (

                                    <div className="booking-seats">

                                        {booking.seatNumbers.map(
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

                                )}


                                {/* BUTTONS */}

                                <div className="booking-actions">

                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            handleViewBooking(
                                                booking.bookingId
                                            )
                                        }
                                    >
                                        View Booking
                                    </button>


                                    {booking.status === "PENDING" && (

                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                handlePayment(
                                                    booking.bookingId
                                                )
                                            }
                                        >
                                            Pay Now
                                        </button>

                                    )}


                                    {booking.status === "CONFIRMED" && (

                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleTicket(
                                                    booking.bookingId
                                                )
                                            }
                                        >
                                            View Ticket
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyBookings;