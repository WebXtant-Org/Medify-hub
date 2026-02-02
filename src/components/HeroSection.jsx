import { useEffect, useState } from "react";
import "./HeroSection.css";

const slides = [
  "/images/hero1.jpeg",
  "/images/hero2.jpeg",
  "/images/hero3.jpeg",
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Custom Easy-In-Out Cubic easing
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothScrollTo = (element, duration = 700) => {
    const start = window.scrollY;
    const target = element.getBoundingClientRect().top + window.scrollY - 100; // -100 for offset
    const distance = target - start;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(Math.min(timeElapsed / duration, 1)); // normalized time

      window.scrollTo(0, start + distance * run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (

    <div>
      <section className="hero">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}

        <div className="hero-content-wrapper">
          <div className="hero-overlay">
            <h1>
              South Asia’s <span>no.1 medical</span>
              <br />
              Coding Training Institute
            </h1>

            <p>
              At Medify Hub Healthcare Solution, we are committed to shaping
              successful healthcare careers through world-class medical coding
              education.
            </p>
          </div>

          <div>
            <button
              className="hero-btn"
              onClick={() => {
                const element = document.getElementById('courses');
                if (element) {
                  smoothScrollTo(element, 2000); // 2 seconds duration
                }
              }}
            >
              View Our Courses <span>→</span>
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

export default HeroCarousel;
