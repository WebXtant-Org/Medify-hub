import React from 'react';
import './Achievers.css';

const achieversData = [
    { name: 'Kavya J S', score: '93%', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Thilagavathi', score: '82%', img: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Kavitha S', score: '82%', img: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'Kalvi.V', score: '81%', img: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { name: 'Sudhakar', score: '80%', img: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

const Achievers = () => {
    return (
        <section className="achievers-section">
            <h2 className="achievers-title">Medify <span>Hub</span> Achievers</h2>

            <div className="achievers-grid">
                {achieversData.map((student, index) => (
                    <div className="achiever-card" key={index}>
                        <div className="particles"></div>

                        {/* Logo Placeholder */}
                        {/* <div className="ac-card-logo">LOGO</div> */}

                        <h3 className="congrats-text">Congratulations</h3>
                        <p className="exam-success-text">CPC Exam Success</p>

                        <div className="student-img-container">
                            {/* Using placeholder images for now */}
                            <img src={student.img} alt={student.name} className="student-img" />
                        </div>

                        <div className="name-ribbon">
                            <h4 className="student-name">{student.name}</h4>
                        </div>

                        <div className="percentage">{student.score}</div>

                        <p className="card-footer-text">
                            ✨ Your commitment and discipline have paid off.<br />
                            Wishing you a bright and successful career in Medical Coding!
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Achievers;
