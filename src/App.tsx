import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import GlobeView, { type GlobeViewHandle } from './components/GlobeView';
import FactCard from './components/FactCard';
import Starfield from './components/Starfield';
import HUD from './components/HUD';
import MobileMenu from './components/MobileMenu';
import OrbMenu from './components/OrbMenu';
import WelcomeOverlay from './components/WelcomeOverlay';
import { buildIndex, findNearest, getDistanceKm, type Point } from './lib/spatial';
import animalsDataRaw from './data/animals.json';
import whichCountry from 'which-country';
import iso3166 from 'iso-3166-1';
import { detectOcean } from './lib/oceanDetector';
import { useProgress } from './hooks/useProgress';

import GlobeControls, { type GlobeStyle } from './components/GlobeControls';

// Static Heatmap Data Generation Removed - Using static texture

function App() {
  const [selectedAnimals, setSelectedAnimals] = useState<Point[]>([]);
  const [lastShownAnimal, setLastShownAnimal] = useState<Point | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [globeStyle, setGlobeStyle] = useState<GlobeStyle>('day'); // Default to Day view
  const globeRef = useRef<GlobeViewHandle>(null);

  // Cast the raw JSON to Point[] to satisfy TypeScript
  const animalsData = animalsDataRaw as unknown as Point[];

  const { visitedCount, markAsVisited, visitedIds } = useProgress(animalsData.length);

  useEffect(() => {
    buildIndex(animalsData);
  }, []);

  // Determine globe texture based on style
  const getGlobeTexture = () => {
    switch (globeStyle) {
      case 'day': return 'earth-blue-marble.jpg';
      case 'heatmap': return 'heatmap.png'; // Use optimized PNG texture
      case 'night':
      default: return 'earth-night.jpg';
    }
  };

  const getBumpTexture = () => {
    switch (globeStyle) {
      case 'day': return 'earth-topology.png';
      case 'night': return 'earth-topology.png';
      default: return undefined;
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    // 1. Identify Country or Ocean
    const iso3 = whichCountry([lng, lat]);

    let locationName: string;

    if (!iso3) {
      // Clicked on ocean - detect which one
      const ocean = detectOcean(lat, lng);
      locationName = ocean || 'International Waters';
    } else {
      const countryData = iso3166.whereAlpha3(iso3);
      if (!countryData) {
        const ocean = detectOcean(lat, lng);
        locationName = ocean || 'International Waters';
      } else {
        locationName = countryData.country;
      }
    }

    // 2. Filter Animals by Location (Country or Ocean)
    let animalsAtLocation = animalsData.filter(
      (animal) => animal.country === locationName
    );

    // 3. Exclude the last shown animal if there are multiple options
    if (animalsAtLocation.length > 1 && lastShownAnimal) {
      animalsAtLocation = animalsAtLocation.filter(
        (animal) => animal.name !== lastShownAnimal.name
      );
    }

    // 4. Select the nearest animal from that location
    let selectedAnimal: Point[];
    if (animalsAtLocation.length > 0) {
      // Sort by distance to the click point to ensure regional accuracy
      // e.g. Clicking Gujarat shows Lion, Bengal shows Tiger
      animalsAtLocation.sort((a, b) => {
        const distA = getDistanceKm(lat, lng, a.lat, a.lng);
        const distB = getDistanceKm(lat, lng, b.lat, b.lng);
        return distA - distB;
      });

      // Pick the closest one
      selectedAnimal = [animalsAtLocation[0]];
    } else {
      // Fallback: show nearest animal if region has none
      // Get 5 nearest animals and pick one randomly to ensure variety
      const nearest = findNearest(lat, lng, 5);
      const randomNearestIndex = Math.floor(Math.random() * nearest.length);
      selectedAnimal = [nearest[randomNearestIndex]];
    }

    // 5. Trigger globe animation and show fact card
    if (globeRef.current) {
      await globeRef.current.animateTo(lat, lng);
    }

    // 6. Show fact card after animation completes and track this animal
    setLastShownAnimal(selectedAnimal[0]);
    setSelectedAnimals(selectedAnimal);
    if (selectedAnimal[0].id !== undefined) {
      markAsVisited(selectedAnimal[0].id);
    }
  };

  const handleRandomDiscovery = () => {
    if (animalsData.length === 0) return;

    // Filter for unvisited animals
    const unvisitedAnimals = animalsData.filter(animal =>
      animal.id !== undefined && !visitedIds.includes(String(animal.id))
    );

    let randomAnimal: Point;

    if (unvisitedAnimals.length > 0) {
      // Pick a random unvisited animal
      console.log(`Picking from ${unvisitedAnimals.length} unvisited animals`);
      randomAnimal = unvisitedAnimals[Math.floor(Math.random() * unvisitedAnimals.length)];
    } else {
      // All visited, pick from all animals
      console.log('All animals visited, picking from full list');
      randomAnimal = animalsData[Math.floor(Math.random() * animalsData.length)];
    }

    // Simulate a click at its location
    handleLocationSelect(randomAnimal.lat, randomAnimal.lng);
  };

  const handleClose = () => {
    // Zoom out globe
    if (globeRef.current) {
      if (selectedAnimals.length > 0) {
        globeRef.current.zoomOut(selectedAnimals[0].lat, selectedAnimals[0].lng);
      } else {
        globeRef.current.zoomOut();
      }
    }
    // Clear selected animals
    setSelectedAnimals([]);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
      <Starfield />

      <GlobeView
        ref={globeRef}
        onLocationSelect={handleLocationSelect}
        globeImageUrl={getGlobeTexture()}
        bumpImageUrl={getBumpTexture()}
        showHeatmap={false} // Disable dynamic heatmap
        heatmapData={[]} // No data needed
        isPaused={selectedAnimals.length > 0}
        initialLat={20}
        initialLng={-100}
      />
      {/* OrbMenu - Top left branding */}
      {!showWelcome && (
        <OrbMenu />
      )}

      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay onStart={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          {/* HUD - Visible on all screens, styles handle responsiveness */}
          <HUD
            totalCount={animalsData.length}
            visitedCount={visitedCount}
            onRandom={handleRandomDiscovery}
          />

          {/* Desktop Globe Controls - Hidden on mobile */}
          <div className="hidden md:block">
            <GlobeControls
              currentStyle={globeStyle}
              onStyleChange={setGlobeStyle}
            />
          </div>

          {/* Mobile Menu - Visible only on mobile */}
          <MobileMenu
            currentStyle={globeStyle}
            onStyleChange={setGlobeStyle}
          />
        </>
      )}

      {selectedAnimals.length > 0 && (
        <FactCard
          animals={selectedAnimals}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
