import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/animals.json');
let content = fs.readFileSync(dataPath, 'utf-8');

// Replace all LaTeX math expressions with plain text equivalents
const replacements = [
    [/\$38\^\{\\circ\}\\text\{C\}\$/g, '38°C'],
    [/\$5 \\text\{ cm\}\$/g, '5 cm'],
    [/\$50\^\{\\circ\}\\text\{C\}\$/g, '50°C'],
    [/\$240 \\text\{ mph\}\$/g, '240 mph'],
    [/\$5 \\text\{ feet\}\$/g, '5 feet'],
    [/\$20,000 \\text\{ feet\}\$/g, '20,000 feet'],
    [/\$80\\%\$/g, '80%'],
    [/\$0\^\\circ\\text\{C\}\$/g, '0°C'],
    [/\$-40\^\\circ\\text\{C\}\$/g, '-40°C'],
    [/\$20 \\text\{ miles\}\$/g, '20 miles'],
    [/\$3\$/g, '3'],
    [/\$13 \\text\{ cm\}\$/g, '13 cm'],
    [/\$5 \\text\{ feet\}\$/g, '5 feet'],
    [/\$12 \\text\{ feet\}\$/g, '12 feet'],
    [/\$50 \\text\{ feet\}\$/g, '50 feet'],
    [/\$5 \\text\{ km\}\$/g, '5 km'],
];

replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
});

fs.writeFileSync(dataPath, content);
console.log('Fixed all LaTeX escape sequences.');

