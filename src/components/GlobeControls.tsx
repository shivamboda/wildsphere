import { motion } from 'framer-motion';
import { Sun, Flame, Moon } from 'lucide-react';
import { useState } from 'react';

export type GlobeStyle = 'night' | 'day' | 'heatmap';

interface GlobeControlsProps {
    currentStyle: GlobeStyle;
    onStyleChange: (style: GlobeStyle) => void;
}

export default function GlobeControls({ currentStyle, onStyleChange }: GlobeControlsProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const styles: { id: GlobeStyle; label: string; icon: React.ReactNode; color: string }[] = [
        { id: 'day', label: 'Day', icon: <Sun className="w-5 h-5" />, color: '#5BC0FF' },
        { id: 'heatmap', label: 'Heatmap', icon: <Flame className="w-5 h-5" />, color: '#8A7CFF' },
        { id: 'night', label: 'Night', icon: <Moon className="w-5 h-5" />, color: '#33E1A0' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
        >
            {styles.map((style, index) => (
                <motion.div
                    key={style.id}
                    className="relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    onMouseEnter={() => setHoveredId(style.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    {/* Tooltip */}
                    <motion.div
                        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{
                            opacity: hoveredId === style.id ? 1 : 0,
                            x: hoveredId === style.id ? 0 : 10
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
                            style={{
                                background: 'rgba(0,0,0,0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                            }}
                        >
                            {style.label}
                        </div>
                    </motion.div>

                    {/* Button */}
                    <motion.button
                        onClick={() => onStyleChange(style.id)}
                        className="relative p-3 rounded-xl transition-all duration-300"
                        style={{
                            background: currentStyle === style.id
                                ? `rgba(${style.id === 'day' ? '91, 192, 255' : style.id === 'heatmap' ? '138, 124, 255' : '51, 225, 160'}, 0.15)`
                                : 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(20px)',
                            border: currentStyle === style.id
                                ? `1px solid ${style.color}40`
                                : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: currentStyle === style.id
                                ? `0 0 20px ${style.color}30, inset 0 0 20px ${style.color}10`
                                : 'none',
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={currentStyle === style.id ? {
                            boxShadow: [
                                `0 0 20px ${style.color}30, inset 0 0 20px ${style.color}10`,
                                `0 0 30px ${style.color}40, inset 0 0 25px ${style.color}15`,
                                `0 0 20px ${style.color}30, inset 0 0 20px ${style.color}10`,
                            ]
                        } : {}}
                        transition={currentStyle === style.id ? {
                            boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        } : { duration: 0.2 }}
                    >
                        {/* Glow ring for active state */}
                        {currentStyle === style.id && (
                            <motion.div
                                className="absolute inset-0 rounded-xl"
                                style={{
                                    border: `2px solid ${style.color}`,
                                    opacity: 0.5,
                                }}
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        )}

                        <span
                            className="relative z-10 transition-colors duration-300"
                            style={{
                                color: currentStyle === style.id ? style.color : 'rgba(255,255,255,0.6)'
                            }}
                        >
                            {style.icon}
                        </span>
                    </motion.button>
                </motion.div>
            ))}
        </motion.div>
    );
}
