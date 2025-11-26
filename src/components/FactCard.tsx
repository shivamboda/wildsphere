import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Point } from '../lib/spatial';
import LazyImage from './LazyImage';

interface FactCardProps {
    animals: Point[];
    onClose: () => void;
}

const FactCard: React.FC<FactCardProps> = ({ animals, onClose }) => {
    if (animals.length === 0) return null;

    const animal = animals[0];

    return (
        <AnimatePresence>
            {/* Backdrop overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
                onClick={onClose}
            />

            {/* Centered glass card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25
                }}
                className="glass-panel fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-xl text-white p-0 rounded-3xl z-50 overflow-hidden flex flex-col"
            >
                {/* Image Section */}
                <div className="relative w-full h-72 bg-black/40 overflow-hidden group">
                    {animal.image_url && (
                        <>
                            {/* Blurred Background Layer */}
                            <div className="absolute inset-0">
                                <LazyImage
                                    src={animal.image_url}
                                    alt=""
                                    className="w-full h-full object-cover blur-xl opacity-50 scale-110"
                                />
                            </div>

                            {/* Main Image Layer */}
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <LazyImage
                                    src={animal.image_url}
                                    alt={animal.name}
                                    className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                                />
                            </div>
                        </>
                    )}

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20 pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 glass-button text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded-full z-30 transition-transform hover:scale-110 active:scale-95"
                    >
                        ✕
                    </button>

                    <div className="absolute bottom-4 left-6 right-6 z-30">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold text-white mb-1 tracking-tight"
                        >
                            {animal.name}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="text-sm text-white/70 italic"
                        >
                            {animal.scientific}
                        </motion.p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-4">
                    {animal.country && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-cyan-300 mb-4"
                        >
                            <span>📍</span>
                            {animal.country}
                        </motion.div>
                    )}

                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-gray-200 text-lg leading-relaxed font-light"
                    >
                        {animal.fact}
                    </motion.p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FactCard;
