import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Star, Users, TrendingUp } from 'lucide-react';
import _ from 'lodash';

interface Position {
  x: number;
  y: number;
}

interface StatData {
  icon: React.ComponentType<{ size?: string | number; className?: string; fill?: string; stroke?: string }>;
  value: string;
  label: string;
  color: string;
  finalPosition: Position;
}

export default function StatsCard(): JSX.Element {
  const [allStatsActive, setAllStatsActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const sectionRef = useRef<HTMLElement>(null);

  // Stats data - memoized to prevent recreation
  const stats = useMemo((): StatData[] => [
    {
      icon: Award,
      value: "$10M+",
      label: "Scholarships Awarded",
      color: "text-amber-600",
      finalPosition: { x: -220, y: -160 }
    },
    {
      icon: GraduationCap,
      value: "95%",
      label: "University Admittance Rate",
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

  // Optimized responsive position calculator
  const getResponsivePosition = useCallback((defaultPosition: Position, statIndex: number): Position => {
    const smallScreenPositions: Position[] = [
      { x: -75, y: defaultPosition.y },
      { x: 75, y: defaultPosition.y },
      { x: -130, y: defaultPosition.y },
      { x: 130, y: defaultPosition.y },
      { x: -75, y: defaultPosition.y },
      { x: 75, y: defaultPosition.y }
    ];

    const mediumScreenPositions: Position[] = [
      { x: -110, y: defaultPosition.y },
      { x: 110, y: defaultPosition.y },
      { x: -200, y: defaultPosition.y },
      { x: 200, y: defaultPosition.y },
      { x: -110, y: defaultPosition.y },
      { x: 110, y: defaultPosition.y }
    ];

    if (windowWidth < 550) {
      return smallScreenPositions[statIndex];
    } else if (windowWidth < 800) {
      return mediumScreenPositions[statIndex];
    }
    return defaultPosition;
  }, [windowWidth]);

  // Optimized resize handler
  useEffect(() => {
    const handleResize = _.throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 150);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);

  // Optimized scroll handler with RAF
  useEffect(() => {
    let rafId: number;
    let isActive = false;

    const handleScroll = (): void => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) {
          rafId = 0;
          return;
        }

        const rect = sectionRef.current.getBoundingClientRect();
        const shouldBeActive = rect.top < window.innerHeight * 0.2;

        if (shouldBeActive !== isActive) {
          isActive = shouldBeActive;
          setAllStatsActive(shouldBeActive);
        }
        rafId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Optimized particle generation
  const generateCoreParticles = useMemo(() => {
    const particles: JSX.Element[] = [];
    const particleCount = 40; // Reduced from 60

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60 + 10;
      
      const initialX = Math.cos(angle) * radius;
      const initialY = Math.sin(angle) * radius;
      
      const speed = Math.random() * 6 + 4;
      const opacity = Math.random() * 0.7 + 0.3;
      const isAmber = Math.random() > 0.5;

      particles.push(
        <motion.div
          key={`core-${i}`}
          className={`absolute rounded-full ${isAmber ? 'bg-amber-600' : 'bg-blue-600'}`}
          style={{
            width: size,
            height: size,
            opacity,
            x: initialX,
            y: initialY,
          }}
          animate={{
            rotate: [0, 360],
            x: [
              initialX,
              initialX * (1 + (Math.random() * 0.4 - 0.2)),
              initialX * (1 + (Math.random() * 0.4 - 0.2)),
              initialX
            ],
            y: [
              initialY,
              initialY * (1 + (Math.random() * 0.4 - 0.2)),
              initialY * (1 + (Math.random() * 0.4 - 0.2)),
              initialY
            ],
            opacity: [opacity, opacity * 0.6, opacity * 0.8, opacity],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
            repeatType: "loop",
          }}
        />
      );
    }
    return particles;
  }, []);

  const generateAmbientParticles = useMemo(() => {
    const particles: JSX.Element[] = [];
    const particleCount = 500; // 

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2.5 + 0.5;
      const initialX = (Math.random() - 0.5) * 1000;
      const initialY = (Math.random() - 0.5) * 500;
      
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.1;
      const isAmber = Math.random() > 0.5;

      particles.push(
        <motion.div
          key={`ambient-${i}`}
          className={`absolute rounded-full ${isAmber ? 'bg-amber-600' : 'bg-blue-600'}`}
          style={{
            width: size,
            height: size,
            opacity,
            x: initialX,
            y: initialY,
          }}
          animate={{
            x: [
              initialX,
              initialX + Math.random() * 100 - 50,
              initialX + Math.random() * 100 - 50,
              initialX
            ],
            y: [
              initialY,
              initialY + Math.random() * 100 - 50,
              initialY + Math.random() * 100 - 50,
              initialY
            ],
            opacity: [opacity, opacity * 0.6, opacity * 0.8, opacity],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
            times: [0, 0.33, 0.66, 1],
            repeatType: "loop",
          }}
        />
      );
    }
    return particles;
  }, []);

  // Memoized revolving stars
  const revolvingStars = useMemo(() => {
    return stats.map((stat, index) => {
      const angleOffset = (index / stats.length) * 2 * Math.PI;
      const responsivePosition = getResponsivePosition(stat.finalPosition, index);

      // Pre-calculate circular motion arrays
      const circularX = Array.from({ length: 13 }, (_, i) => 
        Math.cos(angleOffset + (i * Math.PI / 6)) * 100
      );
      const circularY = Array.from({ length: 13 }, (_, i) => 
        Math.sin(angleOffset + (i * Math.PI / 6)) * 100
      );

      return (
        <motion.div
          key={`star-${index}`}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            boxShadow: allStatsActive ? "none" : "0 0 12px rgba(245, 158, 11, 0.5)",
            background: allStatsActive ? "none" : "radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(245,158,11,0.3) 70%)",
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: allStatsActive ? responsivePosition.x : circularX,
            y: allStatsActive ? responsivePosition.y : circularY,
            scale: allStatsActive ? 0 : 1,
            opacity: allStatsActive ? 0 : 1,
          }}
          transition={
            allStatsActive
              ? { duration: 1, ease: "easeOut" }
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
      );
    });
  }, [allStatsActive, stats, getResponsivePosition]);

  // Memoized burst particles
  const BurstParticles = React.memo<{ active: boolean }>(({ active }) => {
    const bursts = useMemo(() => {
      if (!active) return [];

      const burstParticles: JSX.Element[] = [];

      stats.forEach((stat, statIndex) => {
        const responsivePosition = getResponsivePosition(stat.finalPosition, statIndex);
        
        for (let i = 0; i < 15; i++) { // Reduced from 20
          const size = Math.random() * 4 + 1;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 150 + 50;
          const duration = Math.random() * 1.5 + 1;
          const delay = Math.random() * 0.3;
          
          burstParticles.push(
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
                duration,
                ease: "easeOut",
                delay,
              }}
            />
          );
        }
      });

      return burstParticles;
    }, [active, getResponsivePosition]);

    return <>{bursts}</>;
  });

  // Memoized stats content
  const StatsContent = React.memo<{ active: boolean }>(({ active }) => {
    if (!active) return null;

    return (
      <AnimatePresence>
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          const responsivePosition = getResponsivePosition(stat.finalPosition, index);
          
          return (
            <motion.div
              key={`stat-content-${index}`}
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
                duration: 0.8,
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
        })}
      </AnimatePresence>
    );
  });

  // Memoized core energy
  const CoreEnergy = React.memo(() => (
    <motion.div
      className="relative w-40 h-40 rounded-full"
      animate={{
        opacity: allStatsActive ? 0.5 : 1,
        scale: allStatsActive ? 0.8 : 1,
      }}
      transition={{
        duration: 1,
        type: "tween"
      }}
    >
      <motion.div
        className="absolute w-full h-full rounded-full bg-gradient-to-r from-amber-500/30 to-blue-500/20"
        style={{
          boxShadow: "0 0 40px rgba(245, 158, 11, 0.3)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 4,
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
          duration: 5,
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
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  ));

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-24 px-6 bg-stone-100 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-[150%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
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

        <motion.div
          className="max-w-4xl mx-auto rounded-[48px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative h-[32rem] flex items-center justify-center">
            {generateCoreParticles}
            {generateAmbientParticles}
            <CoreEnergy />
            {revolvingStars}
            <BurstParticles active={allStatsActive} />
            <StatsContent active={allStatsActive} />
          </div>
        </motion.div>
        
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
}