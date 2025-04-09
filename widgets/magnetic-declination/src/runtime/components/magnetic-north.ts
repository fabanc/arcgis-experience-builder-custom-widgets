const magneticNorthByDate = {
    2025: {latitude: 85.563, longitude: 139.384},
    2026: {latitude: 85.350, longitude: 135.950},
    2027: {latitude: 85.135, longitude: 130.310},
    2028: {latitude: 84.920, longitude: 127.986},
    2029: {latitude: 84.706, longitude: 125.927}
}

export function getMagneticNorth(date: Date): {latitude: number, longitude: number} {
    const year = date.getFullYear();
    if (year < 2025 || year > 2029) {
        throw new Error('Year out of range. Only 2025 to 2029 are supported.');
    }
    return magneticNorthByDate[year];
}   