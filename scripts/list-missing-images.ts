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
const outputPath = path.join(process.cwd(), 'MISSING_IMAGES_LIST.txt');

function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);
}

console.log('Reading animals.json...');
const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Check for animals without LOCAL image files
const missingAnimals: Animal[] = [];

for (const animal of animalsData) {
    const baseFilename = createSafeFilename(animal.name);
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];

    let hasLocalFile = false;
    for (const ext of extensions) {
        const filepath = path.join(imageDir, `${baseFilename}.${ext}`);
        if (fs.existsSync(filepath)) {
            hasLocalFile = true;
            break;
        }
    }

    if (!hasLocalFile) {
        missingAnimals.push(animal);
    }
}

console.log(`Found ${missingAnimals.length} animals without local image files`);

let output = `=================================================================
MISSING LOCAL IMAGES LIST
=================================================================

Total animals without local image files: ${missingAnimals.length}

Download images and save to: public/images/animals/
Then run: cmd /c "npx ts-node scripts/link-images.ts"

=================================================================

`;

missingAnimals.forEach((animal, index) => {
    const filename = createSafeFilename(animal.name);

    output += `${index + 1}. ${animal.name}\n`;
    output += `   Scientific: ${animal.scientific}\n`;
    output += `   Filename: ${filename}.jpg\n`;
    output += `   Search: "${animal.scientific}" or "${animal.name}"\n\n`;
});

output += `=================================================================
TOTAL: ${missingAnimals.length} animals still need local images
Already have images: ${animalsData.length - missingAnimals.length}
=================================================================\n`;

fs.writeFileSync(outputPath, output);

console.log(`✅ List saved to: ${outputPath}`);
console.log(`\nMissing local images: ${missingAnimals.length}`);
console.log(`Already have images: ${animalsData.length - missingAnimals.length}`);
