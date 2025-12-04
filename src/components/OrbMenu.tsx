import React from 'react';
import { motion } from 'framer-motion';

const OrbMenu: React.FC = () => {
    return (
        <motion.div
            className="absolute top-6 left-6 z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-full"
                style={{
                    background: 'linear-gradient(135deg, rgba(91, 192, 255, 0.15), rgba(138, 124, 255, 0.15))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 0 30px rgba(91, 192, 255, 0.15)',
                }}
            >
                {/* Planet icon */}
                <motion.img
                    src={`${import.meta.env.BASE_URL}images/planet-earth.png`}
                    alt="Wild Sphere"
                    className="w-7 h-7"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />

                {/* Brand name */}
                <span
                    className="text-lg font-bold tracking-tight"
                    style={{
                        fontFamily: '"Fredoka", sans-serif',
                        background: 'linear-gradient(90deg, #5BC0FF, #8A7CFF, #33E1A0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Wild Sphere
                </span>
            </div>
        </motion.div>
    );
};

export default OrbMenu;
