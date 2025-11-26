import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeOverlayProps {
    onStart: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="text-center"
            >
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-500 bg-clip-text text-transparent mb-6 tracking-tighter">
                    Wild Sphere
                </h1>
                <p className="text-xl text-gray-300 mb-12 font-light tracking-wide">
                    Discover the wonders of our planet's wildlife.
                </p>

                <button
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Explore the Wild
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeOverlay;
