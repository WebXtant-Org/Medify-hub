'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/api/apiClient';
import './MedicalCodingCourses.css';

const MedicalCodingCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await apiClient('/courses');
                setCourses(data.filter(c => c.status === 'active'));
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="mcc-loading">Loading Courses...</div>;

    return (
        <section className="mcc-section">
            {/* HEADER SECTION with Caduceus Icon */}
            <div className="mcc-header">
                <img src="/images/snake.png" alt="" />
                <div className="mcc-title-container">
                    <h2 className="mcc-title">Our Specialized Medical Coding Courses</h2>
                </div>
            </div>

            <p className="mcc-subtitle">
                Medify Hub Healthcare Solution delivers industry-ready medical coding training with expert mentors and real-time healthcare curriculum.
            </p>

            {/* CARDS GRID */}
            <div className="mcc-grid">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <div className="mcc-card" key={index}>
                            <div className="mcc-card-header">
                                <StethoscopeIcon />
                                <h3 className="mcc-card-title">{course.title}</h3>
                            </div>
                            <p className="mcc-card-desc">{course.description || course.desc}</p>
                            <Link href={`/course/${course._id}`} className="mcc-btn">View Course <span>&rarr;</span></Link>
                        </div>
                    ))
                ) : (
                    <p>No courses available at the moment.</p>
                )}
            </div>
        </section>
    );
};

// Internal Stethoscope Icon Component for reuse
const StethoscopeIcon = () => (
    < img src="/logos/scope.svg" alt="" className='scope' />
);

export default MedicalCodingCourses;
