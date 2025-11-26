import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/animals.json');
const imageDir = path.join(process.cwd(), 'public/images/animals');

interface Animal {
    name: string;
    image_url?: string;
}

function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);
}

console.log('Reading animals.json...');
const animalsData: any[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
let updatedCount = 0;

// Redundancy mappings: if name ends with Key, and previous word ends with Value (or is Value), remove Key.
// Actually, simpler: specific suffix removals.
const redundancies = [
    { suffix: ' Frog', check: /Bullfrog$/i },
    { suffix: ' Wasp', check: /Hornet$/i },
    { suffix: ' Whale', check: /Narwhal$/i },
    { suffix: ' Whale', check: /Orca$/i },
    { suffix: ' Snake', check: /Viper$/i },
    { suffix: ' Snake', check: /Cobra$/i },
    { suffix: ' Snake', check: /Python$/i },
    { suffix: ' Snake', check: /Anaconda$/i },
    { suffix: ' Snake', check: /Boa$/i },
    { suffix: ' Snake', check: /Mamba$/i },
    { suffix: ' Lizard', check: /Gecko$/i },
    { suffix: ' Lizard', check: /Iguana$/i },
    { suffix: ' Lizard', check: /Chameleon$/i },
    { suffix: ' Lizard', check: /Skink$/i },
    { suffix: ' Lizard', check: /Monitor$/i },
    { suffix: ' Lizard', check: /Dragon$/i }, // Komodo Dragon
    { suffix: ' Bear', check: /Panda$/i },
    { suffix: ' Frog', check: /Toad$/i },
    { suffix: ' Turtle', check: /Tortoise$/i },
    { suffix: ' Mantis', check: /Crab$/i }, // Boxer Crab Mantis -> Boxer Crab?
    { suffix: ' Crab', check: /Mantis$/i }, // Mantis Crab -> Mantis?
];

for (const animal of animalsData) {
    let oldName = animal.name;
    let newName = oldName;

    // 0. Remove pipe content (e.g. " | Sousa plumbea")
    newName = newName.replace(/\s*\|.*$/, '');

    // 1. Check specific redundancies
    for (const { suffix, check } of redundancies) {
        if (newName.endsWith(suffix)) {
            const base = newName.slice(0, -suffix.length);
            if (check.test(base)) {
                newName = base;
                break;
            }
        }
    }

    // 2. Check generic repetition (e.g. "Beetle Beetle", "Frog Frog")
    const parts = newName.split(' ');
    if (parts.length >= 2) {
        const last = parts[parts.length - 1].toLowerCase();
        const secondLast = parts[parts.length - 2].toLowerCase();
        if (secondLast.endsWith(last)) {
            // e.g. "Bullfrog Frog" (frog ends with frog)
            // "Stag Beetle Beetle" (beetle ends with beetle)
            newName = parts.slice(0, -1).join(' ');
        }
    }

    if (oldName !== newName) {
        console.log(`Cleaning: "${oldName}" -> "${newName}"`);

        // Handle File Renaming
        const oldFilenameBase = createSafeFilename(oldName);
        const newFilenameBase = createSafeFilename(newName);

        if (oldFilenameBase !== newFilenameBase) {
            const extensions = ['jpg', 'jpeg', 'png', 'webp'];

            for (const ext of extensions) {
                const oldPath = path.join(imageDir, `${oldFilenameBase}.${ext}`);
                const newPath = path.join(imageDir, `${newFilenameBase}.${ext}`);

                if (fs.existsSync(oldPath)) {
                    if (!fs.existsSync(newPath)) {
                        fs.renameSync(oldPath, newPath);
                        console.log(`  [FILE] Renamed: ${oldFilenameBase}.${ext} -> ${newFilenameBase}.${ext}`);
                        animal.image_url = `/images/animals/${newFilenameBase}.${ext}`;
                    } else {
                        console.log(`  [FILE] Target exists, skipping rename: ${newFilenameBase}.${ext}`);
                        animal.image_url = `/images/animals/${newFilenameBase}.${ext}`;
                    }
                    break;
                }
            }
        }

        animal.name = newName;
        updatedCount++;
    }
}

fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));
console.log(`\n✅ Cleaned ${updatedCount} animals.`);
