import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

// Configuration
const SOURCE_DIR = "C:\\Users\\Owner\\Desktop\\Jordan\\pics";
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/assets/images');
const TEAM_OUTPUT_DIR = path.join(OUTPUT_DIR, 'team');

// Ensure directories exist
if (!fs.existsSync(TEAM_OUTPUT_DIR)) {
    fs.mkdirSync(TEAM_OUTPUT_DIR, { recursive: true });
}

// Map of source files to process
const TEAM_PHOTOS = [
    { path: path.join(SOURCE_DIR, "Random", "IMG_0231.heic"), name: "team-01" },
    { path: path.join(SOURCE_DIR, "Random", "IMG_0656.heic"), name: "team-02" },
    { path: path.join(SOURCE_DIR, "Random", "IMG_1090.heic"), name: "team-03" },
    { path: path.join(SOURCE_DIR, "Manufacturing Equipment", "IMG_0465.HEIC"), name: "team-04" },
    { path: path.join(SOURCE_DIR, "Random", "IMG_0305.heic"), name: "team-05" },
    { path: path.join(SOURCE_DIR, "Pics of me", "IMG_0794.JPG"), name: "team-06" }, // Also BG
    { path: path.join(SOURCE_DIR, "Manufacturing Equipment", "6981769811266114199.jpg"), name: "team-07" },
    { path: path.join(SOURCE_DIR, "Pics of me", "IMG_2781.heic"), name: "team-08" },
    { path: path.join(SOURCE_DIR, "Pics of me", "PXL_20240807_002408301.jpg"), name: "team-09" },
    { path: path.join(SOURCE_DIR, "Pics of me", "2870835080524889975.jpg"), name: "team-10" },
];

const BG_PHOTO = { path: path.join(SOURCE_DIR, "Pics of me", "IMG_0794.JPG"), name: "teaser-bg" };

async function processImage(fileObj, outputDir) {
    try {
        console.log(`Processing ${fileObj.name}...`);

        let buffer;
        if (fileObj.path.toLowerCase().endsWith('.heic')) {
            const inputBuffer = fs.readFileSync(fileObj.path);
            buffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1
            });
        } else {
            buffer = fs.readFileSync(fileObj.path);
        }

        const outputPath = path.join(outputDir, `${fileObj.name}.webp`);

        await sharp(buffer)
            .resize(800, 800, { fit: 'cover', withoutEnlargement: true }) // Normalize size for gallery
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log(`Saved: ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${fileObj.name}:`, error.message);
    }
}

async function processBg(fileObj) {
    try {
        console.log(`Processing Background ${fileObj.name}...`);
        const buffer = fs.readFileSync(fileObj.path);
        const outputPath = path.join(OUTPUT_DIR, `${fileObj.name}.webp`);

        await sharp(buffer)
            .resize(1920, 1080, { fit: 'cover', withoutEnlargement: true })
            .grayscale() // Artistic touch for BG
            .modulate({ brightness: 0.4 }) // Darken for text readability
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log(`Saved Background: ${outputPath}`);
    } catch (error) {
        console.error(`Error processing BG:`, error.message);
    }
}

async function main() {
    console.log("Starting Image Processing...");

    // Process Team Photos
    for (const photo of TEAM_PHOTOS) {
        await processImage(photo, TEAM_OUTPUT_DIR);
    }

    // Process Background
    await processBg(BG_PHOTO);

    console.log("Processing Complete.");
}

main();
