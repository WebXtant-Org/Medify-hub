import React from 'react';
import './MissionVision.css';

const MissionVision = () => {
    return (
        <section className="mv-section">

            {/* MISSION (Left) */}
            <div className="mv-box mission">
                <h2 className="mv-title">Mission</h2>
                <p className="mv-text">
                    To empower aspiring healthcare professionals with accurate coding knowledge, practical exposure, and ethical standards, enabling them to excel in the ever-evolving healthcare industry.
                </p>
            </div>

            {/* VISION (Right) */}
            <div className="mv-box vision">
                <h2 className="mv-title">Vision</h2>
                <p className="mv-text">
                    To empower aspiring healthcare professionals with accurate coding knowledge, practical exposure, and ethical standards, enabling them to excel in the ever-evolving healthcare industry.
                </p>
            </div>

        </section>
    );
};

export default MissionVision;
