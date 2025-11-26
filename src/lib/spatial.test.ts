import { describe, it, expect, beforeAll } from 'vitest';
import { buildIndex, findNearest, findWithinRadius, type Point } from './spatial';

const testPoints: Point[] = [
    { id: 1, name: 'Point A', scientific: 'A', lat: 0, lng: 0, fact: 'A' },
    { id: 2, name: 'Point B', scientific: 'B', lat: 0, lng: 1, fact: 'B' }, // ~111km away
    { id: 3, name: 'Point C', scientific: 'C', lat: 1, lng: 0, fact: 'C' }, // ~111km away
    { id: 4, name: 'Point D', scientific: 'D', lat: 10, lng: 10, fact: 'D' }, // Far away
    { id: 5, name: 'Point E', scientific: 'E', lat: 0, lng: 0.0001, fact: 'E' }, // Very close to A
];

describe('Spatial Index', () => {
    beforeAll(() => {
        buildIndex(testPoints);
    });

    it('should find the nearest point (exact match)', () => {
        const nearest = findNearest(0, 0, 1);
        expect(nearest).toHaveLength(1);
        expect(nearest[0].id).toBe(1);
    });

    it('should find the nearest point (very close)', () => {
        const nearest = findNearest(0, 0.00001, 1);
        expect(nearest).toHaveLength(1);
        expect(nearest[0].id).toBe(1);
    });

    it('should find k nearest points', () => {
        const nearest = findNearest(0, 0, 3);
        expect(nearest).toHaveLength(3);
        const ids = nearest.map(p => p.id);
        expect(ids).toContain(1);
        expect(ids).toContain(5); // Close to A
        expect(ids).toContain(2); // Next closest is B (dist 1 deg) or C (dist 1 deg)
    });

    it('should find points within radius', () => {
        // 200km radius should include A, B, C, E but not D
        const points = findWithinRadius(0, 0, 200);
        const ids = points.map(p => p.id);
        expect(ids).toContain(1);
        expect(ids).toContain(2);
        expect(ids).toContain(3);
        expect(ids).toContain(5);
        expect(ids).not.toContain(4);
    });
});
