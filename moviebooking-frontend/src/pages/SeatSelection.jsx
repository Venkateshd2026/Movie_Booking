import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function SeatSelection() {

    const { showId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadSeats = async () => {

            try {

                const response = await api.get(
                    `/seats/show/${showId}`
                );

                setSeats(response.data);

            } catch (error) {

                console.error(error);

                setError("Unable to load seats");

            } finally {

                setLoading(false);
            }
        };

        loadSeats();

    }, [showId]);


    const handleSeatClick = (seat) => {

        if (!seat.available) {
            return;
        }

        if (selectedSeats.includes(seat.id)) {

            setSelectedSeats(
                selectedSeats.filter(
                    (id) => id !== seat.id
                )
            );

        } else {

            setSelectedSeats([
                ...selectedSeats,
                seat.id
            ]);
        }
    };


    const getTotalAmount = () => {

        return seats
            .filter((seat) =>
                selectedSeats.includes(seat.id)
            )
            .reduce(
                (total, seat) =>
                    total + seat.price,
                0
            );
    };


    const handleBooking = async () => {

        if (!user) {

            navigate("/login");

            return;
        }

        if (selectedSeats.length === 0) {

            alert("Please select at least one seat");

            return;
        }

        try {

            const response = await api.post(
                "/bookings",
                {
                    userId: user.id,
                    showId: Number(showId),
                    seatIds: selectedSeats
                }
            );

            alert("Booking successful!");

            navigate(`/payment/${response.data.bookingId}`);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Booking failed"
            );
        }
    };


    if (loading) {

        return (
            <div className="container mt-5 text-center">
                <h2>Loading seats...</h2>
            </div>
        );
    }


    if (error) {

        return (
            <div className="container mt-5 text-center">
                <h2>{error}</h2>
            </div>
        );
    }


    return (
        <div className="container py-5">

            <div className="text-center mb-5">

                <h1>Select Your Seats</h1>

                <p className="text-secondary">
                    Choose your preferred seats
                </p>

            </div>


            {/* Screen */}

            <div className="text-center mb-5">

                <div className="screen">
                    SCREEN
                </div>

            </div>


            {/* Seats */}

            <div className="seat-container">

                {seats.map((seat) => {

                    const isSelected =
                        selectedSeats.includes(seat.id);

                    return (

                        <button
                            key={seat.id}
                            className={`seat ${
                                !seat.available
                                    ? "booked"
                                    : isSelected
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() =>
                                handleSeatClick(seat)
                            }
                            disabled={!seat.available}
                        >
                            {seat.seatNumber}
                        </button>

                    );

                })}

            </div>


            {/* Legend */}

            <div className="seat-legend mt-4">

                <span>
                    <span className="legend-box available"></span>
                    Available
                </span>

                <span>
                    <span className="legend-box selected"></span>
                    Selected
                </span>

                <span>
                    <span className="legend-box booked"></span>
                    Booked
                </span>

            </div>


            {/* Booking Summary */}

            <div className="booking-summary mt-5">

                <h3>Booking Summary</h3>

                <p>
                    Selected Seats:{" "}
                    <strong>
                        {selectedSeats.length}
                    </strong>
                </p>

                <p>
                    Total Amount:{" "}
                    <strong>
                        ₹{getTotalAmount()}
                    </strong>
                </p>


                <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleBooking}
                >
                    Continue to Payment
                </button>

            </div>

        </div>
    );
}

export default SeatSelection;