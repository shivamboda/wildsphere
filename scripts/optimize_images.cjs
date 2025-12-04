const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/animals';
const outputDir = './public/images/animals'; // overwrite in place

async function optimizeImages() {
    const files = fs.readdirSync(inputDir).filter(f =>
        f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
    );

    console.log(`Found ${files.length} images to optimize...`);

    let processed = 0;
    let totalSaved = 0;

    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const tempPath = path.join(inputDir, `temp_${file}`);

        try {
            const originalSize = fs.statSync(inputPath).size;

            // Resize to max 800px width and compress aggressively
            await sharp(inputPath)
                .resize(800, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg({
                    quality: 75,
                    progressive: true,
                    mozjpeg: true
                })
                .toFile(tempPath);

            // Replace original with optimized
            fs.unlinkSync(inputPath);
            fs.renameSync(tempPath, inputPath);

            const newSize = fs.statSync(inputPath).size;
            const saved = originalSize - newSize;
            totalSaved += saved;

            processed++;
            console.log(`[${processed}/${files.length}] ${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024).toFixed(0)}KB (saved ${(saved / 1024 / 1024).toFixed(2)}MB)`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
            // Clean up temp file if it exists
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    }

    console.log(`\n✅ Done! Processed ${processed} images.`);
    console.log(`💾 Total space saved: ${(totalSaved / 1024 / 1024 / 1024).toFixed(2)} GB`);
}

optimizeImages().catch(console.error);
