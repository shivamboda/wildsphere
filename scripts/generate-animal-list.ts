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
const outputPath = path.join(process.cwd(), 'ANIMAL_LIST_FOR_DOWNLOAD.txt');

console.log('Generating animal list...');
const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let output = `=================================================================
ANIMAL IMAGE DOWNLOAD LIST
=================================================================

Total Animals: ${animalsData.length}

INSTRUCTIONS:
1. Download images for each animal below
2. Save them in: public/images/animals/
3. Name each file exactly as shown (e.g., "tardigrade_water_bear.jpg")
4. Once done, run: npm run link-images

NAMING FORMAT: Use the exact filename shown (lowercase, underscores)
FILE TYPE: Save as .jpg (preferred) or .png

=================================================================

`;

animalsData.forEach((animal, index) => {
    const filename = animal.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);

    output += `${index + 1}. ${animal.name}\n`;
    output += `   Scientific: ${animal.scientific}\n`;
    output += `   Filename: ${filename}.jpg\n`;
    output += `   Search: "${animal.scientific}" or "${animal.name}"\n\n`;
});

output += `=================================================================
QUICK TIP: Search Google Images for the scientific name for best results!
=================================================================\n`;

fs.writeFileSync(outputPath, output);

console.log(`✅ List saved to: ${outputPath}`);
console.log(`\nNext steps:`);
console.log(`1. Open the file and download images for each animal`);
console.log(`2. Save images to: public/images/animals/`);
console.log(`3. Run: npm run link-images (to auto-link them)`);
