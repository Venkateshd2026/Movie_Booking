import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminScreens() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [screens, setScreens] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);

    const [screen, setScreen] = useState({
        name: "",
        totalSeats: "",
        theatreId: ""
    });

    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        loadData();

    }, [user, navigate]);


    const loadData = async () => {

        try {

            const [screenResponse, theatreResponse] = await Promise.all([
                api.get("/screens"),
                api.get("/theatres")
            ]);

            setScreens(screenResponse.data);
            setTheatres(theatreResponse.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load screens or theatres");

        } finally {

            setLoading(false);

        }
    };


    const handleChange = (e) => {

        setScreen({
            ...screen,
            [e.target.name]: e.target.value
        });

    };


    const handleAddScreen = async (e) => {

        e.preventDefault();

        if (!screen.theatreId) {
            alert("Please select a theatre");
            return;
        }

        try {

            await api.post(`/admin/screens?userId=${user.id}`, {

                name: screen.name,
                totalSeats: Number(screen.totalSeats),
                theatre: {
                    id: Number(screen.theatreId)
                }

            });

            alert("Screen added successfully!");

            setScreen({
                name: "",
                totalSeats: "",
                theatreId: ""
            });

            loadData();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to add screen"
            );

        }
    };


    const handleDeleteScreen = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this screen?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/screens/${id}`);

            alert("Screen deleted successfully!");

            loadData();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete screen"
            );

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

                    <h1>🖥️ Manage Screens</h1>

                    <p className="text-secondary">
                        Create and manage theatre screens
                    </p>

                </div>

                <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/admin")}
                >
                    ← Admin Dashboard
                </button>

            </div>


            {/* ADD SCREEN */}

            <div className="admin-card mb-5">

                <h3 className="mb-4">
                    ➕ Add New Screen
                </h3>

                <form onSubmit={handleAddScreen}>

                    <div className="row g-3">

                        {/* SCREEN NAME */}

                        <div className="col-md-6">

                            <label className="form-label">
                                Screen Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={screen.name}
                                onChange={handleChange}
                                placeholder="Screen 1"
                                required
                            />

                        </div>


                        {/* TOTAL SEATS */}

                        <div className="col-md-6">

                            <label className="form-label">
                                Total Seats
                            </label>

                            <input
                                type="number"
                                name="totalSeats"
                                className="form-control"
                                value={screen.totalSeats}
                                onChange={handleChange}
                                placeholder="150"
                                min="1"
                                required
                            />

                        </div>


                        {/* THEATRE */}

                        <div className="col-12">

                            <label className="form-label">
                                Select Theatre
                            </label>

                            <select
                                name="theatreId"
                                className="form-select"
                                value={screen.theatreId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    -- Select Theatre --
                                </option>

                                {theatres.map((theatre) => (

                                    <option
                                        key={theatre.id}
                                        value={theatre.id}
                                    >
                                        {theatre.name} - {theatre.city}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* BUTTON */}

                        <div className="col-12">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add Screen
                            </button>

                        </div>

                    </div>

                </form>

            </div>


            {/* SCREEN LIST */}

            <h2 className="mb-4">
                📋 Existing Screens
            </h2>


            {screens.length === 0 ? (

                <div className="text-center">
                    <p>No screens available.</p>
                </div>

            ) : (

                <div className="row g-4">

                    {screens.map((screen) => (

                        <div
                            className="col-lg-4 col-md-6"
                            key={screen.id}
                        >

                            <div className="admin-card h-100">

                                <div className="admin-icon">
                                    🖥️
                                </div>

                                <h3>
                                    {screen.name}
                                </h3>

                                <p>
                                    🏢 Theatre:{" "}
                                    {screen.theatre?.name || "Unknown"}
                                </p>

                                <p>
                                    📍{" "}
                                    {screen.theatre?.city || "Unknown"}
                                </p>

                                <p>
                                    💺 Total Seats:{" "}
                                    <strong>
                                        {screen.totalSeats}
                                    </strong>
                                </p>

                                <p>
                                    Screen ID: #{screen.id}
                                </p>

                                <button
                                    className="btn btn-danger w-100 mt-3"
                                    onClick={() =>
                                        handleDeleteScreen(screen.id)
                                    }
                                >
                                    🗑 Delete Screen
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default AdminScreens;