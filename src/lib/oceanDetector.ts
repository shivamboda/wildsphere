// Simple ocean detection based on lat/lng boundaries
export function detectOcean(lat: number, lng: number): string | null {
    // Pacific Ocean: roughly -180 to -70 longitude, or 120 to 180
    if ((lng >= -180 && lng <= -70) || (lng >= 120 && lng <= 180)) {
        if (lat >= -60 && lat <= 60) {
            return 'Pacific Ocean';
        }
    }

    // Atlantic Ocean: roughly -70 to 20 longitude
    if (lng >= -70 && lng <= 20) {
        if (lat >= -60 && lat <= 60) {
            return 'Atlantic Ocean';
        }
    }

    // Indian Ocean: roughly 20 to 120 longitude, south of 25N
    if (lng >= 20 && lng <= 120) {
        if (lat >= -60 && lat <= 25) {
            return 'Indian Ocean';
        }
    }

    // Arctic Ocean: north of 66N
    if (lat >= 66) {
        return 'Arctic Ocean';
    }

    // Southern Ocean: south of 60S
    if (lat <= -60) {
        return 'Southern Ocean';
    }

    // Mediterranean, Caribbean, etc. - for now return null and we'll handle as "Ocean"
    return null;
}
