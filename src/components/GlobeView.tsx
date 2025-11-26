import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';

interface GlobeViewProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export interface GlobeViewHandle {
    flyTo: (lat: number, lng: number) => void;
    animateTo: (lat: number, lng: number) => Promise<void>;
    zoomOut: () => void;
}

const GlobeView = forwardRef<GlobeViewHandle, GlobeViewProps>(({ onLocationSelect }, ref) => {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useImperativeHandle(ref, () => ({
        flyTo: (lat: number, lng: number) => {
            if (globeEl.current) {
                globeEl.current.pointOfView({ lat, lng, altitude: 1.5 }, 2000);
            }
        },
        animateTo: async (lat: number, lng: number) => {
            if (!globeEl.current) return;

            // Get current position
            const currentPOV = globeEl.current.pointOfView();
            const startLng = currentPOV.lng || 0;
            const startLat = currentPOV.lat || 0;
            const startAltitude = currentPOV.altitude || 2.5;

            // Animation parameters
            const totalRotation = 720; // degrees (2 full spins)
            const targetAltitude = 1.5; // Final zoom level
            const duration = 2000; // Total animation time in ms

            const startTime = performance.now();

            // Use requestAnimationFrame for ultra-smooth 60fps animation
            return new Promise<void>((resolve) => {
                const animate = (currentTime: number) => {
                    if (!globeEl.current) {
                        resolve();
                        return;
                    }

                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function for smooth acceleration/deceleration
                    const eased = progress < 0.5
                        ? 2 * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                    // Calculate current values based on eased progress
                    const currentRotation = totalRotation * eased;
                    const newLng = startLng + currentRotation;
                    const newLat = startLat + (lat - startLat) * eased;
                    const newAltitude = startAltitude + (targetAltitude - startAltitude) * eased;

                    // Update globe position
                    globeEl.current.pointOfView({
                        lat: newLat,
                        lng: newLng,
                        altitude: newAltitude
                    }, 0); // No transition time, we're handling it ourselves

                    // Continue animation or finish
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Final position adjustment
                        globeEl.current.pointOfView({
                            lat,
                            lng,
                            altitude: targetAltitude
                        }, 200);

                        setTimeout(() => resolve(), 200);
                    }
                };

                requestAnimationFrame(animate);
            });
        },
        zoomOut: () => {
            if (!globeEl.current) return;

            // Zoom out to default view
            globeEl.current.pointOfView({
                lat: 0,
                lng: 0,
                altitude: 2.5
            }, 1500);
        }
    }));

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#7c3aed"
            atmosphereAltitude={0.2}
            onGlobeClick={({ lat, lng }) => onLocationSelect(lat, lng)}
        />
    );
});

export default GlobeView;
