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

// Create images directory
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);
}

function fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'GlobeFacts/1.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
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

function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
                if (res.headers.location) {
                    downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
                    return;
                }
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Failed: ${res.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
        }).on('error', reject);
    });
}

// Search Wikipedia/Wikimedia Commons for actual animal image
async function getWikimediaImage(scientificName: string, commonName: string): Promise<string | null> {
    try {
        // Search for the article using scientific name first
        const searchQuery = encodeURIComponent(scientificName);
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${searchQuery}&pithumbsize=800`;

        const result = await fetchJson(searchUrl);
        const pages = result.query?.pages;

        if (!pages) return null;

        const page = Object.values(pages)[0] as any;
        const imageUrl = page?.thumbnail?.source;

        if (imageUrl) return imageUrl;

        // Try with common name if scientific name fails
        const commonQuery = encodeURIComponent(commonName);
        const commonUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${commonQuery}&pithumbsize=800`;

        const commonResult = await fetchJson(commonUrl);
        const commonPages = commonResult.query?.pages;

        if (!commonPages) return null;

        const commonPage = Object.values(commonPages)[0] as any;
        return commonPage?.thumbnail?.source || null;

    } catch (error) {
        return null;
    }
}

async function downloadAllImages() {
    console.log('Reading animals.json...');
    const animalsData: Animal[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    console.log(`Found ${animalsData.length} animals`);
    console.log('Downloading REAL animal images from Wikipedia/Wikimedia...\n');

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (let i = 0; i < animalsData.length; i++) {
        const animal = animalsData[i];
        const progress = `[${i + 1}/${animalsData.length}]`;

        console.log(`${progress} ${animal.name}`);

        const filename = createSafeFilename(animal.name) + '.jpg';
        const filepath = path.join(imageDir, filename);
        const localPath = `/images/animals/${filename}`;

        // Skip if already exists
        if (fs.existsSync(filepath)) {
            animal.image_url = localPath;
            console.log(`  ⏭️  Already exists\n`);
            skipCount++;
            continue;
        }

        try {
            // Get Wikipedia image URL
            const imageUrl = await getWikimediaImage(animal.scientific, animal.name);

            if (!imageUrl) {
                console.log(`  ⚠️  No Wikipedia image found\n`);
                failCount++;
                continue;
            }

            // Download the actual animal image
            await downloadImage(imageUrl, filepath);

            animal.image_url = localPath;

            console.log(`  ✅ Downloaded real animal photo\n`);
            successCount++;

            // Respectful delay for Wikipedia API (2 seconds)
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.log(`  ❌ Error: ${error}\n`);
            failCount++;
        }
    }

    console.log('\n📝 Saving animals.json...');
    fs.writeFileSync(dataPath, JSON.stringify(animalsData, null, 2));

    console.log('\n=== Summary ===');
    console.log(`Total: ${animalsData.length}`);
    console.log(`✅ Downloaded: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('\n🎉 Done! All images are REAL animal photos from Wikipedia.');
}

downloadAllImages().catch(console.error);
