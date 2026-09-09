import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

function AdminMovies() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);

    const [movie, setMovie] = useState({
        title: "",
        description: "",
        language: "",
        genre: "",
        duration: "",
        releaseDate: "",
        posterUrl: ""
    });

    // Filters
    const [search, setSearch] = useState("");
    const [genreFilter, setGenreFilter] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("title");

    useEffect(() => {
        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        loadMovies();
    }, [user, navigate]);

    const loadMovies = async () => {
        try {
            const response = await api.get("/movies");
            setMovies(response.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load movies");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();

        try {
            await api.post(`/admin/movies?userId=${user.id}`, {
                title: movie.title,
                description: movie.description,
                language: movie.language,
                genre: movie.genre,
                duration: Number(movie.duration),
                releaseDate: movie.releaseDate,
                posterUrl: movie.posterUrl
            });

            alert("Movie added successfully!");

            setMovie({
                title: "",
                description: "",
                language: "",
                genre: "",
                duration: "",
                releaseDate: "",
                posterUrl: ""
            });

            setShowAddForm(false);

            loadMovies();

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to add movie");
        }
    };

    const handleDeleteMovie = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this movie?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/movies/${id}`);

            alert("Movie deleted successfully!");

            loadMovies();

        } catch (error) {
            console.error(error);
            alert("Unable to delete movie");
        }
    };

    // A movie's status is derived from its release date, since
    // that is the only date field the Movie model has. There is
    // no "end date" concept in the data model, so nothing can
    // ever be computed as "Ended" - that stat is shown as 0
    // rather than invented.
    const getStatus = (movieItem) => {

        if (!movieItem.releaseDate) {
            return "now-showing";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const release = new Date(movieItem.releaseDate);

        return release > today ? "upcoming" : "now-showing";
    };

    const genres = useMemo(() => {
        const set = new Set(
            movies.map((m) => m.genre).filter(Boolean)
        );
        return [...set].sort();
    }, [movies]);

    const languages = useMemo(() => {
        const set = new Set(
            movies.map((m) => m.language).filter(Boolean)
        );
        return [...set].sort();
    }, [movies]);

    const stats = useMemo(() => {

        const nowShowing = movies.filter(
            (m) => getStatus(m) === "now-showing"
        ).length;

        const upcoming = movies.filter(
            (m) => getStatus(m) === "upcoming"
        ).length;

        return {
            total: movies.length,
            nowShowing,
            upcoming,
            ended: 0
        };

    }, [movies]);

    const filteredMovies = useMemo(() => {

        let result = [...movies];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((m) =>
                m.title?.toLowerCase().includes(q)
            );
        }

        if (genreFilter) {
            result = result.filter((m) => m.genre === genreFilter);
        }

        if (languageFilter) {
            result = result.filter(
                (m) => m.language === languageFilter
            );
        }

        if (statusFilter) {
            result = result.filter(
                (m) => getStatus(m) === statusFilter
            );
        }

        result.sort((a, b) => {

            if (sortBy === "title") {
                return (a.title || "").localeCompare(b.title || "");
            }

            if (sortBy === "duration") {
                return (a.duration || 0) - (b.duration || 0);
            }

            if (sortBy === "releaseDate") {
                return (
                    new Date(a.releaseDate || 0) -
                    new Date(b.releaseDate || 0)
                );
            }

            return 0;
        });

        return result;

    }, [movies, search, genreFilter, languageFilter, statusFilter, sortBy]);

    return (
        <AdminLayout title="Movies">

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">

                <div>
                    <h2 style={{ color: "var(--text)", fontSize: "22px" }}>
                        Movies
                    </h2>
                    <p style={{ color: "var(--text-muted)" }}>
                        Manage all movies available for booking.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm((v) => !v)}
                >
                    {showAddForm ? "✕ Close" : "+ Add Movie"}
                </button>

            </div>


            {/* Summary Stats */}
            <div className="admin-stats-row">

                <div className="admin-stat-mini">
                    <div className="stat-icon">🎬</div>
                    <h3>{stats.total}</h3>
                    <p>Total Movies</p>
                </div>

                <div className="admin-stat-mini">
                    <div className="stat-icon">🟢</div>
                    <h3>{stats.nowShowing}</h3>
                    <p>Now Showing</p>
                </div>

                <div className="admin-stat-mini">
                    <div className="stat-icon">🟣</div>
                    <h3>{stats.upcoming}</h3>
                    <p>Upcoming</p>
                </div>

                <div className="admin-stat-mini">
                    <div className="stat-icon">⚪</div>
                    <h3>{stats.ended}</h3>
                    <p>Ended</p>
                </div>

            </div>


            {/* Add Movie Form */}
            {showAddForm && (

                <div className="admin-card mb-4">

                    <h3 className="mb-4">➕ Add New Movie</h3>

                    <form onSubmit={handleAddMovie}>

                        <div className="row g-3">

                            <div className="col-md-6">
                                <label className="form-label">
                                    Movie Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    value={movie.title}
                                    onChange={handleChange}
                                    placeholder="Enter movie title"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    name="language"
                                    className="form-control"
                                    value={movie.language}
                                    onChange={handleChange}
                                    placeholder="English"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Genre
                                </label>
                                <input
                                    type="text"
                                    name="genre"
                                    className="form-control"
                                    value={movie.genre}
                                    onChange={handleChange}
                                    placeholder="Action"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    className="form-control"
                                    value={movie.duration}
                                    onChange={handleChange}
                                    placeholder="150"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Release Date
                                </label>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    className="form-control"
                                    value={movie.releaseDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Poster URL
                                </label>
                                <input
                                    type="text"
                                    name="posterUrl"
                                    className="form-control"
                                    value={movie.posterUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/poster.jpg"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    value={movie.description}
                                    onChange={handleChange}
                                    placeholder="Enter movie description"
                                />
                            </div>

                            <div className="col-12">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add Movie
                                </button>
                            </div>

                        </div>

                    </form>

                </div>

            )}


            {/* Filters */}
            <div className="admin-filters">

                <input
                    type="text"
                    placeholder="🔍 Search movies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                >
                    <option value="">All Genres</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>

                <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                >
                    <option value="">All Languages</option>
                    {languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="title">Sort: Title</option>
                    <option value="duration">Sort: Duration</option>
                    <option value="releaseDate">Sort: Release Date</option>
                </select>

            </div>


            {/* Movie Grid */}
            {loading ? (

                <p style={{ color: "var(--text-muted)" }}>
                    Loading movies...
                </p>

            ) : filteredMovies.length === 0 ? (

                <div className="empty-state">
                    <div className="empty-icon">🎬</div>
                    <h4 style={{ color: "var(--text)" }}>
                        No movies match these filters
                    </h4>
                </div>

            ) : (

                <div className="admin-movie-grid">

                    {filteredMovies.map((m) => {

                        const status = getStatus(m);

                        return (

                            <div className="admin-movie-card" key={m.id}>

                                <div className="admin-poster">

                                    <span
                                        className={
                                            "admin-status-badge " +
                                            status
                                        }
                                    >
                                        {status === "upcoming"
                                            ? "Upcoming"
                                            : "Now Showing"}
                                    </span>

                                    {m.posterUrl ? (
                                        <img
                                            src={m.posterUrl}
                                            alt={m.title}
                                            onError={(e) => {
                                                e.target.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="no-poster">
                                            🎬
                                        </div>
                                    )}

                                </div>

                                <div className="admin-movie-card-body">

                                    <h5 title={m.title}>
                                        {m.title}
                                    </h5>

                                    <div className="admin-movie-meta">
                                        <span>{m.genre}</span>
                                        <span>&middot;</span>
                                        <span>{m.language}</span>
                                        <span>&middot;</span>
                                        <span>{m.duration}m</span>
                                    </div>

                                    <div className="admin-movie-actions">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/movie/${m.id}`
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="danger"
                                            onClick={() =>
                                                handleDeleteMovie(m.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </AdminLayout>
    );
}

export default AdminMovies;
