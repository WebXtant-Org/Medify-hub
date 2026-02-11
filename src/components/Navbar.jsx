import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import RegistrationModal from "./RegistrationModal";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Custom Easy-In-Out Cubic easing
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothScrollTo = (element, duration = 800) => {
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

  const handleScroll = (id) => {
    setOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        smoothScrollTo(element, 1500);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) smoothScrollTo(element, 1500);
      }, 100);
    }
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* LEFT */}
          <div className="navbar-left">
            <img src='images/Institute Logo.jpeg' alt="Medify Hub Logo" className="navbar-logo" />
            <span className="navbar-title">
              MEDIFY HUB HEALTHCARE SOLUTION
            </span>
          </div>

          {/* CENTER (Desktop only) */}
          <nav className="navbar-center">
            <span onClick={() => handleScroll("home")} className="nav-link">Home</span>
            <span onClick={() => handleScroll("about")} className="nav-link">About Us</span>
            <span onClick={() => handleScroll("courses")} className="nav-link">Course</span>
            <span onClick={() => handleScroll("contact")} className="nav-link">Contact</span>
          </nav>

          {/* RIGHT */}
          <div className="navbar-right">
            <button className="apply-btn" onClick={() => setOpenModal(true)}>Apply Now</button>

            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${open ? "open" : ""}`}>
          <span onClick={() => handleScroll("home")}>Home</span>
          <span onClick={() => handleScroll("about")}>About Us</span>
          <span onClick={() => handleScroll("courses")}>Course</span>
          <span onClick={() => handleScroll("contact")}>contact</span>
          <div className="mobile-apply-wrapper">
            <button className="apply-btn mobile-apply-btn" onClick={() => { setOpenModal(true); setOpen(false); }}>Apply Now</button>
          </div>
        </div>
      </header>

      <RegistrationModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Navbar;
