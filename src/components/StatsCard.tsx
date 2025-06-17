import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Star, Users, TrendingUp, LucideIcon } from 'lucide-react';

// Types
type Position = {
  x: number;
  y: number;
};

type StatItem = {
  icon: LucideIcon;
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

// Memoized particle component with TypeScript
const Particle = memo<ParticleProps>(({ 
  id, 
  size, 
  initialX, 
  initialY, 
  className, 
  animateProps, 
  transitionProps 
}) => (
  <motion.div
    key={id}
    className={`absolute rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      x: initialX,
      y: initialY,
    }}
    animate={animateProps}
    transition={transitionProps}
  />
));

Particle.displayName = 'Particle';

// Memoized star component with TypeScript
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
        ? { duration: 1, ease: "easeOut" } // Slowed down from 1 to 2 seconds
        : { duration: 20, repeat: Infinity, ease: "linear", repeatType: "loop" } // Slowed down from 20 to 30 seconds
    }
  >
    <Star
      size={20}
      className="text-amber-200"
      fill={index % 2 === 0 ? "#fcd34d" : "#38bdf8"}
      stroke={index % 2 === 0 ? "#f59e0b" : "#0284c7"}
    />
  </motion.div>
));

RevolvingStar.displayName = 'RevolvingStar';

// Memoized stat item component with TypeScript
const StatItem = memo<StatItemComponentProps>(({ 
  stat, 
  index, 
  responsivePosition 
}) => {
  const StatIcon = stat.icon;
  
  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center text-center"
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
        duration: 1, // Slowed down from 0.8 to 1.5 seconds
        delay: 0.5 + (index * 0.2) // Increased delay from 0.2 + (index * 0.1)
      }}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-amber-50 flex items-center justify-center mb-2 shadow-lg">
        <StatIcon size={30} className={stat.color} />
      </div>
      <h3 className="text-gray-800 text-2xl font-medium mb-1">{stat.value}</h3>
      <p className="text-gray-600 text-sm max-w-[140px]">{stat.label}</p>
    </motion.div>
  );
});

StatItem.displayName = 'StatItem';

const StatsCard = memo(() => {
  const [allStatsActive, setAllStatsActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false); // New state to track if animation has triggered
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const sectionRef = useRef<HTMLElement>(null);

  // Stable stats data reference
  const stats = useMemo<StatItem[]>(() => [
    {
      icon: Award,
      value: "$10M+",
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

  // Stable responsive positions
  const smallScreenPositions = useMemo<Position[]>(() => [
    { x: -75, y: -160 }, { x: 75, y: -160 },
    { x: -130, y: 0 }, { x: 130, y: 0 },
    { x: -75, y: 160 }, { x: 75, y: 160 }
  ], []);

  const mediumScreenPositions = useMemo<Position[]>(() => [
    { x: -110, y: -160 }, { x: 110, y: -160 },
    { x: -200, y: 0 }, { x: 200, y: 0 },
    { x: -110, y: 160 }, { x: 110, y: 160 }
  ], []);

  // Optimized position calculator
  const getResponsivePosition = useCallback((defaultPosition: Position, statIndex: number): Position => {
    if (windowWidth < 550) {
      return { ...smallScreenPositions[statIndex], y: defaultPosition.y };
    } else if (windowWidth < 800) {
      return { ...mediumScreenPositions[statIndex], y: defaultPosition.y };
    }
    return defaultPosition;
  }, [windowWidth, smallScreenPositions, mediumScreenPositions]);

  // Throttled resize handler
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Modified scroll handler - only triggers once
  useEffect(() => {
    const element = sectionRef.current;
    if (!element || hasTriggered) return; // Exit early if already triggered

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.2 && !hasTriggered) {
          setAllStatsActive(true);
          setHasTriggered(true); // Mark as triggered
          observer.disconnect(); // Disconnect observer after first trigger
        }
      },
      { 
        threshold: [0, 0.2, 0.5, 1],
        rootMargin: '0px 0px -20% 0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasTriggered]);

  // Pre-generated particles - increased count from 40 to 80
  const coreParticles = useMemo(() => {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < 80; i++) { // Increased from 40 to 80
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60 + 10;
      const initialX = Math.cos(angle) * radius;
      const initialY = Math.sin(angle) * radius;
      const speed = Math.random() * 8 + 6; // Slowed down from (6 + 4) to (8 + 6)
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

  // Increased ambient particles from 150 to 300
  const ambientParticles = useMemo(() => {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < 300; i++) { // Increased from 150 to 300
      const size = Math.random() * 2.5 + 0.5;
      const initialX = (Math.random() - 0.5) * 1000;
      const initialY = (Math.random() - 0.5) * 500;
      const duration = Math.random() * 16 + 12; // Slowed down from (12 + 8) to (16 + 12)
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

  // Memoized revolving stars with stable circular keyframes
  const revolvingStars = useMemo(() => {
    return stats.map((stat, index) => {
      const angleOffset = (index / stats.length) * 2 * Math.PI;
      const responsivePosition = getResponsivePosition(stat.finalPosition, index);

      const circularKeyframes = {
        x: Array.from({ length: 13 }, (_, i) => 
          Math.cos(angleOffset + (i * Math.PI / 6)) * 100
        ),
        y: Array.from({ length: 13 }, (_, i) => 
          Math.sin(angleOffset + (i * Math.PI / 6)) * 100
        )
      };

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
  }, [stats, allStatsActive, getResponsivePosition]);

  // Optimized burst particles - increased count from 8 to 15 per stat
  const burstParticles = useMemo(() => {
    if (!allStatsActive) return null;

    const particles: JSX.Element[] = [];
    stats.forEach((stat, statIndex) => {
      const responsivePosition = getResponsivePosition(stat.finalPosition, statIndex);
      
      for (let i = 0; i < 15; i++) { // Increased from 8 to 15
        const size = Math.random() * 4 + 1;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const duration = Math.random() * 2.5 + 1.5; // Slowed down from (1.5 + 1) to (2.5 + 1.5)
        const delay = Math.random() * 0.5; // Increased delay from 0.3 to 0.5
        
        particles.push(
          <motion.div
            key={`burst-${statIndex}-${i}`}
            className={`absolute rounded-full ${i % 2 === 0 ? 'bg-amber-600' : 'bg-blue-600'}`}
            style={{
              width: size,
              height: size,
              x: responsivePosition.x,
              y: responsivePosition.y,
              opacity: 0
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

  // Memoized stats content
  const statsContent = useMemo(() => {
    if (!allStatsActive) return null;

    return (
      <AnimatePresence>
        {stats.map((stat, index) => {
          const responsivePosition = getResponsivePosition(stat.finalPosition, index);
          return (
            <StatItem
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
      {/* Optimized background elements with will-change */}
      <div 
        className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
        style={{ willChange: 'transform' }}
      />
      <div 
        className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
        style={{ willChange: 'transform' }}
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
              animate={{
                opacity: allStatsActive ? 0.5 : 1,
                scale: allStatsActive ? 0.8 : 1,
              }}
              transition={{ duration: 1.5, type: "tween" }} // Slowed down from 1 to 1.5
            >
              <motion.div
                className="absolute w-full h-full rounded-full bg-gradient-to-r from-amber-500/30 to-blue-500/20"
                style={{ 
                  boxShadow: "0 0 40px rgba(245, 158, 11, 0.3)",
                  willChange: 'transform'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 6, // Slowed down from 4 to 6
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
                  duration: 7, // Slowed down from 5 to 7
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
                  duration: 3, // Slowed down from 2 to 3
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