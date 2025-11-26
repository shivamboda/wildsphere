import { buildIndex, findNearest } from '../src/lib/spatial.ts';
import fs from 'fs';
import path from 'path';

const animalsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/animals.json'), 'utf-8'));

console.log('Building index...');
buildIndex(animalsData);

// Test coordinates for Paris, France (approx)
const parisLat = 48.8566;
const parisLng = 2.3522;

console.log(`\nFinding nearest animal to Paris (${parisLat}, ${parisLng})...`);
const nearest = findNearest(parisLat, parisLng, 1);

console.log('Result:', JSON.stringify(nearest, null, 2));

if (nearest.length > 0) {
    const animal = nearest[0];
    console.log(`\nNearest Animal: ${animal.name}`);
    console.log(`Location: ${animal.country} (${animal.lat}, ${animal.lng})`);

    // Check if it's American (rough check)
    if (animal.lng < -30 && animal.lng > -170) {
        console.warn('⚠️  WARNING: Found an animal in the Americas!');
    } else {
        console.log('✅ Found an animal in the correct hemisphere.');
    }
} else {
    console.error('❌ No nearest animal found!');
}
