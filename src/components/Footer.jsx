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
                    <img src="images/Institute Logo.jpeg" alt="Medify Hub Logo" className="footer-logo" style={{ width: '100px', borderRadius: '50%', background: '#000', height: '100px', margin: '0 100px' }} />
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
                {/* Right Column: Contact Info */}
                <div className="footer-col footer-contact">
                    <h4 className="footer-col-title">Get in Touch</h4>

                    <div className="contact-item-new">
                        <div className="contact-icon-box">
                            <svg className="footer-icon icon-phone" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </div>
                        <div className="contact-text">
                            <p>9952188735, 8946089533</p>
                            <p>8438174362</p>
                        </div>
                    </div>

                    <div className="contact-item-new">
                        <div className="contact-icon-box">
                            <svg className="footer-icon icon-email" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </div>
                        <div className="contact-text">
                            <a href="mailto:medifyhubhealthcaresolution@gmail.com" className="contact-link">medifyhubhealthcaresolution@gmail.com</a>
                        </div>
                    </div>

                    <div className="contact-item-new">
                        <div className="contact-icon-box">
                            <svg className="footer-icon icon-location" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                        <div className="contact-text">
                            <p>1/179, opposite to vinayagar temple,</p>
                            <p>Pollachi Main Road, Eachanari,</p>
                            <p>Coimbatore - 641021</p>
                        </div>
                    </div>

                    <div className="contact-social-new">
                        <a href="https://www.instagram.com/medifyhub__healthcaresolution?igsh=MWtoMTlsNm84MzAxdQ%3D%3D" target="_blank" rel="noopener noreferrer" className="social-icon-link instagram">
                            <svg className="footer-icon icon-instagram" viewBox="0 0 24 24">
                                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                            </svg>
                            <span>Follow on Instagram</span>
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="copyright">
                    &copy; 2026 Medify Hub Healthcare Solutions. All Rights Reserved.
                </div>
                <div className="design-credit" >
                    Design & Developed by <a href="mailto:webxtant.services@gmail.com" className="developer-link">WebXtant</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
