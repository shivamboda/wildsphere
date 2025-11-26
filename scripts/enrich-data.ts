
import fs from 'fs';
import path from 'path';
import whichCountry from 'which-country';
import iso3166 from 'iso-3166-1';

// Simple ocean detection
function detectOcean(lat: number, lng: number): string | null {
    if ((lng >= -180 && lng <= -70) || (lng >= 120 && lng <= 180)) {
        if (lat >= -60 && lat <= 60) return 'Pacific Ocean';
    }
    if (lng >= -70 && lng <= 20) {
        if (lat >= -60 && lat <= 60) return 'Atlantic Ocean';
    }
    if (lng >= 20 && lng <= 120) {
        if (lat >= -60 && lat <= 25) return 'Indian Ocean';
    }
    if (lat >= 66) return 'Arctic Ocean';
    if (lat <= -60) return 'Southern Ocean';
    return null;
}

const dataPath = path.join(process.cwd(), 'src/data/animals.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const animals = JSON.parse(rawData);

let updatedCount = 0;

const updatedAnimals = animals.map((animal: any) => {
    const iso3 = whichCountry([animal.lng, animal.lat]);

    let countryName: string;

    if (iso3) {
        const countryData = iso3166.whereAlpha3(iso3);
        if (countryData) {
            countryName = countryData.country;
        } else {
            const ocean = detectOcean(animal.lat, animal.lng);
            countryName = ocean || 'International Waters';
        }
    } else {
        // No country detected - check for ocean
        const ocean = detectOcean(animal.lat, animal.lng);
        countryName = ocean || 'International Waters';
    }

    // Special case for Antarctica
    if (animal.lat < -60 && animal.lat > -90) {
        const ocean = detectOcean(animal.lat, animal.lng);
        if (ocean === 'Southern Ocean') {
            countryName = 'Southern Ocean';
        } else {
            countryName = 'Antarctica';
        }
    }

    if (animal.country !== countryName) {
        updatedCount++;
    }

    return {
        ...animal,
        country: countryName
    };
});

fs.writeFileSync(dataPath, JSON.stringify(updatedAnimals, null, 2));

console.log(`Updated ${updatedCount} records with country/ocean names.`);
