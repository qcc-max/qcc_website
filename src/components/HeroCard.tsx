import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { GraduationCap, Users } from 'lucide-react';
import { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react';
import DottedMap from 'dotted-map';

// Types
type DotConnection = {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
};

type WorldMapProps = {
  dots?: DotConnection[];
  lineColor?: string;
  dotColor?: string;
  dotOpacity?: number;
};

// Pre-calculate static data outside component
const STATIC_CONNECTION_DOTS = [
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
];

const STATIC_DECORATIVE_ITEMS = ['✦', 'your', 'path', 'to', 'success', '✦'];

const cachedMaps = new Map();

// Optimized WorldMap Component with improved lazy loading
const WorldMap = memo(({
  dots = [],
  lineColor = "#0ea5e9",
  dotColor = "#374151",
  dotOpacity = 0.4,
}: WorldMapProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading with reduced threshold
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Delay map loading slightly to prioritize visible content
          const timer = setTimeout(() => setIsMapLoaded(true), 100);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { svgMap, processedDots } = useMemo(() => {
    if (!isMapLoaded) return { svgMap: '', processedDots: [] };
    
    const cacheKey = `${dotColor}-${dots.length}`;
    
    if (cachedMaps.has(cacheKey)) {
      return cachedMaps.get(cacheKey);
    }

    const map = new DottedMap({ height: 80, grid: "diagonal" }); // Reduced height for performance
    const svgMap = map.getSVG({
      radius: 0.2, // Slightly smaller for better performance
      color: dotColor,
      shape: "circle",
      backgroundColor: "transparent",
    });

    // Optimized projection calculations
    const projectPoint = (lat: number, lng: number) => ({
      x: ((lng + 180) * 800) / 360,
      y: ((90 - lat) * 400) / 180
    });

    const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midY = Math.min(start.y, end.y) - 50;
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };

    const processedDots = dots.map((dot, i) => {
      const start = projectPoint(dot.start.lat, dot.start.lng);
      const end = projectPoint(dot.end.lat, dot.end.lng);
      return { start, end, path: createCurvedPath(start, end), index: i };
    });

    const result = { svgMap, processedDots };
    cachedMaps.set(cacheKey, result);
    return result;
  }, [dotColor, dots, isMapLoaded]);

  const dataUri = useMemo(() => 
    svgMap ? `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}` : '', 
    [svgMap]
  );

  return (
    <div ref={observerRef} className="w-full aspect-[2/1] relative">
      {isVisible ? (
        isMapLoaded ? (
          <>
            <img
              src={dataUri}
              className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
              style={{ opacity: dotOpacity }}
              alt="world map"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
            
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

              {processedDots.map(
                (
                  {
                    start,
                    end,
                    path,
                    index,
                  }: {
                    start: { x: number; y: number };
                    end: { x: number; y: number };
                    path: string;
                    index: number;
                  }
                ) => (
                  <g key={index}>
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="url(#path-gradient)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.1 * index, ease: "easeOut" }}
                    />
                    
                    {[start, end].map((point, j) => (
                      <g key={`${index}-${j}`}>
                        <circle cx={point.x} cy={point.y} r="2" fill={lineColor} />
                        <circle cx={point.x} cy={point.y} r="2" fill={lineColor} opacity="0.5">
                          <animate attributeName="r" from="2" to="8" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    ))}
                  </g>
                )
              )}
            </svg>
          </>
        ) : (
          <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg" />
        )
      ) : (
        <div className="h-full w-full bg-gray-100 rounded-lg" />
      )}
    </div>
  );
});

WorldMap.displayName = 'WorldMap';

// Optimized StatsCard Component
const StatsCard = memo(({ 
  studentCount = '500+', 
  countryCount = '15+',
}: {
  studentCount?: string;
  countryCount?: string;
}) => (
  <motion.div
    className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg border border-white/30 flex items-center gap-2 sm:gap-3 z-20 p-2 sm:p-3 w-fit mx-auto text-center transition-all duration-300 hover:shadow-xl hover:bg-white/95"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 1 }}
    whileHover={{ scale: 1.02 }} // Reduced scale for smoother animation
  >
    <div className="flex flex-col items-center">
      <Users className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4 mb-0.5" />
      <span className="text-gray-800 font-bold text-xs sm:text-base">{studentCount}</span>
      <span className="text-gray-500 text-xs mt-0.5">Students</span>
    </div>
    
    <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
    
    <div className="flex flex-col items-center">
      <GraduationCap className="text-amber-500 w-3 h-3 sm:w-4 sm:h-4 mb-0.5" />
      <span className="text-gray-800 font-bold text-xs sm:text-base">{countryCount}</span>
      <span className="text-gray-500 text-xs mt-0.5">Countries</span>
    </div>
  </motion.div>
));

StatsCard.displayName = 'StatsCard';

// Pure CSS background accents for better performance
const BackgroundAccents = memo(() => (
  <>
    <div className="absolute top-[250%] right-[-5%] w-[60%] h-[40%] rounded-full blur-3xl bg-amber-300/20 animate-pulse" style={{ animationDuration: '15s' }} />
    <div className="absolute top-[38%] right-[20%] w-[50%] h-[50%] rounded-full blur-3xl bg-amber-300/20 animate-pulse" style={{ animationDuration: '22s' }} />
    <div className="absolute bottom-[10%] left-[-10%] w-[75%] h-[33%] rounded-full blur-3xl bg-blue-300/20 animate-pulse" style={{ animationDuration: '22s' }} />
    <div className="absolute top-[-20%] right-[-20%] w-[75%] h-[75%] rounded-full blur-3xl bg-blue-300/20 animate-pulse" style={{ animationDuration: '15s' }} />
    <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[40%] rounded-full blur-3xl bg-amber-300/20 animate-pulse" style={{ animationDuration: '20s' }} />
  </>
));

BackgroundAccents.displayName = 'BackgroundAccents';

// Simplified star animation with reduced complexity
const OptimizedStar = memo(() => (
  <motion.span
    className="absolute -top-2 left-3 text-lg text-amber-500"
    animate={{
      rotate: [0, 15, 0, -15, 0],
      scale: [1, 1.1, 1, 1.1, 1]
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    ✦
  </motion.span>
));

OptimizedStar.displayName = 'OptimizedStar';

// Main HeroCard Component with optimizations
export const HeroCard = memo(() => {
  const navigate = useNavigate();

  // Stable callback references
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleStartJourney = useCallback(() => handleNavigation('/book'), [handleNavigation]);
  const handleBookMeeting = useCallback(() => handleNavigation('/book'), [handleNavigation]);

  return (
    <section id="home" className="min-h-screen w-full pt-20 pb-12 bg-stone-100 relative overflow-hidden">
      <BackgroundAccents />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-4 pt-4">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            From applications to acceptances:{' '}
            <span className="font-serif italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              own it
            </span>
            <span className="relative">
              !
              <OptimizedStar />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600">
            Supporting students from{' '}
            <span className="text-amber-500 relative inline-block transition-transform hover:rotate-3 cursor-default">
              every corner
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500/30" />
            </span>{' '}
            of the world
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            onClick={handleStartJourney}
            className="h-10 px-6 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full text-base transition-all hover:shadow-lg hover:shadow-blue-300/20 hover:-translate-y-1"
          >
            Start Your Journey
          </Button>
        
          <Button
            onClick={handleBookMeeting}
            variant="outline"
            className="h-10 px-6 py-2 text-blue-600 border-blue-300 rounded-full text-base transition-all hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-1"
          >
            Book Free Meeting
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center gap-2 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {STATIC_DECORATIVE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="opacity-70 transition-all cursor-default hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3"
            >
              {item}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-12 w-full max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="flex flex-col items-center">
            <h3 className="text-gray-800 text-sm sm:text-base font-medium flex items-center gap-2 mb-3 sm:mb-4">
              <GraduationCap size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
              Our Global Student Network
            </h3>

            <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative mb-4 sm:mb-6">
              <WorldMap dots={STATIC_CONNECTION_DOTS} lineColor="#3B82F6" />
            </div>

            <StatsCard 
              studentCount="500+" 
              countryCount="15+" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
});

HeroCard.displayName = 'HeroCard';