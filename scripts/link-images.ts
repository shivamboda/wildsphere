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
const imageDir = path.join(process.cwd(), 'public/images/animals');

function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);
}

async function linkImages() {
    console.log('Reading animals.json...');
    const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Get all image files
    const imageFiles = fs.existsSync(imageDir)
        ? fs.readdirSync(imageDir).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
        : [];

    console.log(`Found ${imageFiles.length} images in public/images/animals/`);

    let linkedCount = 0;
    let missingCount = 0;

    for (const animal of animalsData) {
        const baseFilename = createSafeFilename(animal.name);

        // Check for .jpg, .jpeg, .png, .webp
        const extensions = ['jpg', 'jpeg', 'png', 'webp'];
        let found = false;

        for (const ext of extensions) {
            const filename = `${baseFilename}.${ext}`;
            if (imageFiles.includes(filename)) {
                animal.image_url = `/images/animals/${filename}`;
                linkedCount++;
                found = true;
                break;
            }
        }

        if (!found) {
            missingCount++;
        }
    }

    // Save updated JSON
    fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));

    console.log('\n=== Summary ===');
    console.log(`✅ Linked: ${linkedCount} animals`);
    console.log(`⚠️  Missing: ${missingCount} animals`);
    console.log('\n✨ animals.json updated!');

    if (missingCount > 0) {
        console.log('\nℹ️  You can continue downloading images and run this script again.');
    }
}

linkImages().catch(console.error);
