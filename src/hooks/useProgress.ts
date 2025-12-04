import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wildsphere_visited_animals';

export function useProgress(totalAnimals: number) {
    const [visitedIds, setVisitedIds] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load progress from localStorage', e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedIds));
        } catch (e) {
            console.error('Failed to save progress to localStorage', e);
        }
    }, [visitedIds]);

    const markAsVisited = (id: string | number) => {
        const stringId = String(id);
        if (!visitedIds.includes(stringId)) {
            setVisitedIds(prev => [...prev, stringId]);
        }
    };

    const isVisited = (id: string | number) => {
        return visitedIds.includes(String(id));
    };

    return {
        visitedCount: visitedIds.length,
        totalCount: totalAnimals,
        markAsVisited,
        isVisited,
        visitedIds
    };
}
