import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <section className="about-section">
            <div className="about-container">

                {/* Left: Text Content */}
                <div className="about-content">
                    <h2 className="about-title"><span>About</span> Us</h2>

                    <p className="about-text">
                        Founded on November 11, 2024, by Ms. Boomika and Mr. Abubakkar Siddiq, Medify Hub was born from a shared vision to bridge the gap between education and industry requirements in medical coding.
                    </p>

                    <p className="about-text">
                        With passion, dedication, and a deep understanding of healthcare operations, the founders established Medify Hub to create a learning ecosystem that focuses on quality, integrity, and career outcomes.
                    </p>

                    <p className="about-text">
                        Medify Hub Healthcare Solution is a premier institute specializing in professional medical coding training and certification guidance, helping individuals build stable and rewarding careers in healthcare.
                    </p>
                </div>

                {/* Right: Image */}
                <div className="about-image-container">
                    {/* Placeholder Illustration matching generic business/office theme */}
                    <img
                        src='/images/aboutus.jpeg'
                        className="about-img"
                    />
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
