import React from 'react';
import './Gallery.css';

const Gallery = () => {
    // Placeholder images from placehold.co (lighter grey background, no text if possible or simple text)
    const images = [
        "/images/gallery-small-1.jpg", // Square-ish
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1770827251/quality_restoration_20260210161548582_wulxqy.mp4", // Wide
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1770828119/ai_repair_20260210161130363_1_ujctwu.mp4", // Wide
        "/images/gallery-small-2.jpg", // Square-ish
    ];

    return (
        <section className="gallery-section">
            <h2 className="gallery-title">Gallery</h2>

            <div className="gallery-grid">
                {images.map((img, index) => (
                    <div className="gallery-item" key={index}>
                        {img.endsWith('.mp4') ? (
                            <video
                                src={img}
                                className="gallery-img"
                                playsInline
                                autoPlay
                                loop
                                muted
                            />
                        ) : (
                            <img src={img} alt={`Gallery item ${index + 1}`} className="gallery-img" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
