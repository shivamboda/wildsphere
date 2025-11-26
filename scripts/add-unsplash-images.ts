import fs from 'fs';
import path from 'path';
import https from 'https';

interface Animal {
    name: string;
    scientific: string;
    fact: string;
    lat: number;
    lng: number;
    country?: string;
    image_url?: string;
}

const dataPath = path.join(process.cwd(), 'src/data/animals.json');

// Simple approach: Use Unsplash Source API (no API key needed!)
// This gives us high-quality, free animal photos
function updateWithUnsplashImages() {
    console.log('Reading animals.json...');
    const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    let updatedCount = 0;

    for (const animal of animalsData) {
        if (!animal.image_url) {
            // Use Unsplash Source API with animal name as search query
            // Format: https://source.unsplash.com/800x600/?animal,name
            const searchTerm = animal.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, ',');

            animal.image_url = `https://source.unsplash.com/800x600/?${searchTerm},animal,wildlife`;
            updatedCount++;
        }
    }

    console.log(`Added Unsplash images for ${updatedCount} animals`);

    fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));
    console.log('✓ Updated animals.json');
}

updateWithUnsplashImages();
