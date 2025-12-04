import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface WelcomeOverlayProps {
    onStart: () => void;
}

// Floating particle component
const FloatingParticle: React.FC<{ delay: number; duration: number; size: number; left: string; color: string }> = ({
    delay, duration, size, left, color
}) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
            width: size,
            height: size,
            left,
            bottom: '-20px',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: 'blur(1px)',
        }}
        initial={{ y: 0, opacity: 0 }}
        animate={{
            y: [0, -1200],
            opacity: [0, 1, 1, 0],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'linear',
        }}
    />
);

// Animated letter component with gradient color based on position
const AnimatedLetter: React.FC<{ letter: string; index: number; total: number; isSpace: boolean }> = ({ letter, index, total, isSpace }) => {
    const getGradientColor = (pos: number) => {
        const t = pos / (total - 1);
        if (t < 0.5) {
            const r = Math.round(0 + (168 - 0) * (t * 2));
            const g = Math.round(212 + (85 - 212) * (t * 2));
            const b = Math.round(255 + (247 - 255) * (t * 2));
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            const r = Math.round(168 + (249 - 168) * ((t - 0.5) * 2));
            const g = Math.round(85 + (115 - 85) * ((t - 0.5) * 2));
            const b = Math.round(247 + (22 - 247) * ((t - 0.5) * 2));
            return `rgb(${r}, ${g}, ${b})`;
        }
    };

    return (
        <motion.span
            className={`inline-block ${isSpace ? 'w-4 md:w-6' : ''}`}
            initial={{ y: 60, opacity: 0, rotateX: -90, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.06,
                type: 'spring',
                stiffness: 100,
            }}
            style={{
                transformOrigin: 'bottom',
                display: 'inline-block',
                color: getGradientColor(index),
                fontFamily: '"Fredoka", sans-serif',
                textShadow: '0 0 20px currentColor',
                cursor: 'default',
            }}
        >
            {letter}
        </motion.span>
    );
};

// Floating animal doodle component
const FloatingDoodle: React.FC<{ src: string; x: string; y: string; size: number; delay: number; duration: number }> = ({
    src, x, y, size, delay, duration
}) => (
    <motion.img
        src={src}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
            left: x,
            top: y,
            width: size,
            height: size,
            objectFit: 'contain',
        }}
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{
            opacity: [0.4, 0.6, 0.5, 0.6, 0.4],
            y: [0, -8, 0, -5, 0],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
);

// Pulsing glow behind title
const TitleGlow: React.FC = () => (
    <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
            background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3) 0%, transparent 60%)',
            filter: 'blur(60px)',
        }}
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
);

// Aurora/nebula effect
const AuroraEffect: React.FC = () => (
    <>
        <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.08) 50%, transparent 70%)',
            }}
            animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
            }}
        />
        <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: 'linear-gradient(-45deg, transparent 30%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)',
            }}
            animate={{
                backgroundPosition: ['100% 0%', '0% 100%'],
            }}
            transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
            }}
        />
    </>
);

// Orbiting ring animation
const OrbitingRing: React.FC<{ size: number; delay: number; duration: number; color: string }> = ({
    size, delay, duration, color
}) => (
    <motion.div
        className="absolute rounded-full border pointer-events-none"
        style={{
            width: size,
            height: size,
            borderColor: color,
            borderWidth: 1,
            left: '50%',
            top: '50%',
            marginLeft: -size / 2,
            marginTop: -size / 2,
        }}
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{
            opacity: [0, 0.4, 0.4, 0],
            scale: [0.8, 1.2, 1.5, 2],
            rotate: 360,
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'linear',
        }}
    />
);

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile] = useState(() => window.innerWidth < 768);

    const title = "Wild Sphere";
    const letters = title.split('');

    // Generate subtle particles (memoized to prevent repositioning)
    const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: (i * 0.4) % 8,
        duration: 12 + (i % 8),
        size: 4 + (i % 8),
        left: `${(i * 5) % 100}%`,
        color: ['rgba(0, 212, 255, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(249, 115, 22, 0.2)'][i % 3],
    })), []);

    // Generate floating doodles - 25 random positioned doodles (memoized to prevent repositioning)
    const baseUrl = import.meta.env.BASE_URL;
    const doodleImages = [
        'butterfly.png', 'dolphin.png', 'eagle.png',
        'elephant.png', 'lion.png', 'wolf.png'
    ];
    const floatingDoodles = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
        id: i,
        src: `${baseUrl}images/doodles/${doodleImages[i % doodleImages.length]}`,
        x: `${5 + (i * 17 + i * i * 3) % 90}%`,
        y: `${5 + (i * 23 + i * 7) % 85}%`,
        size: 25 + (i * 11) % 35, // 25-60px varying sizes
        delay: (i * 0.5) % 8,
        duration: 10 + (i % 6),
    })), [baseUrl]);

    // Handle mouse movement for parallax effect on text only (desktop only)
    useEffect(() => {
        // Skip on mobile to prevent flickering from touch events
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 40,
                y: (e.clientY - window.innerHeight / 2) / 40,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at center, rgba(10,15,25,0.98) 0%, rgba(5,8,15,1) 100%)' }}
        >
            {/* Aurora effect - desktop only */}
            {!isMobile && <AuroraEffect />}

            {/* Floating particles - desktop only */}
            {!isMobile && particles.map((p) => (
                <FloatingParticle key={p.id} {...p} />
            ))}

            {/* Floating animal doodles - desktop only */}
            {!isMobile && floatingDoodles.map((d) => (
                <FloatingDoodle key={`doodle-${d.id}`} {...d} />
            ))}

            {/* Orbiting rings - desktop only */}
            {!isMobile && (
                <>
                    <OrbitingRing size={300} delay={0} duration={15} color="rgba(168, 85, 247, 0.25)" />
                    <OrbitingRing size={450} delay={2} duration={20} color="rgba(0, 212, 255, 0.2)" />
                    <OrbitingRing size={600} delay={4} duration={25} color="rgba(249, 115, 22, 0.15)" />
                </>
            )}

            {/* Title glow */}
            <TitleGlow />

            {/* Main content with parallax */}
            <motion.div
                className="text-center relative z-10 px-4"
                style={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                }}
            >
                {/* Species badge */}
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{
                        background: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.img
                        src={`${import.meta.env.BASE_URL}images/planet-earth.png`}
                        alt="Earth"
                        className="w-5 h-5"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-sm text-purple-300 font-medium">500+ Species</span>
                </motion.div>

                {/* Animated title - letter by letter */}
                <motion.h1
                    className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-4 tracking-tighter cursor-default select-none"
                >
                    {letters.map((letter, index) => (
                        <AnimatedLetter
                            key={index}
                            letter={letter}
                            index={index}
                            total={letters.length}
                            isSpace={letter === ' '}
                        />
                    ))}
                </motion.h1>

                {/* Glowing underline with sparkle effect */}
                <motion.div
                    className="h-1.5 mx-auto rounded-full mb-8 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(90deg, transparent, #00d4ff, #a855f7, #f97316, transparent)',
                    }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '70%', opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                >
                    <motion.div
                        className="absolute top-0 h-full w-8"
                        style={{
                            background: 'linear-gradient(90deg, transparent, white, transparent)',
                        }}
                        animate={{ left: ['-10%', '110%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl lg:text-2xl text-gray-300/90 mb-12 font-medium tracking-wide max-w-2xl mx-auto"
                    style={{ fontFamily: '"Quicksand", sans-serif' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                >
                    Discover the wonders of our planet's wildlife
                </motion.p>

                {/* Animated button */}
                <motion.button
                    onClick={onStart}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className="group relative px-10 py-5 rounded-full font-bold text-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.8, type: 'spring', stiffness: 150 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,255,0.9))',
                        boxShadow: isHovered
                            ? '0 0 50px rgba(168, 85, 247, 0.6), 0 0 100px rgba(0, 212, 255, 0.4), 0 20px 40px rgba(0,0,0,0.3)'
                            : '0 10px 50px rgba(0,0,0,0.4)',
                    }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                            boxShadow: isHovered
                                ? ['inset 0 0 20px rgba(168,85,247,0.3)', 'inset 0 0 30px rgba(0,212,255,0.3)', 'inset 0 0 20px rgba(249,115,22,0.3)']
                                : 'inset 0 0 0px transparent',
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <span className="relative z-10 flex items-center gap-3 text-gray-900 font-semibold">
                        <span>Explore the Wild</span>
                        <motion.span
                            animate={{ x: isHovered ? [0, 5, 0] : 0 }}
                            transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                        >
                            →
                        </motion.span>
                    </span>

                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                        }}
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                </motion.button>
            </motion.div>

            {/* Corner decorations */}
            <motion.div
                className="absolute top-6 left-6 w-24 h-24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
            </motion.div>
            <motion.div
                className="absolute top-6 right-6 w-24 h-24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-purple-500/50 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent" />
            </motion.div>
            <motion.div
                className="absolute bottom-6 left-6 w-24 h-24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
            >
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent" />
                <div className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-orange-500/50 to-transparent" />
            </motion.div>
            <motion.div
                className="absolute bottom-6 right-6 w-24 h-24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
            >
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-green-500/50 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-green-500/50 to-transparent" />
            </motion.div>

        </motion.div >
    );
};

export default WelcomeOverlay;
