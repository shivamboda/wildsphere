import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/animals.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const animals = JSON.parse(rawData);

// Group animals by country/region
const countByRegion: Record<string, number> = {};

animals.forEach((animal: any) => {
    const region = animal.country || 'Unknown';
    countByRegion[region] = (countByRegion[region] || 0) + 1;
});

// Sort by count
const sorted = Object.entries(countByRegion).sort((a, b) => a[1] - b[1]);

console.log('\n=== Regions with LESS than 5 animals ===\n');
const lowCount = sorted.filter(([_, count]) => count < 5);
lowCount.forEach(([region, count]) => {
    console.log(`${region}: ${count} animal${count === 1 ? '' : 's'}`);
});

console.log('\n=== All Regions Summary ===\n');
sorted.forEach(([region, count]) => {
    const status = count < 5 ? '⚠️' : '✅';
    console.log(`${status} ${region}: ${count} animals`);
});

console.log(`\nTotal regions: ${sorted.length}`);
console.log(`Regions with < 5 animals: ${lowCount.length}`);
console.log(`Total animals: ${animals.length}`);
