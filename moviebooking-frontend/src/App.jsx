import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntroAnimation from "./components/IntroAnimation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MovieDetails from "./pages/MovieDetails";
import ExternalMovieDetails from "./pages/ExternalMovieDetails";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import MyTickets from "./pages/MyTickets";
import Ticket from "./pages/Ticket";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMovies from "./pages/AdminMovies";
import AdminTheatres from "./pages/AdminTheatres";
import AdminScreens from "./pages/AdminScreens";
import AdminSeats from "./pages/AdminSeats";
import AdminShows from "./pages/AdminShows";
import AdminBookings from "./pages/AdminBookings";
import BookingDetails from "./pages/BookingDetails";

function App() {

    const [showIntro, setShowIntro] = useState(
        () => !sessionStorage.getItem("introShown")
    );

    const handleIntroComplete = () => {
        sessionStorage.setItem("introShown", "true");
        setShowIntro(false);
    };

    return (

        <BrowserRouter>

            {showIntro && (
                <IntroAnimation onComplete={handleIntroComplete} />
            )}

            <Navbar />

            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Home />} />

                <Route
                    path="/movie/:id"
                    element={<MovieDetails />}
                />

                <Route
                    path="/external-movie/:imdbId"
                    element={<ExternalMovieDetails />}
                />

                <Route
                    path="/seats/:showId"
                    element={<SeatSelection />}
                />

                <Route
                    path="/payment/:bookingId"
                    element={<Payment />}
                />

                <Route
                    path="/bookings/user/:userId"
                    element={<MyBookings />}
                />

                <Route
                    path="/tickets/user/:userId"
                    element={<MyTickets />}
                />

                <Route
                    path="/ticket/:bookingId"
                    element={<Ticket />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />
                <Route path="/admin/movies" element={<AdminMovies />} />
                <Route
    path="/admin/theatres"
    element={<AdminTheatres />}
/>

        <Route
    path="/admin/screens"
    element={<AdminScreens />}
/>
<Route
    path="/admin/seats"
    element={<AdminSeats />}
/>
<Route path="/admin/shows" element={<AdminShows />} />
<Route
    path="/admin/bookings"
    element={<AdminBookings />}
/>
<Route
    path="/booking/:bookingId"
    element={<BookingDetails />}
/>
            </Routes>

            <Footer />

        </BrowserRouter>

    );
}

export default App;