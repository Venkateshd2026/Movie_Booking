import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminShows() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [shows, setShows] = useState([]);

    const [movieId, setMovieId] = useState("");
    const [theatreId, setTheatreId] = useState("");
    const [screenId, setScreenId] = useState("");
    const [showDate, setShowDate] = useState("");
    const [showTime, setShowTime] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        loadData();

    }, [user]);

    const loadData = async () => {

        try {

            const moviesResponse = await api.get("/movies");
            const theatresResponse = await api.get("/theatres");
            const screensResponse = await api.get("/screens");
            const showsResponse = await api.get("/shows");

            setMovies(moviesResponse.data);
            setTheatres(theatresResponse.data);
            setScreens(screensResponse.data);
            setShows(showsResponse.data);

        } catch (error) {

            console.error(error);
            setError("Unable to load data");

        }
    };

    const handleTheatreChange = (e) => {

        setTheatreId(e.target.value);

        // Reset screen when theatre changes
        setScreenId("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!movieId || !theatreId || !screenId ||
            !showDate || !showTime || !ticketPrice) {

            setError("Please fill all fields");
            return;
        }

        try {

            const selectedScreen = screens.find(
                screen => screen.id === Number(screenId)
            );

            if (
                selectedScreen &&
                selectedScreen.theatre &&
                selectedScreen.theatre.id !== Number(theatreId)
            ) {
                setError("Selected screen does not belong to selected theatre");
                return;
            }

            const showData = {

                movie: {
                    id: Number(movieId)
                },

                theatre: {
                    id: Number(theatreId)
                },

                screen: {
                    id: Number(screenId)
                },

                showDate: showDate,

                showTime: showTime,

                ticketPrice: Number(ticketPrice)
            };

            await api.post(
                `/admin/shows?userId=${user.id}`,
                showData
            );

            setMessage("Show added successfully!");

            // Clear form
            setMovieId("");
            setTheatreId("");
            setScreenId("");
            setShowDate("");
            setShowTime("");
            setTicketPrice("");

            // Reload shows
            const response = await api.get("/shows");
            setShows(response.data);

        } catch (error) {

            console.error(error);

            if (error.response?.data) {
                setError(
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Unable to add show"
                );
            } else {
                setError("Unable to add show");
            }
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this show?")) {
            return;
        }

        try {

            await api.delete(`/shows/${id}`);

            setShows(
                shows.filter(show => show.id !== id)
            );

            setMessage("Show deleted successfully!");

        } catch (error) {

            console.error(error);
            setError("Unable to delete show");

        }
    };

    // Only show screens belonging to selected theatre
    const filteredScreens = screens.filter(
        screen =>
            screen.theatre &&
            screen.theatre.id === Number(theatreId)
    );

    return (

        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h1>🎬 Manage Shows</h1>
                    <p className="text-secondary">
                        Add and manage movie shows
                    </p>
                </div>

                <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/admin")}
                >
                    ← Admin Dashboard
                </button>

            </div>

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Add Show */}

            <div className="admin-card mb-5">

                <h3 className="mb-4">
                    ➕ Add New Show
                </h3>

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        {/* Movie */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Movie
                            </label>

                            <select
                                className="form-select"
                                value={movieId}
                                onChange={(e) =>
                                    setMovieId(e.target.value)
                                }
                            >

                                <option value="">
                                    Select Movie
                                </option>

                                {movies.map(movie => (

                                    <option
                                        key={movie.id}
                                        value={movie.id}
                                    >
                                        {movie.title}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* Theatre */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Theatre
                            </label>

                            <select
                                className="form-select"
                                value={theatreId}
                                onChange={handleTheatreChange}
                            >

                                <option value="">
                                    Select Theatre
                                </option>

                                {theatres.map(theatre => (

                                    <option
                                        key={theatre.id}
                                        value={theatre.id}
                                    >
                                        {theatre.name} - {theatre.city}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* Screen */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Screen
                            </label>

                            <select
                                className="form-select"
                                value={screenId}
                                onChange={(e) =>
                                    setScreenId(e.target.value)
                                }
                                disabled={!theatreId}
                            >

                                <option value="">
                                    {theatreId
                                        ? "Select Screen"
                                        : "Select Theatre First"
                                    }
                                </option>

                                {filteredScreens.map(screen => (

                                    <option
                                        key={screen.id}
                                        value={screen.id}
                                    >
                                        {screen.name}
                                        {" - "}
                                        {screen.totalSeats} seats
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* Ticket Price */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Ticket Price (₹)
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter ticket price"
                                value={ticketPrice}
                                onChange={(e) =>
                                    setTicketPrice(e.target.value)
                                }
                                min="1"
                            />

                        </div>

                        {/* Date */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Show Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={showDate}
                                onChange={(e) =>
                                    setShowDate(e.target.value)
                                }
                            />

                        </div>

                        {/* Time */}

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Show Time
                            </label>

                            <input
                                type="time"
                                className="form-control"
                                value={showTime}
                                onChange={(e) =>
                                    setShowTime(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary mt-3"
                    >
                        🎬 Add Show
                    </button>

                </form>

            </div>

            {/* Existing Shows */}

            <div className="admin-card">

                <h3 className="mb-4">
                    📋 Existing Shows
                </h3>

                {shows.length === 0 ? (

                    <p className="text-secondary">
                        No shows available.
                    </p>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Movie</th>
                                    <th>Theatre</th>
                                    <th>Screen</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {shows.map(show => (

                                    <tr key={show.id}>

                                        <td>
                                            {show.id}
                                        </td>

                                        <td>
                                            {show.movie?.title || "-"}
                                        </td>

                                        <td>
                                            {show.theatre?.name || "-"}
                                        </td>

                                        <td>
                                            {show.screen?.name || "-"}
                                        </td>

                                        <td>
                                            {show.showDate}
                                        </td>

                                        <td>
                                            {show.showTime}
                                        </td>

                                        <td>
                                            ₹{show.ticketPrice}
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(show.id)
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

                )}

            </div>

        </div>
    );
}

export default AdminShows;