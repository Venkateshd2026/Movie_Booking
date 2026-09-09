import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ExternalMovieDetails() {

    const { imdbId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState("");

    useEffect(() => {

        const loadDetails = async () => {

            try {

                setLoading(true);

                const response = await api.get(
                    `/external-movies/${imdbId}`
                );

                setMovie(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load movie details"
                );

            } finally {

                setLoading(false);
            }
        };

        loadDetails();

    }, [imdbId]);


    const handleBookNow = async () => {

        try {

            setImporting(true);
            setImportError("");

            // Import into the existing Movie table (or reuse
            // it if it was already imported before), then
            // continue straight into the existing booking flow
            // using the normal internal movie page.
            const response = await api.post(
                `/external-movies/import/${imdbId}`
            );

            navigate(`/movie/${response.data.id}`);

        } catch (error) {

            console.error(error);

            setImportError(
                error.response?.data?.message ||
                "Unable to start booking for this movie"
            );

        } finally {

            setImporting(false);
        }
    };


    if (loading) {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-4">
                        <div
                            className="skeleton-poster"
                            style={{ borderRadius: "20px" }}
                        />
                    </div>
                    <div className="col-md-8">
                        <div
                            className="skeleton-line"
                            style={{ height: "34px", width: "60%" }}
                        />
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

            {movie.poster && (
                <div
                    className="movie-backdrop"
                    style={{
                        backgroundImage: `url(${movie.poster})`
                    }}
                />
            )}

            <div
                className="container py-5"
                style={{ position: "relative" }}
            >

                <div className="row">

                    <div className="col-md-4">

                        <div className="movie-details-poster">

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

                    </div>

                    <div className="col-md-8">

                        <h1>{movie.title}</h1>

                        <p className="lead">
                            {movie.plot ||
                                "No description available."}
                        </p>

                        <div className="mt-3">

                            {movie.imdbRating && (
                                <span className="movie-meta-pill">
                                    ⭐ {movie.imdbRating} / 10
                                </span>
                            )}

                            {movie.language && (
                                <span className="movie-meta-pill">
                                    🌐 {movie.language}
                                </span>
                            )}

                            {movie.genre && (
                                <span className="movie-meta-pill">
                                    🎭 {movie.genre}
                                </span>
                            )}

                            {movie.runtime && (
                                <span className="movie-meta-pill">
                                    ⏱ {movie.runtime}
                                </span>
                            )}

                            {movie.released && (
                                <span className="movie-meta-pill">
                                    📅 {movie.released}
                                </span>
                            )}

                            {movie.rated && (
                                <span className="movie-meta-pill">
                                    🔞 {movie.rated}
                                </span>
                            )}

                        </div>

                        {importError && (
                            <div className="alert alert-danger mt-4">
                                {importError}
                            </div>
                        )}

                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleBookNow}
                            disabled={importing}
                        >
                            {importing
                                ? "Preparing Booking..."
                                : "🎟️ Book Now"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ExternalMovieDetails;
