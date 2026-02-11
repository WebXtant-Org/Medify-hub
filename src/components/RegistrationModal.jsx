import React, { useState } from 'react';
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        course: "Medical Coding"
    });
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            const body = new URLSearchParams({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                course: formData.course
            });

            await fetch(
              "https://script.google.com/macros/s/AKfycbyj_ezNu3ENRj2F9s2xylrXehqDY-iHzOX2ZzqLP2TrWq0P91Hzb0mSTtGBj2IfPqRw/exec",
              

                {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body
                }
            );

            alert("Thank you! Registration successful.");
            onClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>Join Our Academy</h2>
                    <p>Start your career in Medical Coding today</p>
                </div>

                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Course Interested In</label>
                        <select
                            name="course"
                            required
                            value={formData.course}
                            onChange={handleChange}
                        >
                            <option value="Basic Medical Coding">Basic Medical Coding</option>
                            <option value="Advanced Medical Coding">Advanced Medical Coding</option>
                            <option value="Certified Professional Coder">Certified Professional Coder</option>
                            <option value="Certified Risk Adjustment Coder">Certified Risk Adjustment Coder</option>
                            <option value="Certified Coding Specialist">Certified Coding Specialist</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? "Submitting..." : "Register Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;
