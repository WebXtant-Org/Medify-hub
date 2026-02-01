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

  return (

    <div>
      <section
        className="hero"
        style={{ backgroundImage: `url(${slides[index]})` }}
      >
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
          <div>
            <button className="hero-btn">
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
