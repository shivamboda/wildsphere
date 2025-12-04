import React, { useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import type { Point } from '../lib/spatial';

interface FactCardProps {
    animals: Point[];
    onClose: () => void;
}

const FactCard: React.FC<FactCardProps> = ({ animals, onClose }) => {
    if (animals.length === 0) return null;

    const animal = animals[0];
    const [imageLoaded, setImageLoaded] = useState(false);

    // Resolve image URL (same logic as LazyImage)
    const resolvedImageUrl = useMemo(() => {
        if (!animal.image_url) return '';
        return animal.image_url.startsWith('/')
            ? `${import.meta.env.BASE_URL}${animal.image_url.slice(1)}`
            : animal.image_url;
    }, [animal.image_url]);

    // Tilt Effect Logic
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["2deg", "-2deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-2deg", "2deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-[12px] z-40"
                onClick={onClose}
            />

            {/* Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
                <motion.div
                    ref={cardRef}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="pointer-events-auto relative w-full max-w-[920px] rounded-3xl shadow-[0_20px_40px_rgba(2,6,23,0.55)] overflow-hidden flex flex-col md:flex-row md:h-[480px]"
                >
                    {/* Left: Image Area */}
                    <div className="relative w-full h-[40vh] md:h-full md:w-[48%] shrink-0 overflow-hidden bg-black">
                        {resolvedImageUrl && (
                            <>
                                {/* Layer 1: Blurred stretched background */}
                                <div
                                    className="absolute inset-[-20px] z-0"
                                    style={{
                                        backgroundImage: `url(${resolvedImageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'blur(30px)',
                                        opacity: 0.8,
                                    }}
                                />

                                {/* Layer 2: Darkening overlay */}
                                <div className="absolute inset-0 z-[1] bg-black/20" />

                                {/* Layer 3: Main image - fills container, no rounded corners */}
                                <motion.div
                                    className="relative z-[2] w-full h-full"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img
                                        src={resolvedImageUrl}
                                        alt={`${animal.name} - ${animal.country}`}
                                        onLoad={() => setImageLoaded(true)}
                                        className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 relative flex flex-col p-6 md:p-8 justify-center bg-[rgba(5,10,15,0.85)] backdrop-blur-xl">
                        <motion.button
                            whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(76,224,210,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:border-[#4CE0D2]/50 hover:text-[#4CE0D2] transition-all"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>

                        <div className="flex flex-col gap-5 max-w-lg">
                            <div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-[22px] md:text-[36px] font-bold text-white leading-tight tracking-tight mb-1"
                                    style={{ fontFamily: '"Outfit", sans-serif' }}
                                >
                                    {animal.name}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-sm font-medium italic text-white/60"
                                >
                                    {animal.scientific}
                                </motion.p>
                            </div>

                            {animal.country && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium uppercase tracking-wide text-white">
                                        <MapPin className="w-3 h-3 text-[#4CE0D2]" />
                                        {animal.country}
                                    </span>
                                </motion.div>
                            )}

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm md:text-base leading-relaxed text-white/85"
                            >
                                {animal.fact}
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FactCard;
