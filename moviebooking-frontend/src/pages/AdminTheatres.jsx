import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminTheatres() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);

    const [theatre, setTheatre] = useState({
        name: "",
        location: "",
        city: ""
    });


    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        loadTheatres();

    }, [user, navigate]);


    const loadTheatres = async () => {

        try {

            const response = await api.get("/theatres");

            setTheatres(response.data);

        } catch (error) {

            console.error(error);
            alert("Unable to load theatres");

        } finally {

            setLoading(false);

        }
    };


    const handleChange = (e) => {

        setTheatre({
            ...theatre,
            [e.target.name]: e.target.value
        });

    };


    const handleAddTheatre = async (e) => {

        e.preventDefault();

        try {

            await api.post(`/admin/theatres?userId=${user.id}`, {

                name: theatre.name,
                location: theatre.location,
                city: theatre.city

            });

            alert("Theatre added successfully!");

            setTheatre({
                name: "",
                location: "",
                city: ""
            });

            loadTheatres();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to add theatre"
            );

        }
    };


    const handleDeleteTheatre = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this theatre?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/theatres/${id}`);

            alert("Theatre deleted successfully!");

            loadTheatres();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete theatre"
            );

        }
    };


    if (loading) {

        return (
            <div className="container mt-5 text-center">
                <h2>Loading theatres...</h2>
            </div>
        );

    }


    return (

        <div className="container py-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1>🏢 Manage Theatres</h1>

                    <p className="text-secondary">
                        Add and manage movie theatres
                    </p>

                </div>


                <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/admin")}
                >
                    ← Admin Dashboard
                </button>

            </div>


            {/* ADD THEATRE */}

            <div className="admin-card mb-5">

                <h3 className="mb-4">
                    ➕ Add New Theatre
                </h3>


                <form onSubmit={handleAddTheatre}>

                    <div className="row g-3">


                        {/* NAME */}

                        <div className="col-md-6">

                            <label className="form-label">
                                Theatre Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={theatre.name}
                                onChange={handleChange}
                                placeholder="PVR Orion Mall"
                                required
                            />

                        </div>


                        {/* CITY */}

                        <div className="col-md-6">

                            <label className="form-label">
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                value={theatre.city}
                                onChange={handleChange}
                                placeholder="Bangalore"
                                required
                            />

                        </div>


                        {/* LOCATION */}

                        <div className="col-12">

                            <label className="form-label">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                value={theatre.location}
                                onChange={handleChange}
                                placeholder="Dr Rajkumar Road"
                                required
                            />

                        </div>


                        {/* BUTTON */}

                        <div className="col-12">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add Theatre
                            </button>

                        </div>

                    </div>

                </form>

            </div>


            {/* THEATRE LIST */}

            <div>

                <h2 className="mb-4">
                    📋 Existing Theatres
                </h2>


                {theatres.length === 0 ? (

                    <div className="text-center">

                        <p>
                            No theatres available.
                        </p>

                    </div>

                ) : (

                    <div className="row g-4">

                        {theatres.map((theatre) => (

                            <div
                                className="col-lg-4 col-md-6"
                                key={theatre.id}
                            >

                                <div className="admin-card h-100">

                                    <div className="admin-icon">
                                        🏢
                                    </div>


                                    <h3>
                                        {theatre.name}
                                    </h3>


                                    <p>
                                        📍 {theatre.location}
                                    </p>


                                    <p>
                                        🌆 {theatre.city}
                                    </p>


                                    <p>
                                        Theatre ID: #{theatre.id}
                                    </p>


                                    <button
                                        className="btn btn-danger w-100 mt-3"
                                        onClick={() =>
                                            handleDeleteTheatre(
                                                theatre.id
                                            )
                                        }
                                    >
                                        🗑 Delete Theatre
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default AdminTheatres;