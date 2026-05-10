'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import RegistrationModal from './RegistrationModal';
import WhatsAppFloating from './WhatsAppFloating';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const data = await apiClient(`/courses/${id}`);
                setCourse(data);
                window.scrollTo(0, 0);
            } catch (err) {
                console.error('Failed to fetch course details:', err);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCourse();
    }, [id, router]);

    if (loading) return <div className="loading">Loading...</div>;
    if (!course) return <div className="loading">Course not found</div>;

    return (
        <div className="course-details-page">
            <div className="cd-container">
                <header className="cd-header">
                    <h1 className="cd-title">{course.title}</h1>
                    <p className="cd-desc">{course.description || course.desc}</p>
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
                            <p>{course.details?.duration || course.duration}</p>
                        </div>
                        <div className="cd-info-card">
                            <h4>Eligibility</h4>
                            <p>{course.details?.eligibility || 'Graduates / Life Science Students'}</p>
                        </div>
                    </div>

                    {/* Highlights / Benefits */}
                    {course.highlights?.length > 0 && (
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
                    {course.details?.curriculum?.length > 0 && (
                        <div className="cd-section">
                            <h3>Curriculum Modules</h3>
                            <ul className="cd-list">
                                {course.details.curriculum.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Focus Areas (AMCT) */}
                    {course.focusAreas?.length > 0 && (
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
                            {course.examOverview.subjects?.length > 0 && (
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
                        <p>{course.details?.careerPath || 'Medical Coder, Auditor'}</p>
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
