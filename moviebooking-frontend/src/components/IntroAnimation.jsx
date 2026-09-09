import { useEffect, useState } from "react";

function IntroAnimation({ onComplete }) {

    const [fadingOut, setFadingOut] = useState(false);

    useEffect(() => {

        const fadeTimer = setTimeout(() => {
            setFadingOut(true);
        }, 9500);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 10200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };

    }, [onComplete]);

    const handleSkip = () => {
        setFadingOut(true);
        setTimeout(onComplete, 500);
    };

    return (
        <div
            className={
                "movie-intro" + (fadingOut ? " fading-out" : "")
            }
        >

            <div className="mi-fog" />
            <div className="mi-spotlight left" />
            <div className="mi-spotlight right" />

            <div className="mi-reel">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#5a4a8a" strokeWidth="5" />
                    <circle cx="50" cy="50" r="10" fill="#2a2140" />
                    <circle cx="50" cy="22" r="9" fill="#221934" />
                    <circle cx="76" cy="38" r="9" fill="#221934" />
                    <circle cx="76" cy="66" r="9" fill="#221934" />
                    <circle cx="50" cy="82" r="9" fill="#221934" />
                    <circle cx="24" cy="66" r="9" fill="#221934" />
                    <circle cx="24" cy="38" r="9" fill="#221934" />
                </svg>
            </div>

            <div className="mi-filmstrip">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div className="mi-frame" key={i} />
                ))}
            </div>

            <div className="mi-poster p1">🚀</div>
            <div className="mi-poster p2">💫</div>
            <div className="mi-poster p3">💕</div>
            <div className="mi-poster p4">🗺️</div>

            <div className="mi-popcorn">
                <div className="mi-bucket" />
                <div className="mi-puff" />
                <div className="mi-puff" />
                <div className="mi-puff" />
                <div className="mi-puff" />
            </div>

            <div className="mi-floater" />
            <div className="mi-floater" />
            <div className="mi-floater" />

            {[
                { top: "15%", left: "45%", delay: "0.2s" },
                { top: "65%", left: "55%", delay: "1.1s" },
                { top: "30%", left: "65%", delay: "0.7s" },
                { top: "75%", left: "35%", delay: "1.6s" },
                { top: "45%", left: "20%", delay: "2.1s" },
                { top: "20%", left: "75%", delay: "0.4s" }
            ].map((p, i) => (
                <div
                    className="mi-particle"
                    key={i}
                    style={{
                        top: p.top,
                        left: p.left,
                        animationDelay: p.delay
                    }}
                />
            ))}

            <div className="mi-center">

                <div className="mi-clapper">🎬</div>

                <div className="mi-logo">
                    <span className="mi-movie">Movie</span>
                    <span className="mi-book">Book</span>
                </div>

                <div className="mi-tagline">
                    Your Next Favourite Movie Awaits
                </div>

            </div>

            <button className="mi-skip" onClick={handleSkip}>
                Skip Intro
            </button>

        </div>
    );
}

export default IntroAnimation;
