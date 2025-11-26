import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobeView, { type GlobeViewHandle } from './components/GlobeView';
import FactCard from './components/FactCard';
import Starfield from './components/Starfield';
import HUD from './components/HUD';
import WelcomeOverlay from './components/WelcomeOverlay';
import { buildIndex, findNearest, type Point } from './lib/spatial';
import animalsDataRaw from './data/animals.json';
import whichCountry from 'which-country';
import iso3166 from 'iso-3166-1';
import { detectOcean } from './lib/oceanDetector';

function App() {
  const [selectedAnimals, setSelectedAnimals] = useState<Point[]>([]);
  const [lastShownAnimal, setLastShownAnimal] = useState<Point | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const globeRef = useRef<GlobeViewHandle>(null);

  // Cast the raw JSON to Point[] to satisfy TypeScript
  const animalsData = animalsDataRaw as unknown as Point[];

  useEffect(() => {
    buildIndex(animalsData);
  }, []);

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

    // 4. Select a random animal from that location, or fall back to nearest
    let selectedAnimal: Point[];
    if (animalsAtLocation.length > 0) {
      const randomIndex = Math.floor(Math.random() * animalsAtLocation.length);
      selectedAnimal = [animalsAtLocation[randomIndex]];
    } else {
      // Fallback: show nearest animal if region has none
      const nearest = findNearest(lat, lng, 1);
      selectedAnimal = nearest;
    }

    // 5. Trigger globe animation and show fact card
    if (globeRef.current) {
      await globeRef.current.animateTo(lat, lng);
    }

    // 6. Show fact card after animation completes and track this animal
    setLastShownAnimal(selectedAnimal[0]);
    setSelectedAnimals(selectedAnimal);
  };

  const handleRandomDiscovery = () => {
    if (animalsData.length === 0) return;

    // Pick a random animal
    const randomAnimal = animalsData[Math.floor(Math.random() * animalsData.length)];

    // Simulate a click at its location
    handleLocationSelect(randomAnimal.lat, randomAnimal.lng);
  };

  const handleClose = () => {
    // Zoom out globe
    if (globeRef.current) {
      globeRef.current.zoomOut();
    }
    // Clear selected animals
    setSelectedAnimals([]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Starfield />

      <GlobeView ref={globeRef} onLocationSelect={handleLocationSelect} />

      {/* Branding Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-8 left-8 z-10 pointer-events-none select-none"
      >
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            Wild Sphere
          </h1>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay onStart={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <HUD
          totalCount={animalsData.length}
          onRandom={handleRandomDiscovery}
        />
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
