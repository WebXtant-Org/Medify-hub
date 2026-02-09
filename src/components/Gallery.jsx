import React from 'react';
import './Gallery.css';

const Gallery = () => {
    // Placeholder images from placehold.co (lighter grey background, no text if possible or simple text)
    const images = [
        "/images/gallery-small-1.jpg", // Square-ish
        "https://placehold.co/600x400/e0e0e0/e0e0e0", // Wide
        "https://placehold.co/600x400/e0e0e0/e0e0e0", // Wide
        "/images/gallery-small-2.jpg", // Square-ish
    ];

    return (
        <section className="gallery-section">
            <h2 className="gallery-title">Gallery</h2>

            <div className="gallery-grid">
                {images.map((img, index) => (
                    <div className="gallery-item" key={index}>
                        <img src={img} alt={`Gallery item ${index + 1}`} className="gallery-img" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
