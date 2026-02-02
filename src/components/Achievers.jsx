import React from 'react';
import './Achievers.css';

const achieversData = [
    { img: 'images/WhatsApp Image 2026-02-01 at 7.09.04 PM.jpeg' },
    { img: 'images/WhatsApp Image 2026-02-01 at 7.08.55 PM (1).jpeg' },
    { img: 'images/WhatsApp Image 2026-02-01 at 7.08.56 PM (1).jpeg' },
    { img: 'images/WhatsApp Image 2026-02-01 at 7.08.56 PM.jpeg' },
    { img: 'images/WhatsApp Image 2026-02-01 at 7.08.55 PM.jpeg' },
];

const Achievers = () => {
    return (
        <section className="achievers-section">
            <h2 className="achievers-title">Medify <span>Hub</span> Achievers</h2>

            <div className="achievers-grid">
                {achieversData.map((student, index) => (
                    <div className="achiever-card" key={index}>
                        <img src={student.img} alt={student.name} className="student-img" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Achievers;
