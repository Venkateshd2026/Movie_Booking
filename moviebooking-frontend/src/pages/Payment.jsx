import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import paymentQr from "../assets/payment-qr.jpeg";

function Payment() {

    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [booking, setBooking] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const [upiId, setUpiId] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");


    // Load booking
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


    // Payment
    const handlePayment = async () => {

        setError("");


        // Check login
        if (!user) {

            navigate("/login");
            return;

        }


        // Check booking
        if (!booking) {

            setError("Booking not found");
            return;

        }


        // Prevent payment for confirmed booking
        if (booking.status === "CONFIRMED") {

            setError(
                "This booking has already been confirmed."
            );

            return;

        }


        // Card validation
        if (paymentMethod === "CARD") {

            if (!cardNumber.trim()) {

                setError("Please enter card number");
                return;

            }

            if (!expiry.trim()) {

                setError("Please enter card expiry");
                return;

            }

            if (!cvv.trim()) {

                setError("Please enter CVV");
                return;

            }

        }


        try {

            setProcessing(true);


            // Create payment
            const paymentResponse = await api.post(
                "/payments",
                {
                    bookingId: Number(bookingId),
                    paymentMethod: paymentMethod
                }
            );


            console.log(
                "Payment successful:",
                paymentResponse.data
            );


            /*
             * Payment successful.
             *
             * Backend changes:
             * PENDING → CONFIRMED
             */


            // Create ticket
            await api.post(
                "/tickets",
                {
                    bookingId: Number(bookingId)
                }
            );


            // Go to ticket page
            navigate(
                `/ticket/${bookingId}`
            );


        } catch (error) {

            console.error(error);

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Payment failed"
                );

            } else {

                setError(
                    "Unable to process payment"
                );

            }

        } finally {

            setProcessing(false);

        }
    };


    // Loading
    if (loading) {

        return (
            <div className="container py-5 text-center">

                <h2>
                    Loading payment...
                </h2>

            </div>
        );

    }


    // Error loading booking
    if (error && !booking) {

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

                <h2>
                    Booking not found
                </h2>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>

            </div>
        );

    }


    // Already confirmed
    if (booking.status === "CONFIRMED") {

        return (
            <div className="container py-5">

                <div className="payment-card mx-auto text-center">

                    <h1>
                        ✅ Booking Already Confirmed
                    </h1>

                    <p className="text-secondary mt-3">
                        This booking has already been paid for.
                    </p>

                    <button
                        className="btn btn-success mt-4"
                        onClick={() =>
                            navigate(
                                `/ticket/${bookingId}`
                            )
                        }
                    >
                        🎟️ View Ticket
                    </button>

                </div>

            </div>
        );

    }


    return (

        <div className="container py-5">


            {/* Heading */}

            <div className="text-center mb-5">

                <h1>
                    💳 Payment
                </h1>

                <p className="text-secondary">
                    Complete your payment to confirm your booking
                </p>

            </div>


            <div className="row g-4">


                {/* Booking Summary */}

                <div className="col-lg-5">

                    <div className="payment-card">

                        <h3>
                            🎬 Booking Summary
                        </h3>

                        <hr />

                        <h4>
                            {booking.movieName}
                        </h4>

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
                                : `${booking.numberOfSeats} seat(s)`}
                        </p>

                        <hr />

                        <div className="payment-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{booking.totalAmount}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* Payment Section */}

                <div className="col-lg-7">

                    <div className="payment-card">

                        <h3>
                            Select Payment Method
                        </h3>


                        {/* Error */}

                        {error && (

                            <div className="alert alert-danger mt-3">

                                {error}

                            </div>

                        )}


                        {/* Payment Methods */}

                        <div className="payment-methods mt-4">


                            {/* UPI */}

                            <button
                                type="button"
                                className={
                                    paymentMethod === "UPI"
                                        ? "payment-method active"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod("UPI")
                                }
                            >
                                📱 UPI
                            </button>


                            {/* Card */}

                            <button
                                type="button"
                                className={
                                    paymentMethod === "CARD"
                                        ? "payment-method active"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod("CARD")
                                }
                            >
                                💳 Card
                            </button>


                            {/* Net Banking */}

                            <button
                                type="button"
                                className={
                                    paymentMethod === "NET_BANKING"
                                        ? "payment-method active"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        "NET_BANKING"
                                    )
                                }
                            >
                                🏦 Net Banking
                            </button>

                        </div>


                        {/* UPI Form */}

                        {paymentMethod === "UPI" && (

                            <div className="mt-4 text-center">

                                <p className="text-secondary mb-3">
                                    Scan this QR code using any
                                    UPI app to pay
                                </p>

                                <div className="qr-container">
                                    <img
                                        src={paymentQr}
                                        alt="UPI payment QR code"
                                        style={{
                                            width: "220px",
                                            height: "220px",
                                            objectFit: "contain"
                                        }}
                                    />
                                </div>

                                <h3 className="mt-3">
                                    ₹{booking.totalAmount}
                                </h3>

                                <div className="text-start mt-4">
                                    <label className="form-label">
                                        UPI ID used for payment
                                        (optional)
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="example@upi"
                                        value={upiId}
                                        onChange={(e) =>
                                            setUpiId(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <p className="text-secondary mt-3 mb-0">
                                    <small>
                                        This confirms your payment
                                        was initiated. It is not
                                        verified by a live payment
                                        gateway.
                                    </small>
                                </p>

                            </div>

                        )}


                        {/* Card Form */}

                        {paymentMethod === "CARD" && (

                            <div className="mt-4">

                                <label className="form-label">
                                    Card Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    value={cardNumber}
                                    onChange={(e) =>
                                        setCardNumber(
                                            e.target.value
                                        )
                                    }
                                />


                                <div className="row">

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Expiry
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) =>
                                                setExpiry(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    <div className="col-md-6">

                                        <label className="form-label">
                                            CVV
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="123"
                                            maxLength="3"
                                            value={cvv}
                                            onChange={(e) =>
                                                setCvv(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* Net Banking */}

                        {paymentMethod === "NET_BANKING" && (

                            <div className="mt-4">

                                <label className="form-label">
                                    Select Bank
                                </label>

                                <select className="form-select">

                                    <option>
                                        Select Bank
                                    </option>

                                    <option>
                                        State Bank of India
                                    </option>

                                    <option>
                                        HDFC Bank
                                    </option>

                                    <option>
                                        ICICI Bank
                                    </option>

                                    <option>
                                        Axis Bank
                                    </option>

                                </select>

                            </div>

                        )}


                        {/* Pay Button */}

                        <button
                            className="btn btn-primary w-100 mt-4"
                            onClick={handlePayment}
                            disabled={processing}
                        >

                            {processing
                                ? "⏳ Processing..."
                                : paymentMethod === "UPI"
                                ? "✅ I Have Completed Payment"
                                : `💳 Pay ₹${booking.totalAmount}`
                            }

                        </button>


                        {/* Back */}

                        <button
                            className="btn btn-outline-light w-100 mt-3"
                            onClick={() =>
                                navigate(
                                    `/booking/${bookingId}`
                                )
                            }
                            disabled={processing}
                        >
                            ← Back to Booking
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Payment;