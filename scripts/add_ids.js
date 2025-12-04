import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const animalsPath = path.join(__dirname, '../src/data/animals.json');

try {
    const data = fs.readFileSync(animalsPath, 'utf8');
    const animals = JSON.parse(data);

    const updatedAnimals = animals.map((animal, index) => ({
        id: index + 1, // Start IDs from 1 to avoid falsy 0 issues
        ...animal
    }));

    fs.writeFileSync(animalsPath, JSON.stringify(updatedAnimals, null, 2));
    console.log(`Successfully added IDs to ${updatedAnimals.length} animals.`);
} catch (error) {
    console.error('Error updating animals.json:', error);
}
