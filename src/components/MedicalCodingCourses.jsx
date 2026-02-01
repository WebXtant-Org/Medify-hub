import React from 'react';
import './MedicalCodingCourses.css';

const MedicalCodingCourses = () => {
    const courses = [
        {
            title: "Basic Medical Coding Training (BMCT)",
            desc: "BMCT builds strong biomedical knowledge, clinical technology skills, patient care expertise, and growing career opportunities in healthcare."
        },
        {
            title: "Advanced Medical Coding Training (AMCT)",
            desc: "AMCT certification builds advanced medical coding skills, clinical documentation knowledge, healthcare compliance expertise, and strong global career opportunities."
        },
        {
            title: "Certified Professional Coder (CPC)",
            desc: "CPC certification builds strong medical coding expertise, career credibility, global opportunities, healthcare compliance knowledge, and professional growth."
        },
        {
            title: "Certified Coding Specialist (CCS)",
            desc: "CCS certification proves advanced hospital coding expertise, inpatient accuracy, strong compliance knowledge, and high-demand healthcare career growth"
        },
        {
            title: "Certified Risk adjustment Coder (CRC)",
            desc: "CRC certification builds risk adjustment expertise, data accuracy skills, compliance knowledge, and strong career growth in healthcare."
        }
    ];

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
                        <button className="mcc-btn">View Course <span>&rarr;</span></button>
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
