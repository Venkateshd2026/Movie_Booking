import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function BookingDetails() {

    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadBooking = async () => {

            try {

                const response = await api.get(
                    `/bookings/${bookingId}`
                );

                setBooking(response.data);

            } catch (error) {

                console.error(error);

                setError("Unable to load booking");

            } finally {

                setLoading(false);

            }
        };

        loadBooking();

    }, [bookingId]);


    // Loading
    if (loading) {

        return (
            <div className="container py-5 text-center">

                <h2>Loading booking...</h2>

            </div>
        );

    }


    // Error
    if (error) {

        return (
            <div className="container py-5 text-center">

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


    // Booking not found
    if (!booking) {

        return (
            <div className="container py-5 text-center">

                <h2>Booking not found</h2>

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


            {/* Page Heading */}

            <div className="text-center mb-5">

                <h1>🎟️ Booking Summary</h1>

                <p className="text-secondary">
                    Review your booking before payment
                </p>

            </div>


            {/* Booking Card */}

            <div className="booking-summary mx-auto">


                {/* Movie Information */}

                <div className="text-center mb-4">

                    <h2>
                        {booking.movieName}
                    </h2>

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


                <hr />


                {/* Booking Information */}

                <div className="row mt-4">


                    {/* Left Column */}

                    <div className="col-md-6">

                        <p>
                            <strong>Booking ID:</strong>{" "}
                            #{booking.bookingId}
                        </p>

                        <p>
                            <strong>Customer:</strong>{" "}
                            {booking.userName}
                        </p>

                        <p>
                            <strong>Theatre:</strong>{" "}
                            {booking.theatreName}
                        </p>

                        <p>
                            <strong>Screen:</strong>{" "}
                            {booking.screenName}
                        </p>

                    </div>


                    {/* Right Column */}

                    <div className="col-md-6">

                        <p>
                            <strong>Date:</strong>{" "}
                            {booking.showDate}
                        </p>

                        <p>
                            <strong>Time:</strong>{" "}
                            {booking.showTime}
                        </p>

                        <p>
                            <strong>Seats:</strong>{" "}

                            {Array.isArray(booking.seatNumbers) &&
                            booking.seatNumbers.length > 0
                                ? booking.seatNumbers.join(", ")
                                : `${booking.numberOfSeats} seat(s)`}
                        </p>

                        <p>
                            <strong>Total:</strong>{" "}
                            ₹{booking.totalAmount}
                        </p>

                    </div>

                </div>


                <hr />


                {/* Selected Seats */}

                {Array.isArray(booking.seatNumbers) &&
                booking.seatNumbers.length > 0 && (

                    <div className="mt-4">

                        <h5>
                            🎫 Selected Seats
                        </h5>

                        <div className="d-flex flex-wrap gap-2 mt-3">

                            {booking.seatNumbers.map(
                                (seat, index) => (

                                    <span
                                        key={index}
                                        className="badge bg-primary p-2"
                                    >
                                        {seat}
                                    </span>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* Total Amount */}

                <div className="booking-total">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹{booking.totalAmount}
                    </strong>

                </div>


                {/* Buttons */}

                <div className="d-flex gap-3 mt-4">


                    {/* Pending Booking */}

                    {booking.status === "PENDING" && (

                        <button
                            className="btn btn-primary w-100"
                            onClick={() =>
                                navigate(
                                    `/payment/${booking.bookingId}`
                                )
                            }
                        >
                            💳 Continue to Payment
                        </button>

                    )}


                    {/* Confirmed Booking */}

                    {booking.status === "CONFIRMED" && (

                        <button
                            className="btn btn-success w-100"
                            onClick={() =>
                                navigate(
                                    `/ticket/${booking.bookingId}`
                                )
                            }
                        >
                            🎟️ View Ticket
                        </button>

                    )}


                    {/* Back Button */}

                    <button
                        className="btn btn-outline-light w-100"
                        onClick={() => {

                            if (user) {

                                navigate(
                                    `/bookings/user/${user.id}`
                                );

                            } else {

                                navigate("/");

                            }

                        }}
                    >
                        ← Back
                    </button>

                </div>


            </div>

        </div>

    );
}

export default BookingDetails;