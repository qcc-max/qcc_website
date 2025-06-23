import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Star, Users, TrendingUp } from 'lucide-react';

// Types
type Position = {
  x: number;
  y: number;
};

type StatItem = {
  icon: React.ComponentType<{ size?: string | number; className?: string; fill?: string; stroke?: string }>;
  value: string;
  label: string;
  color: string;
  finalPosition: Position;
};

type ParticleProps = {
  id: string;
  size: number;
  initialX: number;
  initialY: number;
  className: string;
  animateProps: MotionProps['animate'];
  transitionProps: MotionProps['transition'];
};

type RevolvingStarProps = {
  index: number;
  allStatsActive: boolean;
  responsivePosition: Position;
  circularKeyframes: {
    x: number[];
    y: number[];
  };
};

type StatItemComponentProps = {
  stat: StatItem;
  index: number;
  responsivePosition: Position;
};

// Memoized particle component with reduced re-renders
const Particle = memo<ParticleProps>(({ 
  size, 
  initialX, 
  initialY, 
  className, 
  animateProps, 
  transitionProps 
}) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      x: initialX,
      y: initialY,
      willChange: 'transform, opacity', // Optimize for transforms
    }}
    animate={animateProps}
    transition={transitionProps}
  />
), (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return prevProps.id === nextProps.id && 
         prevProps.size === nextProps.size &&
         prevProps.initialX === nextProps.initialX &&
         prevProps.initialY === nextProps.initialY &&
         prevProps.className === nextProps.className;
});

Particle.displayName = 'Particle';

// Optimized star component with reduced animation complexity
const RevolvingStar = memo<RevolvingStarProps>(({ 
  index, 
  allStatsActive, 
  responsivePosition, 
  circularKeyframes 
}) => (
  <motion.div
    className="absolute rounded-full flex items-center justify-center"
    style={{
      width: 32,
      height: 32,
      boxShadow: allStatsActive ? "none" : "0 0 12px rgba(245, 158, 11, 0.5)",
      background: allStatsActive ? "none" : "radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(245,158,11,0.3) 70%)",
      willChange: 'transform, opacity',
    }}
    initial={{ x: 0, y: 0, opacity: 1 }}
    animate={{
      x: allStatsActive ? responsivePosition.x : circularKeyframes.x,
      y: allStatsActive ? responsivePosition.y : circularKeyframes.y,
      scale: allStatsActive ? 0 : 1,
      opacity: allStatsActive ? 0 : 1,
    }}
    transition={
      allStatsActive
        ? { duration: 0.8, ease: "easeOut" }
        : { duration: 20, repeat: Infinity, ease: "linear", repeatType: "loop" }
    }
  >
    <Star
      size={20}
      className="text-amber-200"
      fill={index % 2 === 0 ? "#fcd34d" : "#38bdf8"}
      stroke={index % 2 === 0 ? "#f59e0b" : "#0284c7"}
    />
  </motion.div>
), (prevProps, nextProps) => {
  return prevProps.index === nextProps.index &&
         prevProps.allStatsActive === nextProps.allStatsActive &&
         prevProps.responsivePosition.x === nextProps.responsivePosition.x &&
         prevProps.responsivePosition.y === nextProps.responsivePosition.y;
});

RevolvingStar.displayName = 'RevolvingStar';

// Optimized stat item component
const StatItemComponent = memo<StatItemComponentProps>(({ 
  stat, 
  index, 
  responsivePosition 
}) => {
  const StatIcon = stat.icon;
  
  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center text-center"
      style={{ willChange: 'transform, opacity' }}
      initial={{
        opacity: 0,
        scale: 0.5,
        x: responsivePosition.x,
        y: responsivePosition.y
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: responsivePosition.x,
        y: responsivePosition.y
      }}
      transition={{
        duration: 0.7,
        delay: 0.2 + (index * 0.1)
      }}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-amber-50 flex items-center justify-center mb-2 shadow-lg">
        <StatIcon size={30} className={stat.color} />
      </div>
      <h3 className="text-gray-800 text-2xl font-medium mb-1">{stat.value}</h3>
      <p className="text-gray-600 text-sm max-w-[140px]">{stat.label}</p>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.stat.value === nextProps.stat.value &&
         prevProps.index === nextProps.index &&
         prevProps.responsivePosition.x === nextProps.responsivePosition.x &&
         prevProps.responsivePosition.y === nextProps.responsivePosition.y;
});

StatItemComponent.displayName = 'StatItemComponent';

const StatsCard = memo(() => {
  const [allStatsActive, setAllStatsActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const sectionRef = useRef<HTMLElement>(null);

  // Stable stats data reference with reduced object creation
  const stats = useMemo<StatItem[]>(() => [
    {
      icon: Award,
      value: "$5M+",
      label: "Scholarships Awarded",
      color: "text-amber-600",
      finalPosition: { x: -220, y: -160 }
    },
    {
      icon: GraduationCap,
      value: "100%",
      label: "Client Satisfaction Rate",
      color: "text-blue-600",
      finalPosition: { x: 220, y: -160 }
    },
    {
      icon: Users,
      value: "500+",
      label: "Students Mentored",
      color: "text-amber-600",
      finalPosition: { x: -300, y: 0 }
    },
    {
      icon: TrendingUp,
      value: "7+",
      label: "Regions Covered",
      color: "text-blue-600",
      finalPosition: { x: 300, y: 0 }
    },
    {
      icon: Star,
      value: "50+",
      label: "Elite College Placements",
      color: "text-amber-600",
      finalPosition: { x: -220, y: 160 }
    },
    {
      icon: BookOpen,
      value: "3+",
      label: "Years of Experience",
      color: "text-blue-600",
      finalPosition: { x: 220, y: 160 }
    }
  ], []);

  // Pre-computed responsive positions to avoid recalculation
  const responsivePositions = useMemo(() => {
    const small = [
      { x: -75, y: -160 }, { x: 75, y: -160 },
      { x: -130, y: 0 }, { x: 130, y: 0 },
      { x: -75, y: 160 }, { x: 75, y: 160 }
    ];
    
    const medium = [
      { x: -110, y: -160 }, { x: 110, y: -160 },
      { x: -200, y: 0 }, { x: 200, y: 0 },
      { x: -110, y: 160 }, { x: 110, y: 160 }
    ];

    return { small, medium };
  }, []);

  // Optimized position calculator with reduced function calls
  const getResponsivePosition = useCallback((statIndex: number): Position => {
    const defaultPosition = stats[statIndex].finalPosition;
    
    if (windowWidth < 550) {
      return { ...responsivePositions.small[statIndex] };
    } else if (windowWidth < 800) {
      return { ...responsivePositions.medium[statIndex] };
    }
    return defaultPosition;
  }, [windowWidth, responsivePositions, stats]);

  // Optimized resize handler with RAF throttling
  useEffect(() => {
    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setWindowWidth(window.innerWidth);
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Intersection observer with optimized threshold
  useEffect(() => {
    const element = sectionRef.current;
    if (!element || hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.2 && !hasTriggered) {
          setAllStatsActive(true);
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.4, // Simplified threshold
        rootMargin: '0px 0px -20% 0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasTriggered]);

  // Reduced particle count for better performance - core particles
  const coreParticles = useMemo(() => {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < 40; i++) { // Reduced from 80 to 40
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60 + 10;
      const initialX = Math.cos(angle) * radius;
      const initialY = Math.sin(angle) * radius;
      const speed = Math.random() * 8 + 6;
      const opacity = Math.random() * 0.7 + 0.3;
      const isAmber = Math.random() > 0.5;

      particles.push(
        <Particle
          key={`core-${i}`}
          id={`core-${i}`}
          size={size}
          initialX={initialX}
          initialY={initialY}
          className={isAmber ? 'bg-amber-600' : 'bg-blue-600'}
          animateProps={{
            rotate: [0, 360],
            x: [initialX, initialX * 1.2, initialX * 0.8, initialX],
            y: [initialY, initialY * 1.2, initialY * 0.8, initialY],
            opacity: [opacity, opacity * 0.6, opacity * 0.8, opacity],
          }}
          transitionProps={{
            duration: speed,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
      );
    }
    return particles;
  }, []);

  // Reduced ambient particles for better performance
  const ambientParticles = useMemo(() => {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < 150; i++) { // Reduced from 300 to 150
      const size = Math.random() * 2.5 + 0.5;
      const initialX = (Math.random() - 0.5) * 1000;
      const initialY = (Math.random() - 0.5) * 500;
      const duration = Math.random() * 16 + 12;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.1;
      const isAmber = Math.random() > 0.5;

      particles.push(
        <Particle
          key={`ambient-${i}`}
          id={`ambient-${i}`}
          size={size}
          initialX={initialX}
          initialY={initialY}
          className={isAmber ? 'bg-amber-600' : 'bg-blue-600'}
          animateProps={{
            x: [initialX, initialX + 50, initialX - 50, initialX],
            y: [initialY, initialY + 50, initialY - 50, initialY],
            opacity: [opacity, opacity * 0.6, opacity * 0.8, opacity],
          }}
          transitionProps={{
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
            repeatType: "loop",
          }}
        />
      );
    }
    return particles;
  }, []);

  // Pre-computed circular keyframes to reduce calculations
  const circularKeyframesCache = useMemo(() => {
    return stats.map((_, index) => {
      const angleOffset = (index / stats.length) * 2 * Math.PI;
      return {
        x: Array.from({ length: 13 }, (_, i) => 
          Math.cos(angleOffset + (i * Math.PI / 6)) * 100
        ),
        y: Array.from({ length: 13 }, (_, i) => 
          Math.sin(angleOffset + (i * Math.PI / 6)) * 100
        )
      };
    });
  }, [stats]);

  // Memoized revolving stars with cached keyframes
  const revolvingStars = useMemo(() => {
    return stats.map((_, index) => {
      const responsivePosition = getResponsivePosition(index);
      const circularKeyframes = circularKeyframesCache[index];

      return (
        <RevolvingStar
          key={`star-${index}`}
          index={index}
          allStatsActive={allStatsActive}
          responsivePosition={responsivePosition}
          circularKeyframes={circularKeyframes}
        />
      );
    });
  }, [stats, allStatsActive, getResponsivePosition, circularKeyframesCache]);

  // Reduced burst particles for better performance
  const burstParticles = useMemo(() => {
    if (!allStatsActive) return null;

    const particles: JSX.Element[] = [];
    stats.forEach((_, statIndex) => {
      const responsivePosition = getResponsivePosition(statIndex);
      
      for (let i = 0; i < 8; i++) { // Reduced from 15 to 8
        const size = Math.random() * 4 + 1;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const duration = Math.random() * 2.5 + 1.5;
        const delay = Math.random() * 0.5;
        
        particles.push(
          <motion.div
            key={`burst-${statIndex}-${i}`}
            className={`absolute rounded-full ${i % 2 === 0 ? 'bg-amber-600' : 'bg-blue-600'}`}
            style={{
              width: size,
              height: size,
              x: responsivePosition.x,
              y: responsivePosition.y,
              opacity: 0,
              willChange: 'transform, opacity'
            }}
            animate={{
              x: responsivePosition.x + Math.cos(angle) * distance,
              y: responsivePosition.y + Math.sin(angle) * distance,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: duration,
              ease: "easeOut",
              delay: delay,
            }}
          />
        );
      }
    });
    return particles;
  }, [allStatsActive, stats, getResponsivePosition]);

  // Memoized stats content with optimized rendering
  const statsContent = useMemo(() => {
    if (!allStatsActive) return null;

    return (
      <AnimatePresence>
        {stats.map((stat, index) => {
          const responsivePosition = getResponsivePosition(index);
          return (
            <StatItemComponent
              key={`stat-${index}`}
              stat={stat}
              index={index}
              responsivePosition={responsivePosition}
            />
          );
        })}
      </AnimatePresence>
    );
  }, [allStatsActive, stats, getResponsivePosition]);

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-24 px-6 bg-stone-100 relative overflow-hidden"
    >
      {/* Optimized background elements with GPU acceleration */}
      <div 
        className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU layer
        }}
      />
      <div 
        className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU layer
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section heading */}
        <motion.div
          className="flex items-center justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
              our<span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">impact</span>
            </h2>
            
            <motion.span
              className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic"
              animate={{
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✦
            </motion.span>
          </div>
        </motion.div>

        {/* Main visualization */}
        <motion.div
          className="max-w-4xl mx-auto rounded-[48px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative h-[32rem] flex items-center justify-center">
            {/* Particles */}
            {coreParticles}
            {ambientParticles}
            
            {/* Core energy */}
            <motion.div
              className="relative w-40 h-40 rounded-full"
              style={{ willChange: 'transform, opacity' }}
              animate={{
                opacity: allStatsActive ? 0.5 : 1,
                scale: allStatsActive ? 0.8 : 1,
              }}
              transition={{ duration: 1.5, type: "tween" }}
            >
              <motion.div
                className="absolute w-full h-full rounded-full bg-gradient-to-r from-amber-500/30 to-blue-500/20"
                style={{ 
                  boxShadow: "0 0 40px rgba(245, 158, 11, 0.3)",
                  willChange: 'transform',
                  transform: 'translateZ(0)'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <motion.div
                className="absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/30"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <motion.div
                className="absolute top-1/2 left-1/2 rounded-full bg-gradient-to-br from-amber-500 to-blue-500"
                style={{
                  width: 20,
                  height: 20,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.8)",
                  willChange: 'transform'
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            
            {/* Revolving stars */}
            {revolvingStars}
            
            {/* Burst particles */}
            {burstParticles}
            
            {/* Stats content */}
            {statsContent}
          </div>
        </motion.div>
        
        {/* Bottom decorative element */}
        <div className="mt-16 w-full flex justify-center gap-2 text-sm">
          {['✦', 'transforming', 'education', 'outcomes', '✦'].map((word, index) => (
            <motion.span
              key={index}
              className="opacity-70 text-gray-600 cursor-default"
              whileHover={{
                opacity: 1,
                y: -5,
                rotate: index % 2 === 0 ? 15 : -15,
                color: '#F59E0B',
                scale: 1.2
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;