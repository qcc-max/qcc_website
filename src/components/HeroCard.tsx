import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { GraduationCap, Users } from 'lucide-react';
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

// WorldMap Component
const WorldMap = ({
  dots = [],
  lineColor = "#0ea5e9",
  dotColor = "#374151",
  dotOpacity = 0.4,
}: WorldMapProps) => {
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const svgMap = map.getSVG({
    radius: 0.22,
    color: dotColor,
    shape: "circle",
    backgroundColor: "transparent",
  });

  const projectPoint = (lat: number, lng: number) => ({
    x: (lng + 180) * (800 / 360),
    y: (90 - lat) * (400 / 180)
  });

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] relative">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        style={{ opacity: dotOpacity }}
        alt="world map"
        draggable={false}
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

        {dots.map((dot, i) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          
          return (
            <g key={`connection-${i}`}>
              <motion.path
                d={createCurvedPath(start, end)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2 * i, ease: "easeOut" }}
              />
              
              {[start, end].map((point, j) => (
                <g key={`point-${i}-${j}`}>
                  <circle cx={point.x} cy={point.y} r="2" fill={lineColor} />
                  <circle cx={point.x} cy={point.y} r="2" fill={lineColor} opacity="0.5">
                    <animate attributeName="r" from="2" to="8" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Simplified StatsCard Component with CSS positioning
const StatsCard = ({ 
  studentCount = '500+', 
  countryCount = '15+',
}) => {
  return (
    <motion.div
      className="absolute bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 flex items-center gap-2 z-20
                 // Responsive sizing - made smaller and more stylish
                 p-1.5 text-xs w-28 h-12
                 sm:p-2 sm:text-xs sm:w-32 sm:h-14
                 md:p-2 md:text-sm md:w-36 md:h-16
                 lg:p-2.5 lg:text-sm lg:w-40 lg:h-18
                 xl:p-3 xl:text-base xl:w-44 xl:h-20
                 hover:shadow-2xl hover:bg-white/95 transition-all duration-300"
      style={{
        // Position between Australia and Africa (Indian Ocean area)
        left: '62%',  // Horizontal position - adjust this to move left/right
        top: '87%',   // Vertical position - adjust this to move up/down
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex flex-col items-center flex-1">
        <Users className="text-blue-500 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 mb-0.5" />
        <span className="text-gray-800 font-bold text-[10px] sm:text-xs md:text-sm lg:text-sm leading-none">{studentCount}</span>
        <span className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-none mt-0.5">Students</span>
      </div>
      
      <div className="w-px h-6 sm:h-7 md:h-8 lg:h-10 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      
      <div className="flex flex-col items-center flex-1">
        <GraduationCap className="text-amber-500 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 mb-0.5" />
        <span className="text-gray-800 font-bold text-[10px] sm:text-xs md:text-sm lg:text-sm leading-none">{countryCount}</span>
        <span className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-none mt-0.5">Countries</span>
      </div>
    </motion.div>
  );
};

// HeroCard Component
export const HeroCard = () => {
  const navigate = useNavigate();

  const connectionDots = [
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

  return (
    <section id="home" className="min-h-screen w-full pt-20 pb-12 bg-stone-100 relative overflow-hidden">
      {/* Animated background accents */}
      {[
        { top: '250%', right: '-5%', width: '60%', height: '40%', color: 'amber', delay: 15 },
        { top: '38%', right: '20%', width: '50%', height: '50%', color: 'amber', delay: 22 },
        { bottom: '10%', left: '-10%', width: '75%', height: '33%', color: 'blue', delay: 22 },
        { top: '-20%', right: '-20%', width: '75%', height: '75%', color: 'blue', delay: 15 },
        { bottom: '20%', left: '-10%', width: '60%', height: '40%', color: 'amber', delay: 20 },
      ].map((bg, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl animate-pulse bg-${bg.color}-300/20`}
          style={{
            top: bg.top,
            right: bg.right,
            bottom: bg.bottom,
            left: bg.left,
            width: bg.width,
            height: bg.height,
            animationDuration: `${bg.delay}s`
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-4">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">
            From applications to acceptances:{' '}
            <span className="font-serif italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              own it
            </span>
            <span className="relative">
              !
              <motion.span
                className="absolute -top-2 left-3 text-lg text-amber-500 not-italic"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Button
            onClick={() => navigate('/book')}
            className="h-10 px-6 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full text-base hover:shadow-lg hover:shadow-blue-300/20 hover:-translate-y-1 transition-all"
          >
            Start Your Journey
          </Button>
        
          <Button
            onClick={() => navigate('/book')}
            variant="outline"
            className="h-10 px-6 py-2 text-blue-600 border-blue-300 rounded-full text-base hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-1 transition-all"
          >
            Book Free Meeting
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center gap-2 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {['✦', 'your', 'path', 'to', 'success', '✦'].map((item, i) => (
            <span
              key={i}
              className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default"
            >
              {item}
            </span>
          ))}
        </motion.div>

        {/* World Map Section */}
        <motion.div
          className="mt-12 w-full max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center">
            <h3 className="text-gray-800 text-base font-medium flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-amber-500" />
              Our Global Student Network
            </h3>

            <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] relative">
              <WorldMap dots={connectionDots} lineColor="#3B82F6" />
              {/* Stats card with simple CSS positioning */}
              <StatsCard 
                studentCount="500+" 
                countryCount="15+" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};