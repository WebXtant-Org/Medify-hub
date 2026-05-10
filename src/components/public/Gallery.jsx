'use client'
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import './Gallery.css';

const Gallery = () => {
    const [showMore, setShowMore] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await apiClient('/gallery');
                setItems(data);
            } catch (err) {
                console.error('Failed to fetch gallery:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    // Initial 4 items shown on page load (if no dynamic data)
    const initialStaticItems = [
        "/images/gallery-small-1.jpg",
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1770827251/quality_restoration_20260210161548582_wulxqy.mp4",
        "https://res.cloudinary.com/djqlnkkcb/video/upload/v1770828119/ai_repair_20260210161130363_1_ujctwu.mp4",
        "/images/gallery-small-2.jpg",
    ];

    const displayItems = items.length > 0 ? items.map(i => i.imageUrl) : initialStaticItems;
    const itemsToShow = showMore ? displayItems : displayItems.slice(0, 4);

    const isVideo = (url) => url.includes('.mp4');

    return (
        <section className="gallery-section" id="gallery">
            <h2 className="gallery-title">Gallery</h2>

            <div className="gallery-grid">
                {itemsToShow.map((item, index) => (
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

            {displayItems.length > 4 && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={() => setShowMore(!showMore)}>
                        {showMore ? 'Show Less' : 'Load More'}
                    </button>
                </div>
            )}
        </section>
    );
};

export default Gallery;
