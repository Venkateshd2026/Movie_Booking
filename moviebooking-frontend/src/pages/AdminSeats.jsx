import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminSeats() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [screens, setScreens] = useState([]);
    const [seats, setSeats] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState("");
    const [loading, setLoading] = useState(true);

    const [seatData, setSeatData] = useState({
        seatNumber: "",
        seatType: "REGULAR",
        price: "",
        screenId: ""
    });

    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        loadScreens();

    }, [user, navigate]);


    const loadScreens = async () => {

        try {

            const response = await api.get("/screens");

            setScreens(response.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load screens");

        } finally {

            setLoading(false);

        }
    };


    const loadSeats = async (screenId) => {

        if (!screenId) {
            setSeats([]);
            return;
        }

        try {

            const response = await api.get(
                `/seats/screen/${screenId}`
            );

            setSeats(response.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load seats");

        }
    };


    const handleScreenChange = (e) => {

        const screenId = e.target.value;

        setSelectedScreen(screenId);

        setSeatData({
            ...seatData,
            screenId: screenId
        });

        loadSeats(screenId);

    };


    const handleChange = (e) => {

        setSeatData({
            ...seatData,
            [e.target.name]: e.target.value
        });

    };


    const handleAddSeat = async (e) => {

        e.preventDefault();

        if (!seatData.screenId) {
            alert("Please select a screen");
            return;
        }

        try {

            await api.post(`/admin/seats?userId=${user.id}`, {

                seatNumber: seatData.seatNumber,
                seatType: seatData.seatType,
                price: Number(seatData.price),

                screen: {
                    id: Number(seatData.screenId)
                }

            });

            alert("Seat added successfully!");

            setSeatData({
                ...seatData,
                seatNumber: "",
                price: ""
            });

            loadSeats(seatData.screenId);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to add seat"
            );

        }
    };


    const handleDeleteSeat = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this seat?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/seats/${id}`);

            alert("Seat deleted successfully!");

            loadSeats(selectedScreen);

        } catch (error) {

            console.error(error);

            alert("Unable to delete seat");

        }
    };


    if (loading) {

        return (
            <div className="container mt-5 text-center">
                <h2>Loading screens...</h2>
            </div>
        );

    }


    return (

        <div className="container py-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1>💺 Manage Seats</h1>

                    <p className="text-secondary">
                        Add and manage seats for each screen
                    </p>

                </div>

                <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/admin")}
                >
                    ← Admin Dashboard
                </button>

            </div>


            {/* SELECT SCREEN */}

            <div className="admin-card mb-4">

                <h3 className="mb-4">
                    🖥️ Select Screen
                </h3>

                <select
                    className="form-select"
                    value={selectedScreen}
                    onChange={handleScreenChange}
                >

                    <option value="">
                        -- Select Screen --
                    </option>

                    {screens.map((screen) => (

                        <option
                            key={screen.id}
                            value={screen.id}
                        >

                            {screen.name}
                            {" - "}
                            {screen.theatre?.name || "Theatre"}

                        </option>

                    ))}

                </select>

            </div>


            {/* ADD SEAT */}

            {selectedScreen && (

                <div className="admin-card mb-5">

                    <h3 className="mb-4">
                        ➕ Add Seat
                    </h3>

                    <form onSubmit={handleAddSeat}>

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Seat Number
                                </label>

                                <input
                                    type="text"
                                    name="seatNumber"
                                    className="form-control"
                                    value={seatData.seatNumber}
                                    onChange={handleChange}
                                    placeholder="A1"
                                    required
                                />

                            </div>


                            <div className="col-md-4">

                                <label className="form-label">
                                    Seat Type
                                </label>

                                <select
                                    name="seatType"
                                    className="form-select"
                                    value={seatData.seatType}
                                    onChange={handleChange}
                                >

                                    <option value="REGULAR">
                                        Regular
                                    </option>

                                    <option value="PREMIUM">
                                        Premium
                                    </option>

                                    <option value="RECLINER">
                                        Recliner
                                    </option>

                                </select>

                            </div>


                            <div className="col-md-4">

                                <label className="form-label">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    className="form-control"
                                    value={seatData.price}
                                    onChange={handleChange}
                                    placeholder="200"
                                    min="1"
                                    required
                                />

                            </div>


                            <div className="col-12">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add Seat
                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            )}


            {/* SEAT LIST */}

            {selectedScreen && (

                <div>

                    <h2 className="mb-4">
                        📋 Seats
                    </h2>


                    {seats.length === 0 ? (

                        <div className="text-center">

                            <p>
                                No seats created for this screen.
                            </p>

                        </div>

                    ) : (

                        <div className="seat-container">

                            {seats.map((seat) => (

                                <div
                                    key={seat.id}
                                    className="admin-seat-wrapper"
                                >

                                    <button
                                        className="seat"
                                    >
                                        {seat.seatNumber}
                                    </button>

                                    <small>
                                        ₹{seat.price}
                                    </small>

                                    <button
                                        className="btn btn-sm btn-danger mt-1"
                                        onClick={() =>
                                            handleDeleteSeat(seat.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>

    );
}

export default AdminSeats;