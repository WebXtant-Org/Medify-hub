
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
    { src: 'public/images/hero1.jpeg', dest: 'public/images/hero1.webp' },
    { src: 'public/images/hero2.jpeg', dest: 'public/images/hero2.webp' },
    { src: 'public/images/hero3.jpeg', dest: 'public/images/hero3.webp' },
];

async function convert() {
    for (const img of images) {
        try {
            console.log(`Converting ${img.src} to ${img.dest}...`);
            await sharp(img.src)
                .resize({ width: 1920, height: 1080, fit: 'cover' }) // Resize to reasonable HD
                .webp({ quality: 80 }) // Compress
                .toFile(img.dest);
            console.log(`Finished ${img.dest}`);
        } catch (error) {
            console.error(`Error converting ${img.src}:`, error);
        }
    }
}

convert();
