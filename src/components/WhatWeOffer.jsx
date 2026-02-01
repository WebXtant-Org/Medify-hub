import React from 'react';
import './WhatWeOffer.css';

const offers = [
    { text: "Expert Training", img: "images/wwo1.jpeg", side: "right" },
    { text: "Great Results", img: "images/wwo2.jpeg", side: "left" },
    { text: "Flexible Scheduling", img: "images/wwo3.jpeg", side: "right" },
    { text: "Online Learning Modules", img: "images/wwo4.jpeg", side: "left" },
];

const WhatWeOffer = () => {
    return (
        <section className="wwo-section">
            <div className="wwo-card-container">
                <h2 className="wwo-title">What <span>we</span> Offer</h2>

                <div className="wwo-list">
                    {offers.map((offer, index) => (
                        <div className={`wwo-item ${offer.side}`} key={index}>
                            <div className="wwo-bar">
                                <span className="wwo-text">{offer.text}</span>
                            </div>

                            <div className="wwo-img-wrapper">
                                <img src={offer.img} alt={offer.text} className="wwo-img" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeOffer;
