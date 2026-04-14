import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    const [showMore, setShowMore] = useState(false);

    // Initial 4 items shown on page load
    const initialItems = [
        "/images/gallery-small-1.jpg",
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1770827251/quality_restoration_20260210161548582_wulxqy.mp4",
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1770828119/ai_repair_20260210161130363_1_ujctwu.mp4",
        "/images/gallery-small-2.jpg",
    ];

    // Additional items shown after clicking "Load More"
    const additionalItems = [
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1776177945/WhatsApp_Video_2026-04-13_at_10.44.37_PM_pvlxsg.mp4",
        "/images/WhatsApp Image 2026-04-13 at 10.44.35 PM.jpeg",
        "/images/WhatsApp Image 2026-04-13 at 10.44.36 PM (1).jpeg",
        "/images/WhatsApp Image 2026-04-13 at 10.44.36 PM (2).jpeg",
        "/images/WhatsApp Image 2026-04-13 at 10.44.36 PM.jpeg",
        "/images/WhatsApp Image 2026-04-13 at 10.44.37 PM (1).jpeg",
        "/images/WhatsApp Image 2026-04-13 at 10.44.37 PM.jpeg",
        "/images/WhatsApp Image 2026-04-13 at 10.44.35 PM (1).jpeg",
        // Certificate image removed as requested
    ];

    const allItems = [...initialItems, ...(showMore ? additionalItems : [])];

    const isVideo = (url) => url.includes('.mp4');

    return (
        <section className="gallery-section" id="gallery">
            <h2 className="gallery-title">Gallery</h2>

            <div className="gallery-grid">
                {allItems.map((item, index) => (
                    <div className="gallery-item" key={index}>
                        {isVideo(item) ? (
                            <video
                                src={item}
                                className="gallery-img"
                                playsInline
                                autoPlay
                                loop
                                muted
                            />
                        ) : (
                            <img src={item} alt={`Gallery item ${index + 1}`} className="gallery-img" />
                        )}
                    </div>
                ))}
            </div>

            <div className="load-more-container">
                <button className="load-more-btn" onClick={() => setShowMore(!showMore)}>
                    {showMore ? 'Show Less' : 'Load More'}
                </button>
            </div>
        </section>
    );
};

export default Gallery;
