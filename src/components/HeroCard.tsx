import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { useMemo, memo, useRef, useEffect, useState, useCallback } from 'react';

// Types
type DotConnection = {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
};

type WorldMapProps = {
  dots?: DotConnection[];
  lineColor?: string;
  dotColor?: string;
};

type StatsCardProps = {
  studentCount?: string;
  countryCount?: string;
};

// Inline critical icons as SVG to avoid Lucide bundle overhead
const GraduationCapIcon = memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 w-4 h-4 sm:w-5 sm:h-5">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
));

const UsersIcon = memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
));

// Memoized WorldMap Component with SVG from public folder
const WorldMap = memo(({
  dots = [],
  lineColor = "#0ea5e9",
}: WorldMapProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Memoize expensive calculations
  const projectedDots = useMemo(() => {
    const projectPoint = (lat: number, lng: number) => ({
      x: (lng + 180) * (800 / 360),
      y: (90 - lat) * (400 / 180)
    });

    return dots.map(dot => ({
      start: projectPoint(dot.start.lat, dot.start.lng),
      end: projectPoint(dot.end.lat, dot.end.lng)
    }));
  }, [dots]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const createCurvedPath = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${midY} ${end.x} ${end.y}`;
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    console.warn('Failed to load worldmap.svg from public folder');
    setIsLoaded(true); // Still set to true to show the connections
  }, []);

  return (
    <div ref={mapRef} className="w-full aspect-[2/1] relative">
      {isVisible && (
        <>
          {/* Load SVG from public folder */}
          <img
            src="/worldmap.svg"
            className="h-full w-full opacity-40 pointer-events-none select-none"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)'
            }}
            alt="world map"
            draggable={false}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Show loading state until image loads */}
          {!isLoaded && (
            <div className="h-full w-full bg-gray-100 animate-pulse rounded absolute inset-0" />
          )}
          
          {/* Connection lines and dots */}
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full absolute inset-0 pointer-events-none select-none"
          >
            <defs>
              <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {projectedDots.map((dot, i) => (
              <g key={`connection-${i}`}>
                <motion.path
                  d={createCurvedPath(dot.start, dot.end)}
                  fill="none"
                  stroke="url(#path-gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.2 * i, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                />
                
                {[dot.start, dot.end].map((point, j) => (
                  <g key={`point-${i}-${j}`}>
                    <circle cx={point.x} cy={point.y} r="2" fill={lineColor} />
                    <circle cx={point.x} cy={point.y} r="2" fill={lineColor} opacity="0.5">
                      <animate 
                        attributeName="r" 
                        from="2" 
                        to="8" 
                        dur="1.5s" 
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.25 0.1 0.25 1"
                        keyTimes="0;1"
                      />
                      <animate 
                        attributeName="opacity" 
                        from="0.5" 
                        to="0" 
                        dur="1.5s" 
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.25 0.1 0.25 1"
                        keyTimes="0;1"
                      />
                    </circle>
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </>
      )}
    </div>
  );
});

WorldMap.displayName = 'WorldMap';

// Optimized StatsCard Component with reduced re-renders
const StatsCard = memo(({ 
  studentCount = '500+', 
  countryCount = '15+',
}: StatsCardProps) => {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 flex items-center gap-2 sm:gap-4 z-20 p-2 sm:p-4 w-fit mx-auto text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        backgroundColor: "rgba(255, 255, 255, 0.95)"
      }}
    >
      <div className="flex flex-col items-center">
        <UsersIcon />
        <span className="text-gray-800 font-bold text-sm sm:text-lg leading-none">{studentCount}</span>
        <span className="text-gray-500 text-xs sm:text-sm leading-none mt-0.5 sm:mt-1">Students</span>
      </div>
      
      <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      
      <div className="flex flex-col items-center">
        <GraduationCapIcon />
        <span className="text-gray-800 font-bold text-sm sm:text-lg leading-none">{countryCount}</span>
        <span className="text-gray-500 text-xs sm:text-sm leading-none mt-0.5 sm:mt-1">Countries</span>
      </div>
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

// Optimized background animation component with reduced DOM nodes
const BackgroundAccents = memo(() => {
  const accents = useMemo(() => [
    { style: { top: '250%', right: '-5%', width: '60%', height: '40%' }, color: 'bg-amber-300/20', delay: 15 },
    { style: { top: '38%', right: '20%', width: '50%', height: '50%' }, color: 'bg-amber-300/20', delay: 22 },
    { style: { bottom: '10%', left: '-10%', width: '75%', height: '33%' }, color: 'bg-blue-300/20', delay: 22 },
    { style: { top: '-20%', right: '-20%', width: '75%', height: '75%' }, color: 'bg-blue-300/20', delay: 15 },
    { style: { bottom: '20%', left: '-10%', width: '60%', height: '40%' }, color: 'bg-amber-300/20', delay: 20 },
  ], []);

  return (
    <>
      {accents.map((bg, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl animate-pulse will-change-transform ${bg.color}`}
          style={{
            ...bg.style,
            animationDuration: `${bg.delay}s`,
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
          }}
        />
      ))}
    </>
  );
});

BackgroundAccents.displayName = 'BackgroundAccents';

// Pre-computed animation variants for better performance
const titleVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
};

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }
};

const subtextVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }
};

const mapVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }
};

// Optimized sparkle animation with reduced complexity
const SparkleIcon = memo(() => (
  <motion.span
    className="absolute -top-2 left-3 text-lg text-amber-500 not-italic"
    animate={{
      rotate: [0, 15, 0, -15, 0],
      scale: [1, 1.2, 1, 1.2, 1]
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: [0.25, 0.1, 0.25, 1]
    }}
  >
    ✦
  </motion.span>
));

// Main HeroCard Component
export const HeroCard = memo(() => {
  const navigate = useNavigate();
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for map lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Memoize connection dots to prevent recalculation
  const connectionDots = useMemo(() => [
    { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 35.0522, lng: -100.2437 } },
    { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -25, lng: -55.8919 } },
    { start: { lat: -25, lng: -55.8919 }, end: { lat: 34.5553, lng: 69.2075 } },
    { start: { lat: 47.5074, lng: -1.1278 }, end: { lat: 43.6532, lng: -100.3832 } },
    { start: { lat: 31.5497, lng: 74.3436 }, end: { lat: 43.1332, lng: 131.9113 } },
    { start: { lat: 31.5497, lng: 74.3436 }, end: { lat: -1.2921, lng: 30.8219 } },
    { start: { lat: -45, lng: 143.2093 }, end: { lat: 31.5497, lng: 74.3436 } },
    { start: { lat: 34.5553, lng: 69.2075 }, end: { lat: 39.9334, lng: 32.8597 } },
    { start: { lat: 31.3891, lng: 120.9853 }, end: { lat: 39.9334, lng: 32.8597 } },
    { start: { lat: 43.6532, lng: -70.3832 }, end: { lat: -45, lng: 143.2093 } },
    { start: { lat: 55.52, lng: 13.405 }, end: { lat: 31.5497, lng: 74.3436 } },
    { start: { lat: 31.3891, lng: 120.9853 }, end: { lat: -45, lng: 143.2093 } },
    { start: { lat: 39.9334, lng: 32.8597 }, end: { lat: 47.5074, lng: -1.1278 } },
  ], []);

  // Memoize navigation handlers
  const handleStartJourney = useCallback(() => navigate('/book'), [navigate]);
  const handleBookMeeting = useCallback(() => navigate('/book'), [navigate]);

  // Memoize decorative text items
  const decorativeItems = useMemo(() => 
    ['✦', 'your', 'path', 'to', 'success', '✦'], []
  );

  return (
    <section id="home" className="min-h-screen w-full pt-20 pb-12 bg-stone-100 relative overflow-hidden">
      {/* Optimized background accents */}
      <BackgroundAccents />
      
      <br />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-4">
        <motion.div
          className="mb-6"
          {...titleVariants}
        >
          <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            From applications to acceptances:{' '}
            <span className="font-serif italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              own it
            </span>
            <span className="relative">
              !
              <SparkleIcon />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600">
            Supporting students from{' '}
            <span className="text-amber-500 relative inline-block hover:rotate-3 transition-all cursor-default">
              every corner
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500/30"></span>
            </span>{' '}
            of the world
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          {...buttonVariants}
        >
          <Button
            onClick={handleStartJourney}
            className="h-10 px-6 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full text-base hover:shadow-lg hover:shadow-blue-300/20 hover:-translate-y-1 transition-all"
          >
            Start Your Journey
          </Button>
        
          <Button
            onClick={handleBookMeeting}
            variant="outline"
            className="h-10 px-6 py-2 text-blue-600 border-blue-300 rounded-full text-base hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-1 transition-all"
          >
            Book Free Meeting
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center gap-2 text-xs text-gray-400"
          {...subtextVariants}
        >
          {decorativeItems.map((item, i) => (
            <span
              key={i}
              className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default"
            >
              {item}
            </span>
          ))}
        </motion.div>

        {/* World Map Section - Conditionally rendered */}
        <motion.div
          ref={mapSectionRef}
          className="mt-8 sm:mt-12 w-full max-w-5xl"
          {...mapVariants}
          viewport={{ once: true, margin: '50px' }}
        >
          <div className="flex flex-col items-center">
            <h3 className="text-gray-800 text-sm sm:text-base font-medium flex items-center gap-2 mb-3 sm:mb-4">
              <GraduationCapIcon />
              <span>Our Global Student Network</span>
            </h3>

            <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative mb-4 sm:mb-6">
              {shouldLoadMap ? (
                <WorldMap dots={connectionDots} lineColor="#3B82F6" />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading world map...</div>
                </div>
              )}
            </div>

            {shouldLoadMap && (
              <StatsCard 
                studentCount="500+" 
                countryCount="15+" 
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

HeroCard.displayName = 'HeroCard';