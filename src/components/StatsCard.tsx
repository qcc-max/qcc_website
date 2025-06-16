import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Star, Users, TrendingUp } from 'lucide-react';
import _ from 'lodash';

export default function StatsCard() {
  const [allStatsActive, setAllStatsActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollStateRef = useRef({ statsActive: false });

  // Optimized resize handler with better throttling
  useEffect(() => {
    const handleResize = _.throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 100); // Reduced throttle time for better responsiveness

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);

  // Optimized scroll handler with Intersection Observer fallback
  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let scrollHandler: (() => void) | null = null;

    // Use Intersection Observer if available (better performance)
    if ('IntersectionObserver' in window && sectionRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const shouldActivate = entry.intersectionRatio > 0.2;
          
          if (shouldActivate !== scrollStateRef.current.statsActive) {
            scrollStateRef.current.statsActive = shouldActivate;
            setAllStatsActive(shouldActivate);
          }
        },
        { 
          threshold: [0, 0.2, 0.8, 1],
          rootMargin: '0px 0px -20% 0px' 
        }
      );
      
      intersectionObserver.observe(sectionRef.current);
    } else {
      // Fallback to scroll listener for older browsers
      scrollHandler = _.throttle(() => {
        if (!sectionRef.current) return;
        
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const shouldActivate = rect.top < windowHeight * 0.8;
        if (shouldActivate !== scrollStateRef.current.statsActive) {
          scrollStateRef.current.statsActive = shouldActivate;
          setAllStatsActive(shouldActivate);
        }
      }, 100);

      window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        if ('cancel' in scrollHandler && typeof (scrollHandler as any).cancel === 'function') {
          (scrollHandler as any).cancel();
        }
      }
    };
  }, []);

  // Memoized stats data
  const stats = useMemo(() => [
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

  // Memoized responsive position calculator
  const getResponsivePosition = useCallback((defaultPosition: { x: number; y: number }, statIndex: number) => {
    const smallScreenPositions = [
      { x: -75, y: defaultPosition.y },
      { x: 75, y: defaultPosition.y },
      { x: -130, y: defaultPosition.y },
      { x: 130, y: defaultPosition.y },
      { x: -75, y: defaultPosition.y },
      { x: 75, y: defaultPosition.y }
    ];

    const mediumScreenPositions = [
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

  // Optimized particle generation with reduced count for mobile
  const generateParticleProps = useCallback((type: 'core' | 'ambient') => {
    const isMobile = windowWidth < 768;
    const particleCount = type === 'core' 
      ? (isMobile ? 30 : 60) 
      : (isMobile ? 150 : 300); // Reduced particle count significantly

    return Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * (type === 'core' ? 3 : 2) + (type === 'core' ? 1 : 0.5);
      const angle = Math.random() * Math.PI * 2;
      const radius = type === 'core' ? Math.random() * 60 + 10 : 0;
      
      const initialX = type === 'core' 
        ? Math.cos(angle) * radius 
        : (Math.random() - 0.5) * (isMobile ? 500 : 1000);
      const initialY = type === 'core' 
        ? Math.sin(angle) * radius 
        : (Math.random() - 0.5) * (isMobile ? 300 : 500);
      
      const duration = type === 'core' 
        ? Math.random() * 6 + 4 
        : Math.random() * 12 + 8;
      const opacity = Math.random() * (type === 'core' ? 0.7 : 0.5) + (type === 'core' ? 0.3 : 0.1);
      const hue = Math.random() > 0.5 ? "amber" : "blue";

      return {
        key: `${type}-particle-${i}`,
        size,
        initialX,
        initialY,
        duration,
        opacity,
        hue,
        delay: type === 'ambient' ? Math.random() * 5 : 0
      };
    });
  }, [windowWidth]);

  // Memoized particle components with reduced complexity
  const ParticleSystem = React.memo(() => {
    const coreParticles = useMemo(() => generateParticleProps('core'), [generateParticleProps]);
    const ambientParticles = useMemo(() => generateParticleProps('ambient'), [generateParticleProps]);

    return (
      <>
        {/* Core Particles */}
        {coreParticles.map((particle) => (
          <motion.div
            key={particle.key}
            className={`absolute rounded-full ${particle.hue === 'amber' ? 'bg-amber-600' : 'bg-blue-600'}`}
            style={{
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              x: particle.initialX,
              y: particle.initialY,
            }}
            animate={{
              rotate: [0, 360],
              x: [
                particle.initialX,
                particle.initialX * 1.2,
                particle.initialX * 0.8,
                particle.initialX
              ],
              y: [
                particle.initialY,
                particle.initialY * 1.2,
                particle.initialY * 0.8,
                particle.initialY
              ],
              opacity: [particle.opacity, particle.opacity * 0.6, particle.opacity],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          />
        ))}
        
        {/* Ambient Particles */}
        {ambientParticles.map((particle) => (
          <motion.div
            key={particle.key}
            className={`absolute rounded-full ${particle.hue === 'amber' ? 'bg-amber-600' : 'bg-blue-600'}`}
            style={{
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              x: particle.initialX,
              y: particle.initialY,
            }}
            animate={{
              x: [
                particle.initialX,
                particle.initialX + 50,
                particle.initialX - 50,
                particle.initialX
              ],
              y: [
                particle.initialY,
                particle.initialY + 50,
                particle.initialY - 50,
                particle.initialY
              ],
              opacity: [particle.opacity, particle.opacity * 0.6, particle.opacity],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
              repeatType: "loop",
            }}
          />
        ))}
      </>
    );
  });

  // Optimized revolving stars with simplified animation
  const revolvingStars = useMemo(() => {
    return stats.map((stat, index) => {
      const angleOffset = (index / stats.length) * 2 * Math.PI;
      const responsivePosition = getResponsivePosition(stat.finalPosition, index);
      const radius = windowWidth < 768 ? 80 : 100; // Smaller radius on mobile

      return (
        <motion.div
          key={`star-${index}`}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
          }}
          initial={{
            x: Math.cos(angleOffset) * radius,
            y: Math.sin(angleOffset) * radius,
            opacity: 1,
          }}
          animate={allStatsActive ? {
            x: responsivePosition.x,
            y: responsivePosition.y,
            scale: 0,
            opacity: 0,
          } : {
            x: Math.cos(angleOffset) * radius,
            y: Math.sin(angleOffset) * radius,
            rotate: 360,
          }}
          transition={allStatsActive ? {
            duration: 1,
            ease: "easeOut",
          } : {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
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
  }, [allStatsActive, stats, getResponsivePosition, windowWidth]);

  // Optimized burst particles with conditional rendering
  const BurstParticles = React.memo(({ active }: { active: boolean }) => {
    const bursts = useMemo(() => {
      if (!active) return [];

      const isMobile = windowWidth < 768;
      const particleCount = isMobile ? 10 : 20; // Fewer particles on mobile

      return stats.flatMap((stat, statIndex) => {
        const responsivePosition = getResponsivePosition(stat.finalPosition, statIndex);
        
        return Array.from({ length: particleCount }, (_, i) => {
          const size = Math.random() * 4 + 1;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (isMobile ? 100 : 150) + 50;
          const duration = Math.random() * 1.5 + 1;
          const delay = Math.random() * 0.3;

          return (
            <motion.div
              key={`burst-${statIndex}-${i}`}
              className={`absolute rounded-full ${i % 2 === 0 ? 'bg-amber-600' : 'bg-blue-600'}`}
              style={{
                width: size,
                height: size,
                x: responsivePosition.x,
                y: responsivePosition.y,
              }}
              initial={{ opacity: 0, scale: 0 }}
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
        });
      });
    }, [active, windowWidth, stats, getResponsivePosition]);

    return <>{bursts}</>;
  });

  // Optimized stats content with lazy loading
  const StatsContent = React.memo(({ active }: { active: boolean }) => {
    if (!active) return null;

    return (
      <AnimatePresence mode="wait">
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
              exit={{
                opacity: 0,
                scale: 0.5
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: "easeOut"
              }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-amber-50 flex items-center justify-center mb-2 shadow-lg">
                <StatIcon size={30} className={stat.color} />
              </div>
              <h3 className="text-gray-800 text-2xl font-medium mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm max-w-[140px] leading-tight">{stat.label}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    );
  });

  // Simplified core energy component
  const CoreEnergy = React.memo(() => {
    return (
      <motion.div
        className="relative w-40 h-40 rounded-full"
        animate={{
          opacity: allStatsActive ? 0.5 : 1,
          scale: allStatsActive ? 0.8 : 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut"
        }}
      >
        <motion.div
          className="absolute w-full h-full rounded-full bg-gradient-to-r from-amber-500/30 to-blue-500/20 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
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
          className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-500 to-blue-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
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
    );
  });

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-24 px-6 bg-stone-100 relative overflow-hidden"
    >
      {/* Optimized background elements with CSS animations */}
      <div className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse-slower" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex items-center justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
              our<span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">impact</span>
            </h2>
            
            <motion.span
              className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic select-none"
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
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative h-[32rem] flex items-center justify-center">
            <ParticleSystem />
            <CoreEnergy />
            {revolvingStars}
            <BurstParticles active={allStatsActive} />
            <StatsContent active={allStatsActive} />
          </div>
        </motion.div>
        
        <div className="mt-16 w-full flex justify-center gap-2 text-sm">
          {['✦', 'transforming', 'education', 'outcomes', '✦'].map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="opacity-70 text-gray-600 cursor-default select-none"
              whileHover={{
                opacity: 1,
                y: -5,
                rotate: index % 2 === 0 ? 15 : -15,
                color: '#F59E0B',
                scale: 1.2
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.03); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 22s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}