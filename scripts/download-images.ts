import fs from 'fs';
import path from 'path';
import https from 'https';

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

// Create images directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Function to search Wikimedia Commons for an image
async function searchWikimediaImage(animalName: string, scientificName: string): Promise<string | null> {
    const searchQuery = `${animalName} ${scientificName}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);

    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&srnamespace=6&format=json&srlimit=1`;

    try {
        const searchResult = await fetchJson(searchUrl);

        if (!searchResult.query?.search?.[0]) {
            console.log(`No image found for: ${animalName}`);
            return null;
        }

        const imageTitle = searchResult.query.search[0].title;

        // Get image URL
        const imageUrl = await getWikimediaImageUrl(imageTitle);
        return imageUrl;
    } catch (error) {
        console.error(`Error searching for ${animalName}:`, error);
        return null;
    }
}

// Function to get actual image URL from Wikimedia
async function getWikimediaImageUrl(imageTitle: string): Promise<string | null> {
    const encodedTitle = encodeURIComponent(imageTitle);
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url&format=json`;

    try {
        const result = await fetchJson(infoUrl);
        const pages = result.query?.pages;

        if (!pages) return null;

        const pageId = Object.keys(pages)[0];
        const imageUrl = pages[pageId]?.imageinfo?.[0]?.url;

        return imageUrl || null;
    } catch (error) {
        console.error(`Error getting image URL for ${imageTitle}:`, error);
        return null;
    }
}

// Helper to fetch JSON from URL
function fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Download image from URL
function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                // Handle redirect
                if (res.headers.location) {
                    downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
                }
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', reject);
        }).on('error', reject);
    });
}

// Create a safe filename from animal name
function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// Main function
async function main() {
    console.log('Reading animals.json...');
    const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    console.log(`Found ${animalsData.length} animals`);
    console.log('Starting image downloads...\n');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < animalsData.length; i++) {
        const animal = animalsData[i];
        const progress = `[${i + 1}/${animalsData.length}]`;

        console.log(`${progress} Processing: ${animal.name}`);

        // Skip if already has image
        if (animal.image_url) {
            console.log(`  ✓ Already has image, skipping\n`);
            successCount++;
            continue;
        }

        try {
            // Search for image
            const imageUrl = await searchWikimediaImage(animal.name, animal.scientific);

            if (!imageUrl) {
                console.log(`  ✗ No image found\n`);
                failCount++;
                continue;
            }

            // Create filename
            const filename = createSafeFilename(animal.name) + path.extname(imageUrl).split('?')[0];
            const filepath = path.join(imageDir, filename);

            // Download image
            await downloadImage(imageUrl, filepath);

            // Update animal record
            animal.image_url = `/images/animals/${filename}`;

            console.log(`  ✓ Downloaded: ${filename}\n`);
            successCount++;

            // Small delay to be nice to the API
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.log(`  ✗ Error: ${error}\n`);
            failCount++;
        }
    }

    // Save updated JSON
    console.log('\nSaving updated animals.json...');
    fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));

    console.log('\n=== Summary ===');
    console.log(`Total animals: ${animalsData.length}`);
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    console.log('\nDone!');
}

main().catch(console.error);
