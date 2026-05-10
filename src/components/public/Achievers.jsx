'use client'
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import './Achievers.css';

const Achievers = () => {
    const [achievers, setAchievers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievers = async () => {
            try {
                const data = await apiClient('/achievers');
                setAchievers(data);
            } catch (err) {
                console.error('Failed to fetch achievers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievers();
    }, []);

    const staticAchievers = [
        { img: 'images/WhatsApp Image 2026-02-01 at 7.09.04 PM.jpeg' },
        { img: 'images/WhatsApp Image 2026-02-01 at 7.08.55 PM (1).jpeg' },
        { img: 'images/WhatsApp Image 2026-02-01 at 7.08.56 PM (1).jpeg' },
        { img: 'images/WhatsApp Image 2026-02-01 at 7.08.56 PM.jpeg' },
        { img: 'images/WhatsApp Image 2026-02-01 at 7.08.55 PM.jpeg' },
        { img: 'images/fathima_achiever.png' },
    ];

    const displayAchievers = achievers.length > 0 ? achievers.map(a => ({
        name: a.name,
        achievement: a.achievement,
        img: a.imageUrl,
        year: a.year
    })) : staticAchievers;

    return (
        <section className="achievers-section">
            <h2 className="achievers-title">Medify <span>Hub</span> Achievers</h2>

            <div className="achievers-grid">
                {displayAchievers.map((student, index) => (
                    <div className="achiever-card" key={index}>
                        <img src={student.img} alt={student.name || 'Achiever'} className="student-img" />
                        {student.name && (
                            <div className="achiever-info">
                                <h3>{student.name}</h3>
                                <p>{student.achievement}</p>
                                <span className="achiever-year">{student.year}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Achievers;
