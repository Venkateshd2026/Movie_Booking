import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function MovieDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadMovieData = async () => {

            try {

                // Get all movies
                const movieResponse = await api.get("/movies");

                // Find selected movie
                const selectedMovie = movieResponse.data.find(
                    (movie) => movie.id === Number(id)
                );

                if (!selectedMovie) {
                    setError("Movie not found");
                    return;
                }

                setMovie(selectedMovie);

                // Get shows for this movie
                const showResponse = await api.get(
                    `/shows/movie/${id}`
                );

                setShows(showResponse.data);

            } catch (error) {

                console.error(error);

                setError("Unable to load movie details");

            } finally {

                setLoading(false);
            }
        };

        loadMovieData();

    }, [id]);


    if (loading) {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-4">
                        <div className="skeleton-poster" style={{ borderRadius: "20px" }} />
                    </div>
                    <div className="col-md-8">
                        <div className="skeleton-line" style={{ height: "34px", width: "60%" }} />
                        <div className="skeleton-line" />
                        <div className="skeleton-line short" />
                    </div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="empty-state">
                <div className="empty-icon">⚠️</div>
                <h4>{error}</h4>
            </div>
        );
    }


    return (
        <div>

            {/* Blurred backdrop using the poster */}
            {movie.posterUrl && (
                <div
                    className="movie-backdrop"
                    style={{
                        backgroundImage: `url(${movie.posterUrl})`
                    }}
                />
            )}

            <div className="container py-5" style={{ position: "relative" }}>

                {/* Movie Details */}

                <div className="row">

                    <div className="col-md-4">

                        <div className="movie-details-poster">

                            {movie.posterUrl ? (

                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    onError={(e) => {
                                        e.target.style.display = "none";
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

                    </div>


                    <div className="col-md-8">

                        <h1>{movie.title}</h1>

                        <p className="lead">
                            {movie.description}
                        </p>

                        <div className="mt-3">

                            <span className="movie-meta-pill">
                                🌐 {movie.language}
                            </span>

                            <span className="movie-meta-pill">
                                🎭 {movie.genre}
                            </span>

                            <span className="movie-meta-pill">
                                ⏱ {movie.duration} min
                            </span>

                            <span className="movie-meta-pill">
                                📅 {movie.releaseDate}
                            </span>

                        </div>

                    </div>

                </div>


                {/* Shows */}

                <div className="mt-5 section-heading">

                    <h2>Available Shows</h2>

                    {shows.length === 0 ? (

                        <div className="empty-state">
                            <div className="empty-icon">🎟️</div>
                            <h4>
                                No shows available for this movie yet
                            </h4>
                        </div>

                    ) : (

                        <div className="row g-4 mt-2">

                            {shows.map((show) => (

                                <div
                                    className="col-md-6 col-lg-4"
                                    key={show.id}
                                >

                                    <div className="card show-card h-100">

                                        <div className="card-body">

                                            <h4>
                                                {show.theatre.name}
                                            </h4>

                                            <p>
                                                📍 {show.theatre.city}
                                            </p>

                                            <p>
                                                🖥 {show.screen.name}
                                            </p>

                                            <p>
                                                📅 {show.showDate}
                                            </p>

                                            <h5>
                                                🕐 {show.showTime}
                                            </h5>

                                            <p>
                                                💰 ₹{show.ticketPrice}
                                            </p>

                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() =>
                                                    navigate(
                                                        `/seats/${show.id}`
                                                    )
                                                }
                                            >
                                                Select Seats
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default MovieDetails;
