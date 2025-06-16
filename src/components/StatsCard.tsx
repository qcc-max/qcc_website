import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Star, Users, TrendingUp } from 'lucide-react';
import _ from 'lodash';

export default function StatsCard() {
  const [allStatsActive, setAllStatsActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef({ statsActive: false });
  const animationFrameRef = useRef<number>();

  // More aggressive throttling for resize handler
  const handleResize = useCallback(
    _.throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 200), // Increased from 100ms to 200ms
    []
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [handleResize]);

  // Optimized scroll handler with better performance
  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight * 0.7 && !scrollRef.current.statsActive) {
        scrollRef.current.statsActive = true;
        setAllStatsActive(true);
      } else if (rect.top > windowHeight * 0.9 && scrollRef.current.statsActive) {
        scrollRef.current.statsActive = false;
        setAllStatsActive(false);
      }
    });
  }, []);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(
    _.throttle(handleScroll, 32), // ~30fps instead of 60fps
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    throttledScrollHandler();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      throttledScrollHandler.cancel();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [throttledScrollHandler]);

  // Memoized position calculations with better caching
  const positionCalculations = useMemo(() => {
    const smallScreenPositions = [
      { x: -75, y: 0 }, { x: 75, y: 0 }, { x: -130, y: 0 },
      { x: 130, y: 0 }, { x: -75, y: 0 }, { x: 75, y: 0 }
    ];
    
    const mediumScreenPositions = [
      { x: -110, y: 0 }, { x: 110, y: 0 }, { x: -200, y: 0 },
      { x: 200, y: 0 }, { x: -110, y: 0 }, { x: 110, y: 0 }
    ];

    return { smallScreenPositions, mediumScreenPositions };
  }, []);

  const getResponsivePosition = useCallback((defaultPosition: { x: number; y: number }, statIndex: number) => {
    const { smallScreenPositions, mediumScreenPositions } = positionCalculations;
    
    if (windowWidth < 550) {
      return { ...smallScreenPositions[statIndex], y: defaultPosition.y };
    } else if (windowWidth < 800) {
      return { ...mediumScreenPositions[statIndex], y: defaultPosition.y };
    }
    return defaultPosition;
  }, [windowWidth, positionCalculations]);

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

  // Significantly reduced particle generation
  const generateCoreParticles = useMemo(() => {
    const particleCount = 20; // Reduced from 40
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60 + 10;
      
      const initialX = Math.cos(angle) * radius;
      const initialY = Math.sin(angle) * radius;
      
      const speed = Math.random() * 8 + 6; // Faster animation for fewer particles
      const opacity = Math.random() * 0.7 + 0.3;
      const hue = Math.random() > 0.5 ? "amber" : "blue";
      
      particles.push({
        size, initialX, initialY, speed, opacity, hue, key: `core-particle-${i}`
      });
    }
    
    return particles;
  }, []);

  const generateAmbientParticles = useMemo(() => {
    const particleCount = 150; // Reduced from 300
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2.5 + 0.5;
      const initialX = (Math.random() - 0.5) * 1000;
      const initialY = (Math.random() - 0.5) * 500;
      
      const duration = Math.random() * 15 + 10; // Slower for less CPU usage
      const delay = Math.random() * 8; // Spread out animations more
      const opacity = Math.random() * 0.5 + 0.1;
      const hue = Math.random() > 0.5 ? "amber" : "blue";
      
      particles.push({
        size, initialX, initialY, duration, delay, opacity, hue, key: `ambient-particle-${i}`
      });
    }
    
    return particles;
  }, []);

  // Optimized particle components with reduced re-renders
  const CoreParticles = React.memo(() => (
    <>
      {generateCoreParticles.map(particle => (
        <motion.div
          key={particle.key}
          className={`absolute rounded-full ${particle.hue === 'amber' ? 'bg-amber-600' : 'bg-blue-600'}`}
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            x: particle.initialX,
            y: particle.initialY,
            willChange: 'transform'
          }}
          animate={{
            rotate: [0, 360],
            x: [
              particle.initialX,
              particle.initialX * 1.1,
              particle.initialX * 0.9,
              particle.initialX
            ],
            y: [
              particle.initialY,
              particle.initialY * 1.1,
              particle.initialY * 0.9,
              particle.initialY
            ],
            opacity: [particle.opacity, particle.opacity * 0.6, particle.opacity * 0.8, particle.opacity],
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: "linear", // Changed from easeInOut to linear for better performance
            times: [0, 0.33, 0.66, 1],
            repeatType: "loop"
          }}
        />
      ))}
    </>
  ));

  const AmbientParticles = React.memo(() => (
    <>
      {generateAmbientParticles.map(particle => (
        <motion.div
          key={particle.key}
          className={`absolute rounded-full ${particle.hue === 'amber' ? 'bg-amber-600' : 'bg-blue-600'}`}
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            x: particle.initialX,
            y: particle.initialY,
            willChange: 'transform'
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
            opacity: [particle.opacity, particle.opacity * 0.6, particle.opacity * 0.8, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear", // Changed from easeInOut to linear
            delay: particle.delay,
            times: [0, 0.33, 0.66, 1],
            repeatType: "loop"
          }}
        />
      ))}
    </>
  ));

  const ParticleSystem = React.memo(() => (
    <>
      <CoreParticles />
      <AmbientParticles />
    </>
  ));

  // Optimized revolving stars with simpler calculations
  const revolvingMotionValues = useMemo(() => {
    return stats.map((_, index) => {
      const angleOffset = (index / stats.length) * 2 * Math.PI;
      const positions = [];
      
      // Reduced from 12 to 8 keyframes
      for (let i = 0; i <= 8; i++) {
        const angle = angleOffset + (i * Math.PI / 4);
        positions.push({
          x: Math.cos(angle) * 100,
          y: Math.sin(angle) * 100
        });
      }
      
      return positions;
    });
  }, [stats.length]);

  const generateRevolvingStars = useMemo(() => {
    return stats.map((stat, index) => {
      const responsivePosition = getResponsivePosition(stat.finalPosition, index);
      const motionValues = revolvingMotionValues[index];
      
      return (
        <motion.div
          key={`star-${index}`}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            boxShadow: allStatsActive ? "none" : "0 0 12px rgba(245, 158, 11, 0.5)",
            background: allStatsActive ? "none" : "radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(245,158,11,0.3) 70%)",
            willChange: 'transform'
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: allStatsActive ? responsivePosition.x : motionValues.map(pos => pos.x),
            y: allStatsActive ? responsivePosition.y : motionValues.map(pos => pos.y),
            scale: allStatsActive ? 0 : 1,
            opacity: allStatsActive ? 0 : 1,
          }}
          transition={
            allStatsActive
              ? { duration: 1, ease: "easeOut" }
              : { duration: 24, repeat: Infinity, ease: "linear", repeatType: "loop" } // Slower rotation
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
  }, [allStatsActive, stats, getResponsivePosition, revolvingMotionValues]);

  // Optimized burst particles with fewer particles
  const BurstParticles = React.memo(({ active }: { active: boolean }) => {
    const bursts = useMemo(() => {
      if (!active) return [];
      
      const burstParticles: React.ReactNode[] = [];
      
      stats.forEach((stat, statIndex) => {
        const responsivePosition = getResponsivePosition(stat.finalPosition, statIndex);
        
        // Reduced from 12 to 8 particles per burst
        for (let i = 0; i < 8; i++) {
          const size = Math.random() * 4 + 1;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 120 + 40; // Reduced distance
          const duration = Math.random() * 1.2 + 0.8; // Shorter duration
          const delay = Math.random() * 0.2; // Reduced delay spread
          
          burstParticles.push(
            <motion.div
              key={`burst-${statIndex}-${i}`}
              className={`absolute rounded-full ${i % 2 === 0 ? 'bg-amber-600' : 'bg-blue-600'}`}
              style={{
                width: size,
                height: size,
                x: responsivePosition.x,
                y: responsivePosition.y,
                opacity: 0,
                willChange: 'transform'
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
      
      return burstParticles;
    }, [active, getResponsivePosition]);
    
    return <>{bursts}</>;
  });

  // Optimized stats content
  const StatsContent = React.memo(({ active }: { active: boolean }) => {
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
                duration: 0.6, // Reduced from 0.8
                delay: 0.1 + (index * 0.05) // Reduced delays
              }}
              style={{ willChange: 'transform' }}
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

  // Optimized core energy with simpler animations
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
          type: "tween"
        }}
        style={{ willChange: 'transform' }}
      >
        <motion.div
          className="absolute w-full h-full rounded-full bg-gradient-to-r from-amber-500/30 to-blue-500/20"
          style={{
            boxShadow: "0 0 40px rgba(245, 158, 11, 0.3)",
            willChange: 'transform'
          }}
          animate={{
            scale: [1, 1.05, 1], // Reduced scale change
            opacity: [0.7, 0.85, 0.7], // Reduced opacity change
          }}
          transition={{
            duration: 6, // Slower animation
            repeat: Infinity,
            ease: "linear", // Changed from easeInOut
          }}
        />
        
        <motion.div
          className="absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/30"
          animate={{
            scale: [1, 1.08, 1], // Reduced scale change
            opacity: [0.4, 0.6, 0.4], // Reduced opacity change
          }}
          transition={{
            duration: 8, // Slower animation
            repeat: Infinity,
            ease: "linear", // Changed from easeInOut
          }}
          style={{ willChange: 'transform' }}
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
            scale: [1, 1.15, 1], // Reduced scale change
            opacity: [0.8, 0.95, 0.8], // Reduced opacity change
          }}
          transition={{
            duration: 4, // Slower animation
            repeat: Infinity,
            ease: "linear", // Changed from easeInOut
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
      {/* Simplified background elements with CSS animations instead of JS */}
      <div 
        className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl opacity-60" 
        style={{ 
          animation: 'backgroundPulse 15s ease-in-out infinite',
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden'
        }} 
      />
      <div 
        className="absolute top-[150%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl opacity-60" 
        style={{ 
          animation: 'backgroundPulse 22s ease-in-out infinite',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }} 
      />
      <div 
        className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl opacity-60" 
        style={{ 
          animation: 'backgroundPulse 22s ease-in-out infinite',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex items-center justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} // Reduced duration
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
                scale: [1, 1.1, 1, 1.1, 1] // Reduced scale change
              }}
              transition={{
                duration: 8, // Slower animation
                repeat: Infinity,
                ease: "linear" // Changed from easeInOut
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
          transition={{ duration: 0.5, delay: 0.1 }} // Reduced duration and delay
          viewport={{ once: true }}
        >
          <div className="relative h-[32rem] flex items-center justify-center">
            <ParticleSystem />
            <CoreEnergy />
            {generateRevolvingStars}
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
                y: -3, // Reduced movement
                rotate: index % 2 === 0 ? 10 : -10, // Reduced rotation
                color: '#F59E0B',
                scale: 1.1 // Reduced scale
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }} // Better spring config
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
      
      <style>
        {`
          @keyframes backgroundPulse {
            0%, 100% { 
              opacity: 0.4; 
              transform: translateZ(0) scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: translateZ(0) scale(1.02); 
            }
          }

          @keyframes float {
            0% { transform: translateY(0px) translateZ(0); }
            50% { transform: translateY(-15px) translateZ(0); }
            100% { transform: translateY(0px) translateZ(0); }
          }
        
          @keyframes float-medium {
            0% { transform: translateY(0px) rotate(0deg) translateZ(0); }
            50% { transform: translateY(-12px) rotate(10deg) translateZ(0); }
            100% { transform: translateY(0px) rotate(0deg) translateZ(0); }
          }
        
          @keyframes float-slow {
            0% { transform: translateY(0px) rotate(0deg) translateZ(0); }
            50% { transform: translateY(-20px) rotate(5deg) translateZ(0); }
            100% { transform: translateY(0px) rotate(0deg) translateZ(0); }
          }
        
          @keyframes pulse-fast {
            0%, 100% { opacity: 0.3; transform: scale(1) translateZ(0); }
            50% { opacity: 0.5; transform: scale(1.1) translateZ(0); }
          }

          /* Force hardware acceleration for better performance */
          .animate-float,
          .animate-float-medium,
          .animate-float-slow,
          .animate-pulse-fast {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
          }
        
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        
          .animate-float-medium {
            animation: float-medium 7s ease-in-out infinite;
          }
        
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
        
          .animate-pulse-fast {
            animation: pulse-fast 3s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
}