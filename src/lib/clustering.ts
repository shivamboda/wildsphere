import Supercluster from 'supercluster';
import type { Point } from './spatial';

const index = new Supercluster({
    radius: 40,
    maxZoom: 16,
});

export const initClusters = (points: Point[]) => {
    const features = points.map((p) => ({
        type: 'Feature' as const,
        properties: { cluster: false, pointId: p.id, ...p },
        geometry: {
            type: 'Point' as const,
            coordinates: [p.lng, p.lat],
        },
    }));

    index.load(features as any);
};

export const getClusters = (zoom: number) => {
    return index.getClusters([-180, -90, 180, 90], Math.floor(zoom));
};

export const getLeaves = (clusterId: number) => {
    return index.getLeaves(clusterId, Infinity);
};
