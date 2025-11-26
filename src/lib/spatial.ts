import * as geokdbush from 'geokdbush';

export interface Point {
    id?: number;
    name: string;
    scientific?: string;
    country?: string;
    lat: number;
    lng: number;
    fact: string;
    image_url?: string;
    [key: string]: any;
}

let points: Point[] = [];

export const buildIndex = (data: any[]) => {
    // Just store the points, no index needed for small dataset (676 items)
    points = data.map((item, idx) => ({
        ...item,
        id: item.id || idx,
        scientific: item.scientific || item.scientific_name,
        lat: item.lat ?? item.latitude,
        lng: item.lng ?? item.longitude
    }));
};

export const findNearest = (lat: number, lon: number, k: number = 1): Point[] => {
    if (points.length === 0) return [];

    // Calculate distance to all points
    const withDist = points.map(p => ({
        point: p,
        dist: geokdbush.distance(lon, lat, p.lng, p.lat)
    }));

    // Sort by distance
    withDist.sort((a, b) => a.dist - b.dist);

    // Return top k
    return withDist.slice(0, k).map(item => item.point);
};

export const findWithinRadius = (lat: number, lon: number, radiusKm: number): Point[] => {
    if (points.length === 0) return [];

    return points.filter(p => {
        const dist = geokdbush.distance(lon, lat, p.lng, p.lat);
        return dist <= radiusKm;
    });
};

export const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    return geokdbush.distance(lon1, lat1, lon2, lat2);
};
