import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { GraduationCap, Users } from 'lucide-react';
import { useRef } from 'react';
import DottedMap from 'dotted-map';

// WorldMap Component
type DotConnection = {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
};

const WorldMap = ({
  dots = [],
  lineColor = "#0ea5e9",
  dotColor = "#374151", // New prop for dot color
  dotOpacity = 0.4, // New prop for dot opacity
}: {
  dots?: DotConnection[];
  lineColor?: string;
  dotColor?: string;
  dotOpacity?: number;
}) => {
  const svgRef = useRef(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  // Set background to transparent and customize dot appearance
  const svgMap = map.getSVG({
    radius: 0.22,
    color: dotColor, // Use the customizable dot color
    shape: "circle",
    backgroundColor: "transparent", // Make background transparent!
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] relative font-sans">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className={`h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none`}
        style={{ opacity: dotOpacity }} // Apply custom opacity
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const HeroCard = ({
  studentCount = '2.4k+',
  countryCount = '120+'
}) => {
  const navigate = useNavigate();

  // Connection dots data for the new map
  const connectionDots = [
    {
      start: {
        lat: 64.2008,
        lng: -149.4937,
      }, // Alaska (Fairbanks)
      end: {
        lat: 34.0522,
        lng: -118.2437,
      }, // Los Angeles
    },
    {
      start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
      end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
    },
    {
      start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
      end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
    },
    {
      start: { lat: 51.5074, lng: -0.1278 }, // London
      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
    },
    {
      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
    },
    {
      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
      end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    },
  ];

  return (
    <section id="home" className="min-h-screen w-screen h-screen pt-20 pb-12 px-0 bg-gray-50 relative overflow-hidden">
      {/* Animated background accents */}
      <div
        className="absolute top-[250%] right-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      
      <div
        className="absolute top-[38%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '22s' }}
      />
      
      <div
        className="absolute bottom-[10%] left-[-10%] w-3/4 h-1/3 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '22s' }}
      />

      <div
        className="absolute top-[-20%] right-[-20%] w-3/4 h-3/4 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      
      <div
        className="absolute bottom-[20%] left-[-10%] w-3/5 h-2/5 bg-amber-400/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '20s' }}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <br />
          <br />
          <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-2">
            From applications to acceptances: <span className="font-['PT_Serif',serif] italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent relative">
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

          <br />
          <p className="text-lg md:text-xl text-gray-600">
            Supporting students from <span className="text-amber-500 relative inline-block hover:rotate-3 transition-all cursor-default">
              every corner
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500/30"></span>
            </span> of the world
          </p>
        </motion.div>

        {/* Buttons with reduced spacing */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mt-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Button
            onClick={() => navigate('/book')}
            className="h-10 px-6 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[32px] text-base hover:shadow-lg hover:shadow-blue-300/20 hover:-translate-y-1 transition-all duration-300"
          >
            Start Your Journey
          </Button>
        
          <Button
            onClick={() => navigate('/book')}
            variant="outline"
            className="h-10 px-6 py-2 text-blue-600 border-blue-300 rounded-[32px] text-base hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-1 transition-all duration-300"
          >
            Book Free Meeting
          </Button>
        </motion.div>

        {/* Quirky element with reduced spacing */}
        <motion.div
          className="mt-8 w-full flex justify-center gap-2 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <span className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default">✦</span>
          <span className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default">your</span>
          <span className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default">path</span>
          <span className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default">to</span>
          <span className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default">success</span>
          <span className="opacity-70 hover:opacity-100 hover:text-amber-500 hover:-translate-y-1 hover:rotate-3 transition-all cursor-default">✦</span>
        </motion.div>

        <br />
        <br />

        {/* New World Map Visualization */}
        <motion.div
          className="mt-10 w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] max-w-[1000px] mx-auto flex flex-col items-center">
            {/* Text labels - NOW PROPERLY CENTERED */}
            <div className="w-full flex justify-center mb-4 z-10">
              <h3 className="text-gray-800 text-base font-medium flex items-center gap-2">
                <GraduationCap size={18} className="text-amber-500" />
                Our Global Student Network
              </h3>
            </div>

            {/* New WorldMap Component */}
            <div className="w-full h-full relative">
              <WorldMap
                dots={connectionDots}
                lineColor="#3B82F6"
              />

              {/* Stats card - NOW RESPONSIVE AND PROPERLY POSITIONED */}
              <motion.div
                className="absolute bg-white/70 backdrop-blur-md rounded-lg shadow-sm flex items-center gap-2 sm:gap-3 z-20
                           p-2 sm:p-3 text-xs sm:text-sm
                           right-[8%] bottom-[15%] sm:right-[12%] sm:bottom-[20%] 
                           md:right-[15%] md:bottom-[25%] lg:right-[20%] lg:bottom-[30%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="flex flex-col items-center">
                  <Users size={14} className="text-blue-500 sm:w-4 sm:h-4" />
                  <span className="text-gray-800 font-medium">{studentCount || '2.4k+'}</span>
                  <span className="text-gray-600 text-[10px] sm:text-xs">Students</span>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gray-300"></div>
                <div className="flex flex-col items-center">
                  <GraduationCap size={14} className="text-amber-500 sm:w-4 sm:h-4" />
                  <span className="text-gray-800 font-medium">{countryCount || '120+'}</span>
                  <span className="text-gray-600 text-[10px] sm:text-xs">Countries</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* CSS for animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        
          @keyframes float-slow {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
        
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        
          .animate-fadeIn {
            opacity: 0;
            animation: fadeIn 0.8s forwards;
          }
        `}
      </style>
    </section>
  );
};