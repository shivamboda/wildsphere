import fs from 'fs';
import path from 'path';

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

// Add fallback placeholder images for animals without images
function addFallbackImages() {
    console.log('Reading animals.json...');
    const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    let updatedCount = 0;

    for (const animal of animalsData) {
        if (!animal.image_url) {
            // Use a simple placeholder with animal name
            const safeName = animal.name.toLowerCase().replace(/[^a-z0-9]+/g, '+');
            animal.image_url = `https://api.dicebear.com/7.x/shapes/svg?seed=${safeName}`;
            updatedCount++;
        }
    }

    console.log(`Added fallback images for ${updatedCount} animals`);

    fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));
    console.log('Updated animals.json');
}

addFallbackImages();
