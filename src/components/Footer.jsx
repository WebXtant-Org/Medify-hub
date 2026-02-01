import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <h2 className="footer-main-title">Contact</h2>

            <div className="footer-container">

                {/* Left Column: Brand */}
                <div className="footer-col footer-brand">
                    {/* Placeholder for Logo - Replaced with snake image logic or actual logo if available */}
                    <img src="images/Institute Logo.jpeg" alt="Medify Hub Logo" className="footer-logo" style={{ width: '100px', borderRadius: '50%', background: '#000', height: '100px',margin: '0 100px' }} />
                    <h3 className="footer-company-name">MEDIFY HUB HEALTHCARE SOLUTION</h3>
                    <p className="footer-slogan">
                        "Precision, Passion, and<br />
                        Professionalism at Medify Hub"
                    </p>
                </div>

                {/* Center Column: Courses */}
                <div className="footer-col footer-courses">
                    <h4 className="footer-col-title">Our Courses</h4>
                    <ul className="footer-course-list">
                        <li>1. Basic medical coding Training (BMCT)</li>
                        <li>2. Advanced medical coding Training (AMCT)</li>
                        <li>3. Certified Professional Coder (CPC)</li>
                        <li>4. Certified Risk adjustment Coder (CRC)</li>
                        <li>5. Certified Coding Specialist (CCS)</li>
                    </ul>
                </div>

                {/* Right Column: Contact Info */}
                <div className="footer-col footer-contact">
                    <div className="contact-item">
                        Contact Number : 9952188735, 8946089533,<br />
                        8438174362
                    </div>
                    <div className="contact-item">
                        Email ID : medifyhubhealthcaresolution@gmail.com
                    </div>
                    <div className="contact-item">
                        Address : 1/179, opposite to vinayagar temple,<br />
                        pollachi main road, eachanari, coimbatore - 641021
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="copyright">
                    &copy; 2026 Medify Hub Healthcare Solutions. All Rights Reserved.
                </div>
                <div className="design-credit">
                    Design & Developed by WEBXTANT
                </div>
            </div>
        </footer>
    );
};

export default Footer;
