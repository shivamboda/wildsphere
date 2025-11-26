import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/animals.json');
const animalsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const names = animalsData.map((a: any) => a.name).sort();

fs.writeFileSync('ANIMAL_NAMES.txt', names.join('\n'));
console.log('Saved ANIMAL_NAMES.txt');
