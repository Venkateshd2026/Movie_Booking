import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchInput, setSearchInput] = useState("");
    const [query, setQuery] = useState("");

    const [externalResults, setExternalResults] = useState([]);
    const [externalLoading, setExternalLoading] = useState(false);
    const [externalError, setExternalError] = useState("");

    const [theatreCount, setTheatreCount] = useState(null);

    const [recentBooking, setRecentBooking] = useState(null);

    // Filters (Now Showing grid)
    const [genreFilter, setGenreFilter] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [sortBy, setSortBy] = useState("title");

    useEffect(() => {

        const getMovies = async () => {

            try {

                const response = await api.get("/movies");

                setMovies(response.data);

            } catch (error) {

                console.error(error);

                setError("Unable to load movies");

            } finally {

                setLoading(false);
            }
        };

        getMovies();

    }, []);

    useEffect(() => {

        const getTheatreCount = async () => {

            try {

                const response = await api.get("/theatres");

                setTheatreCount(response.data.length);

            } catch (error) {

                console.error(error);
                // Stats are a nice-to-have - fail silently
            }
        };

        getTheatreCount();

    }, []);

    useEffect(() => {

        if (!user) {

            setRecentBooking(null);
            return;
        }

        const getRecentBooking = async () => {

            try {

                const response = await api.get(
                    `/bookings/user/${user.id}`
                );

                const confirmedBookings = response.data.filter(
                    (booking) => booking.status === "CONFIRMED"
                );

                if (confirmedBookings.length > 0) {

                    // Bookings are returned in creation order -
                    // the last one is the most recent.
                    setRecentBooking(
                        confirmedBookings[confirmedBookings.length - 1]
                    );
                }

            } catch (error) {

                console.error(error);
                // Recent booking is a nice-to-have - fail silently
            }
        };

        getRecentBooking();

    }, [user]);

    const genres = useMemo(() => {
        const set = new Set(movies.map((m) => m.genre).filter(Boolean));
        return [...set].sort();
    }, [movies]);

    const languages = useMemo(() => {
        const set = new Set(movies.map((m) => m.language).filter(Boolean));
        return [...set].sort();
    }, [movies]);

    const filteredMovies = useMemo(() => {

        let result = movies;

        if (query.trim()) {
            const lowerQuery = query.trim().toLowerCase();
            result = result.filter((movie) =>
                movie.title?.toLowerCase().includes(lowerQuery)
            );
        }

        if (genreFilter) {
            result = result.filter((m) => m.genre === genreFilter);
        }

        if (languageFilter) {
            result = result.filter((m) => m.language === languageFilter);
        }

        result = [...result].sort((a, b) => {

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

    }, [movies, query, genreFilter, languageFilter, sortBy]);

    const handleSearchSubmit = (e) => {

        e.preventDefault();

        const trimmed = searchInput.trim();

        setQuery(trimmed);

        if (!trimmed) {

            setExternalResults([]);
            setExternalError("");
            return;
        }

        searchExternalMovies(trimmed);
    };

    const searchExternalMovies = async (title) => {

        try {

            setExternalLoading(true);
            setExternalError("");

            const response = await api.get(
                "/external-movies/search",
                { params: { title } }
            );

            setExternalResults(response.data);

        } catch (error) {

            console.error(error);

            setExternalResults([]);

            setExternalError(
                error.response?.data?.message ||
                "Unable to search movies online right now"
            );

        } finally {

            setExternalLoading(false);
        }
    };

    return (
        <div>

            {/* Hero Section */}
            <section className="hero-section">

                <div className="container">

                    <div className="hero-content">

                        <h1>
                            Book Your Movie Experience 🎬
                        </h1>

                        <p>
                            Discover the latest movies and book your
                            favourite seats in just a few clicks.
                        </p>

                        <form
                            className="search-bar"
                            onSubmit={handleSearchSubmit}
                        >
                            <span className="search-icon">🔍</span>

                            <input
                                type="text"
                                placeholder="Search movies by title..."
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(e.target.value)
                                }
                            />

                            <button type="submit">Search</button>
                        </form>

                    </div>

                </div>

            </section>


            {/* Quick Stats */}
            <section className="container">

                <div className="stats-row">

                    <div className="stat-card">
                        <h2>{movies.length}</h2>
                        <p>Movies Available</p>
                    </div>

                    <div className="stat-card">
                        <h2>
                            {theatreCount !== null ? theatreCount : "—"}
                        </h2>
                        <p>Theatres</p>
                    </div>

                    <div className="stat-card">
                        <h2>24/7</h2>
                        <p>Online Booking</p>
                    </div>

                </div>

            </section>


            {/* Recent Booking */}
            {user && recentBooking && (

                <section className="container pt-5">

                    <div className="section-heading mb-3">
                        <h2>Your Upcoming Booking</h2>
                    </div>

                    <div className="recent-booking-card">

                        <div className="recent-booking-icon">
                            🎬
                        </div>

                        <div className="recent-booking-info">

                            <h4>{recentBooking.movieName}</h4>

                            <p className="mb-1">
                                {recentBooking.theatreName} &middot;{" "}
                                {recentBooking.screenName}
                            </p>

                            <p className="mb-0 text-secondary">
                                📅 {recentBooking.showDate} &nbsp;
                                🕐 {recentBooking.showTime} &nbsp;
                                🎟️{" "}
                                {recentBooking.seatNumbers?.join(", ")}
                            </p>

                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(
                                    `/ticket/${recentBooking.bookingId}`
                                )
                            }
                        >
                            View Ticket
                        </button>

                    </div>

                </section>

            )}


            {/* Offers */}
            <section className="container py-5">

                <div className="section-heading mb-4">
                    <h2>Exclusive Offers</h2>
                    <p>Save more on your next movie outing</p>
                </div>

                <div className="row g-4">

                    <div className="col-md-4">
                        <div className="offer-card">
                            <h4>🍿 Weekend Combo</h4>
                            <p>
                                Get a free popcorn combo upgrade on
                                weekend shows.
                            </p>
                            <span className="offer-code">
                                WEEKEND10
                            </span>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="offer-card">
                            <h4>🎓 Student Special</h4>
                            <p>
                                Flat 15% off with a valid student ID
                                at select theatres.
                            </p>
                            <span className="offer-code">
                                STUDENT15
                            </span>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="offer-card">
                            <h4>👥 Group Booking</h4>
                            <p>
                                Book 5+ seats together and save on
                                your total.
                            </p>
                            <span className="offer-code">
                                GROUP5
                            </span>
                        </div>
                    </div>

                </div>

            </section>


            {/* Movies Section */}
            <section className="container py-5">

                <div className="d-flex justify-content-between align-items-center mb-3 section-heading">

                    <div>

                        <h2>
                            {query
                                ? `Results for "${query}"`
                                : "🎬 Now Showing"}
                        </h2>

                        <p>
                            {query
                                ? "Movies matching your search"
                                : "Choose a movie and book your tickets"}
                        </p>

                    </div>

                    {query && (
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => {
                                setQuery("");
                                setSearchInput("");
                                setExternalResults([]);
                                setExternalError("");
                            }}
                        >
                            Clear Search
                        </button>
                    )}

                </div>


                {/* Genre / Language / Sort filters */}
                {!query && movies.length > 0 && (

                    <div className="movie-filters">

                        <select
                            value={genreFilter}
                            onChange={(e) =>
                                setGenreFilter(e.target.value)
                            }
                        >
                            <option value="">All Genres</option>
                            {genres.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        <select
                            value={languageFilter}
                            onChange={(e) =>
                                setLanguageFilter(e.target.value)
                            }
                        >
                            <option value="">All Languages</option>
                            {languages.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="title">Sort: Title</option>
                            <option value="duration">
                                Sort: Duration
                            </option>
                            <option value="releaseDate">
                                Sort: Release Date
                            </option>
                        </select>

                    </div>

                )}


                {loading && (
                    <div className="movie-grid">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <div className="skeleton-card" key={n}>
                                <div className="skeleton-poster" />
                                <div className="skeleton-line" />
                                <div className="skeleton-line short" />
                            </div>
                        ))}
                    </div>
                )}


                {!loading && error && (
                    <div className="empty-state">
                        <div className="empty-icon">⚠️</div>
                        <h4>{error}</h4>
                    </div>
                )}


                {!loading && !error && filteredMovies.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            {query ? "🔎" : "🎬"}
                        </div>
                        <h4>
                            {query
                                ? "No movies match your search"
                                : "No movies match these filters"}
                        </h4>
                    </div>
                )}


                {!loading && !error && filteredMovies.length > 0 && (
                    <div className="movie-grid">

                        {filteredMovies.map((movie) => (

                            <div className="card movie-card" key={movie.id}>

                                {/* Movie Poster */}

                                <div className="movie-poster">

                                    {movie.posterUrl ? (

                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            onError={(e) => {
                                                e.target.style.display =
                                                    "none";
                                                e.target.nextSibling.style.display =
                                                    "flex";
                                            }}
                                        />

                                    ) : null}

                                    <div
                                        className="no-poster"
                                        style={{
                                            display: movie.posterUrl
                                                ? "none"
                                                : "flex"
                                        }}
                                    >
                                        🎬
                                    </div>

                                </div>


                                {/* Movie Details */}

                                <div className="card-body">

                                    <h4
                                        className="card-title"
                                        title={movie.title}
                                    >
                                        {movie.title}
                                    </h4>


                                    <p className="movie-description">
                                        {movie.description}
                                    </p>


                                    <div className="movie-info">

                                        <span>
                                            🌐 {movie.language}
                                        </span>

                                        <span>
                                            🎭 {movie.genre}
                                        </span>

                                    </div>


                                    <div className="movie-info">

                                        <span>
                                            ⏱ {movie.duration}m
                                        </span>

                                        <span>
                                            📅 {movie.releaseDate}
                                        </span>

                                    </div>


                                    {/* Book Tickets */}

                                    <Link
                                        to={`/movie/${movie.id}`}
                                        className="btn btn-primary w-100"
                                    >
                                        Book Tickets
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </section>


            {/* External (OMDb) search results */}

            {query && (

                <section className="container pb-5">

                    <div className="section-heading mb-4">
                        <h2>More Movies</h2>
                        <p>Results from the online movie database</p>
                    </div>

                    {externalLoading && (
                        <div className="movie-grid">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div className="skeleton-card" key={n}>
                                    <div className="skeleton-poster" />
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line short" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!externalLoading && externalError && (
                        <div className="empty-state">
                            <div className="empty-icon">⚠️</div>
                            <h4>{externalError}</h4>
                        </div>
                    )}

                    {!externalLoading &&
                        !externalError &&
                        externalResults.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">🔎</div>
                                <h4>
                                    No online results for "{query}"
                                </h4>
                            </div>
                        )}

                    {!externalLoading &&
                        !externalError &&
                        externalResults.length > 0 && (

                            <div className="movie-grid">

                                {externalResults.map((movie) => (

                                    <div
                                        className="card movie-card"
                                        key={movie.imdbId}
                                    >

                                        <div className="movie-poster">

                                            {movie.poster ? (
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                        e.target.nextSibling.style.display =
                                                            "flex";
                                                    }}
                                                />
                                            ) : null}

                                            <div
                                                className="no-poster"
                                                style={{
                                                    display: movie.poster
                                                        ? "none"
                                                        : "flex"
                                                }}
                                            >
                                                🎬
                                            </div>

                                        </div>

                                        <div className="card-body">

                                            <h4
                                                className="card-title"
                                                title={movie.title}
                                            >
                                                {movie.title}
                                            </h4>

                                            <p className="movie-info mb-0">
                                                <span>
                                                    📅 {movie.year}
                                                </span>
                                            </p>

                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() =>
                                                    navigate(
                                                        `/external-movie/${movie.imdbId}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </section>

            )}

        </div>
    );
}

export default Home;
