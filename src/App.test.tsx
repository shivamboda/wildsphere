// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
vi.mock('react-globe.gl', () => {
    return {
        default: ({ onGlobeClick }: any) => (
            <div data-testid="globe">
                <button onClick={() => onGlobeClick({ lat: 0, lng: 0 })} data-testid="globe-click">
                    Click Globe
                </button>
            </div>
        ),
    };
});

// Mock spatial lib
vi.mock('./lib/spatial', () => {
    return {
        buildIndex: vi.fn(),
        findNearest: vi.fn(() => [
            {
                id: 1,
                name: 'Test Animal',
                scientific: 'Testus animalus',
                lat: 0,
                lng: 0,
                fact: 'This is a test fact.',
                image_url: 'http://example.com/image.jpg'
            }
        ]),
        findWithinRadius: vi.fn(),
    };
});
vi.mock('./lib/clustering', () => ({
    initClusters: vi.fn(),
    getClusters: vi.fn(() => []),
}));

describe('App Integration', () => {
    it('renders globe and handles click', () => {
        render(<App />);

        // Check if globe is rendered
        expect(screen.getByTestId('globe')).toBeDefined();

        // Simulate globe click
        fireEvent.click(screen.getByTestId('globe-click'));

        // Check if FactCard appears with animal info
        expect(screen.getByText('Test Animal')).toBeDefined();
        expect(screen.getByText('Testus animalus')).toBeDefined();
        expect(screen.getByText('This is a test fact.')).toBeDefined();
    });
});
