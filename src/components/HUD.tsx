import React from 'react';
import { motion } from 'framer-motion';

interface HUDProps {
    totalCount: number;
    onRandom: () => void;
}

const HUD: React.FC<HUDProps> = ({ totalCount, onRandom }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 w-full justify-center px-4"
        >
            <div className="glass-panel px-6 py-3 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto max-w-sm md:max-w-none">
                <div className="flex flex-col items-start">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Status</span>
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {totalCount} Species Mapped
                    </span>
                </div>

                <div className="hidden md:block h-8 w-px bg-white/10" />

                <button
                    onClick={onRandom}
                    className="glass-button px-5 py-2 rounded-full text-sm font-medium text-white hover:text-cyan-300 flex items-center gap-2 group"
                >
                    <span>🎲</span>
                    Discover Random
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </motion.div>
    );
};

export default HUD;
