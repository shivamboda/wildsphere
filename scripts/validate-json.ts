import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface Animal {
    id?: number;
    name: string;
    scientific: string;
    lat: number;
    lng: number;
    fact: string;
    image_url?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/animals.json');

try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const animals: Animal[] = JSON.parse(rawData);

    console.log(`Validating ${animals.length} records...`);

    let errors = 0;

    animals.forEach((animal, index) => {
        // ID is now optional or implicit, but let's warn if missing if we expect it.
        // The user didn't provide IDs in their snippet, so maybe we don't enforce it.

        if (!animal.name) {
            console.error(`Record ${index}: Missing name`);
            errors++;
        }
        if (typeof animal.lat !== 'number' || animal.lat < -90 || animal.lat > 90) {
            console.error(`Record ${index} (${animal.name}): Invalid lat ${animal.lat}`);
            errors++;
        }
        if (typeof animal.lng !== 'number' || animal.lng < -180 || animal.lng > 180) {
            console.error(`Record ${index} (${animal.name}): Invalid lng ${animal.lng}`);
            errors++;
        }
        if (!animal.scientific) {
            console.warn(`Record ${index} (${animal.name}): Missing scientific name`);
        }
    });

    if (errors === 0) {
        console.log('Validation successful! All records look good.');
        process.exit(0);
    } else {
        console.error(`Found ${errors} errors.`);
        process.exit(1);
    }
} catch (err) {
    console.error('Error reading or parsing data:', err);
    process.exit(1);
}
