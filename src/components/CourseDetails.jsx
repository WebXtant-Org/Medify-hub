import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';
import RegistrationModal from './RegistrationModal';
import WhatsAppFloating from './WhatsAppFloating';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const foundCourse = courses.find(c => c.id === id);
        if (foundCourse) {
            setCourse(foundCourse);
            window.scrollTo(0, 0);
        } else {
            navigate('/');
        }
    }, [id, navigate]);

    if (!course) return <div className="loading">Loading...</div>;

    return (
        <div className="course-details-page">
            <div className="cd-container">
                <header className="cd-header">
                    <h1 className="cd-title">{course.title}</h1>
                    <p className="cd-desc">{course.desc}</p>
                </header>

                <div className="cd-content">
                    {/* Full Description */}
                    {course.fullDescription && (
                        <div className="cd-section">
                            <p className="cd-full-desc">{course.fullDescription}</p>
                        </div>
                    )}

                    {/* Key Info Grid */}
                    <div className="cd-info-grid">
                        <div className="cd-info-card">
                            <h4>Duration</h4>
                            <p>{course.details.duration}</p>
                        </div>
                        <div className="cd-info-card">
                            <h4>Eligibility</h4>
                            <p>{course.details.eligibility}</p>
                        </div>
                    </div>

                    {/* Highlights / Benefits */}
                    {course.highlights && (
                        <div className="cd-section">
                            <h3>Key Highlights & Benefits</h3>
                            <ul className="cd-list highlights-list">
                                {course.highlights.map((item, index) => (
                                    <li key={index}>✅ {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Curriculum */}
                    <div className="cd-section">
                        <h3>Curriculum Modules</h3>
                        <ul className="cd-list">
                            {course.details.curriculum.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Focus Areas (AMCT) */}
                    {course.focusAreas && (
                        <div className="cd-section">
                            <h3>Training Focus Areas</h3>
                            <ul className="cd-list">
                                {course.focusAreas.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Exam Overview */}
                    {course.examOverview && (
                        <div className="cd-section exam-section">
                            <h3>Certification Exam Overview</h3>
                            <div className="cd-exam-grid">
                                <div className="exam-item">
                                    <span>Duration:</span> {course.examOverview.duration}
                                </div>
                                <div className="exam-item">
                                    <span>Pattern:</span> {course.examOverview.pattern}
                                </div>
                                <div className="exam-item">
                                    <span>Passing Score:</span> {course.examOverview.passingScore}
                                </div>
                            </div>
                            {course.examOverview.subjects && (
                                <div className="exam-subjects">
                                    <h4>Subjects Covered:</h4>
                                    <ul>
                                        {course.examOverview.subjects.map((sub, idx) => (
                                            <li key={idx}>{sub}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="cd-section">
                        <h3>Career Path</h3>
                        <p>{course.details.careerPath}</p>
                    </div>

                    <div className="cd-actions">
                        <button className="cd-apply-btn" onClick={() => setOpenModal(true)}>
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            <RegistrationModal isOpen={openModal} onClose={() => setOpenModal(false)} />
            <WhatsAppFloating phone="9952188735" />
        </div>
    );
};

export default CourseDetails;
