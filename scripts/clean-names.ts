import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/animals.json');
const imageDir = path.join(process.cwd(), 'public/images/animals');

interface Animal {
    name: string;
    scientific: string;
    fact: string;
    lat: number;
    lng: number;
    country?: string;
    image_url?: string;
}

function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);
}

function cleanName(name: string): string {
    let newName = name;

    // 1. Remove Parentheses content (e.g., " (War)", " (Pacific)")
    newName = newName.replace(/\s*\(.*?\)/g, '');

    // 2. Remove specific prefixes "Bird - ", "Fish - ", "Snake - "
    // Only if the second part is substantial (heuristic)
    if (newName.match(/^(Bird|Fish|Snake) - (.+)$/)) {
        newName = newName.replace(/^(Bird|Fish|Snake) - /, '');
    }

    // 3. Swap "Name - Adjective" to "Adjective Name"
    // Pattern: Start with Word, space-hyphen-space, then rest
    // e.g. "Ant - Bullet" -> "Bullet Ant"
    // e.g. "Albatross - Sooty" -> "Sooty Albatross"
    const swapMatch = newName.match(/^([A-Za-z]+) - ([A-Za-z\s'-]+)$/);
    if (swapMatch) {
        newName = `${swapMatch[2]} ${swapMatch[1]}`;
    }

    return newName.trim();
}

console.log('Reading animals.json...');
const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
let updatedCount = 0;

for (const animal of animalsData) {
    const oldName = animal.name;
    const newName = cleanName(oldName);

    if (oldName !== newName) {
        console.log(`Renaming: "${oldName}" -> "${newName}"`);

        // Handle File Renaming
        const oldFilenameBase = createSafeFilename(oldName);
        const newFilenameBase = createSafeFilename(newName);

        if (oldFilenameBase !== newFilenameBase) {
            const extensions = ['jpg', 'jpeg', 'png', 'webp'];
            let renamed = false;

            for (const ext of extensions) {
                const oldPath = path.join(imageDir, `${oldFilenameBase}.${ext}`);
                const newPath = path.join(imageDir, `${newFilenameBase}.${ext}`);

                if (fs.existsSync(oldPath)) {
                    if (!fs.existsSync(newPath)) {
                        fs.renameSync(oldPath, newPath);
                        console.log(`  [FILE] Renamed: ${oldFilenameBase}.${ext} -> ${newFilenameBase}.${ext}`);

                        // Update image_url
                        animal.image_url = `/images/animals/${newFilenameBase}.${ext}`;
                        renamed = true;
                    } else {
                        console.log(`  [FILE] Target exists, skipping rename: ${newFilenameBase}.${ext}`);
                        // Update image_url to point to the existing new file
                        animal.image_url = `/images/animals/${newFilenameBase}.${ext}`;
                    }
                    break; // Only rename the first matching extension found
                }
            }
        }

        animal.name = newName;
        updatedCount++;
    }
}

fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));
console.log(`\n✅ Updated ${updatedCount} animals.`);
