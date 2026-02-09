import React, { useState } from 'react';
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        alert("Thank you for applying! We will contact you shortly.");
        onClose();
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
                        <input type="text" placeholder="Enter your full name" required />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="Enter your phone number" required />
                    </div>



                    <div className="form-group">
                        <label>Course Interested In</label>
                        <select required>
                            <option value="Medical Coding">Medical Coding</option>
                            <option value="Medical Billing">Medical Billing</option>
                            <option value="IP DRG">IP DRG</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">Register Now</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;
