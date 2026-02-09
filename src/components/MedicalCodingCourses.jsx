import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import './MedicalCodingCourses.css';

const MedicalCodingCourses = () => {


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
                {courses.map((course, index) => (
                    <div className="mcc-card" key={index}>
                        <div className="mcc-card-header">
                            <StethoscopeIcon />
                            <h3 className="mcc-card-title">{course.title}</h3>
                        </div>
                        <p className="mcc-card-desc">{course.desc}</p>
                        <Link to={`/course/${course.id}`} className="mcc-btn">View Course <span>&rarr;</span></Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Internal Stethoscope Icon Component for reuse
const StethoscopeIcon = () => (
    < img src="/logos/scope.svg" alt="" className='scope' />
);

export default MedicalCodingCourses;
