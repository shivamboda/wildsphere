import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Flame, Globe, Menu, X } from 'lucide-react';
import type { GlobeStyle } from './GlobeControls';

interface MobileMenuProps {
    currentStyle: GlobeStyle;
    onStyleChange: (style: GlobeStyle) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ currentStyle, onStyleChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const styles: { id: GlobeStyle; label: string; icon: React.ReactNode }[] = [
        { id: 'day', label: 'Day View', icon: <Sun className="w-4 h-4" /> },
        { id: 'heatmap', label: 'Heatmap', icon: <Flame className="w-4 h-4" /> },
        { id: 'night', label: 'Night View', icon: <Globe className="w-4 h-4" /> },
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-6 right-6 z-50 p-2 glass-button rounded-full text-white md:hidden"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 right-6 z-50 w-48 md:hidden"
                    >
                        <div className="glass-panel p-2 rounded-xl flex flex-col gap-1 backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 mb-1">
                                Map View
                            </div>
                            {styles.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => {
                                        onStyleChange(style.id);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                        ${currentStyle === style.id
                                            ? 'bg-white/20 text-white shadow-lg shadow-purple-500/20'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'}
                                    `}
                                >
                                    {style.icon}
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileMenu;
