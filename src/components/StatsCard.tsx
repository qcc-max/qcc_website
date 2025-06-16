import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Star, Users, TrendingUp } from 'lucide-react';
import _ from 'lodash';


export default function StatsCard() {
 const [allStatsActive, setAllStatsActive] = useState(false);
 const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
 const sectionRef = useRef<HTMLElement | null>(null);


 // Track window size for responsive positions
 useEffect(() => {
   const handleResize = _.throttle(() => {
     setWindowWidth(window.innerWidth);
   }, 200);
  
   window.addEventListener('resize', handleResize);
   handleResize(); // Initial check
  
   return () => {
     window.removeEventListener('resize', handleResize);
     handleResize.cancel();
   };
 }, []);


 // Track scroll position without re-rendering the entire component
 useEffect(() => {
   // Create a ref to store scroll state to minimize re-renders
   const scrollRef = {
     statsActive: false
   };
  
   const handleScroll = _.throttle(() => {
     if (!sectionRef.current) return;
    
     const rect = sectionRef.current.getBoundingClientRect();
     const windowHeight = window.innerHeight;
    
     // Calculate trigger point - only update once when crossing threshold
     if (rect.top < windowHeight * 0.2 && !scrollRef.statsActive) {
       scrollRef.statsActive = true;
       setAllStatsActive(true);
     } else if (rect.top > windowHeight * 0.8 && scrollRef.statsActive) {
       scrollRef.statsActive = false;
       setAllStatsActive(false);
     }
   }, 200);
  
   window.addEventListener('scroll', handleScroll);
   handleScroll(); // Initial check
  
   return () => {
     window.removeEventListener('scroll', handleScroll);
     handleScroll.cancel();
   };
 }, []);


 interface Position {
   x: number;
   y: number;
 }


 // Function to calculate responsive positions based on screen width
 const getResponsivePosition = (defaultPosition: Position, statIndex: number) => {
   // Custom positions for each circle on small screens
   const smallScreenPositions = [
     { x: -75, y: defaultPosition.y },  // Award
     { x: 75, y: defaultPosition.y },   // GraduationCap
     { x: -130, y: defaultPosition.y }, // Users
     { x: 130, y: defaultPosition.y },  // TrendingUp
     { x: -75, y: defaultPosition.y },  // Star
     { x: 75, y: defaultPosition.y }    // BookOpen
   ];
  
   // Custom positions for medium screens
   const mediumScreenPositions = [
     { x: -110, y: defaultPosition.y }, // Award
     { x: 110, y: defaultPosition.y },  // GraduationCap
     { x: -200, y: defaultPosition.y }, // Users
     { x: 200, y: defaultPosition.y },  // TrendingUp
     { x: -110, y: defaultPosition.y }, // Star
     { x: 110, y: defaultPosition.y }   // BookOpen
   ];
  


   
   if (windowWidth < 550) { // Small mobile screens
     return smallScreenPositions[statIndex];
   } else if (windowWidth < 800) { // Larger mobile screens
     return mediumScreenPositions[statIndex];
   } else {
     // Default positions for larger screens
     return defaultPosition;
   }
 };


 // Stats data with coordinates for final positions in a more spread out hexagon arrangement
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


 // Create a completely isolated component for particles
 // This prevents re-rendering when parent state changes
 const ParticleSystem = React.memo(() => {
   // This component will never re-render once mounted
   return (
     <>
       <CoreParticles />
       <AmbientParticles />
     </>
   );
 });


 // Core particles component - completely isolated from scroll state
 const CoreParticles = React.memo(() => {
   const generateParticles = () => {
     const particleCount = 60;
     const particles = [];
    
     for (let i = 0; i < particleCount; i++) {
       const size = Math.random() * 3 + 1;
       const angle = Math.random() * Math.PI * 2;
       const radius = Math.random() * 60 + 10;
      
       const initialX = Math.cos(angle) * radius;
       const initialY = Math.sin(angle) * radius;
      
       const speed = Math.random() * 6 + 4;
       const opacity = Math.random() * 0.7 + 0.3;
       const hue = Math.random() > 0.5 ? "amber" : "blue";
      
       particles.push(
         <motion.div
           key={`core-particle-${i}`}
           className={`absolute rounded-full ${hue === 'amber' ? 'bg-amber-600' : 'bg-blue-600'}`}
           style={{
             width: size,
             height: size,
             opacity: opacity,
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
             repeatDelay: 0
           }}
         />
       );
     }
    
     return particles;
   };
  
   // Generate particles on mount and never update them
   const particles = useMemo(() => generateParticles(), []);
  
   return <>{particles}</>;
 });


 // Ambient particles component - completely isolated from scroll state
 const AmbientParticles = React.memo(() => {
   const generateParticles = () => {
     const particleCount = 500;
     const particles = [];
    
     for (let i = 0; i < particleCount; i++) {
       const size = Math.random() * 2.5 + 0.5;
       const initialX = (Math.random() - 0.5) * 1000;
       const initialY = (Math.random() - 0.5) * 500;
      
       const duration = Math.random() * 12 + 8;
       const delay = Math.random() * 5;
       const opacity = Math.random() * 0.5 + 0.1;
       const hue = Math.random() > 0.5 ? "amber" : "blue";
      
       particles.push(
         <motion.div
           key={`ambient-particle-${i}`}
           className={`absolute rounded-full ${hue === 'amber' ? 'bg-amber-600' : 'bg-blue-600'}`}
           style={{
             width: size,
             height: size,
             opacity: opacity,
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
             duration: duration,
             repeat: Infinity,
             ease: "easeInOut",
             delay: delay,
             times: [0, 0.33, 0.66, 1],
             repeatType: "loop",
             repeatDelay: 0
           }}
         />
       );
     }
    
     return particles;
   };
  
   // Generate particles on mount and never update them
   const particles = useMemo(() => generateParticles(), []);
  
   return <>{particles}</>;
 });


 // Use useMemo and useCallback to prevent recreating functions
 // that would trigger re-renders of our smooth animations
 const generateRevolvingStars = useMemo(() => {
   return stats.map((stat, index) => {
     // Calculate initial position for revolving motion
     const angleOffset = (index / stats.length) * 2 * Math.PI;
     const responsivePosition = getResponsivePosition(stat.finalPosition, index);
    
     return (
       <motion.div
         key={`star-${index}`}
         className={`absolute rounded-full flex items-center justify-center`}
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
           // When active, move to final position
           // Otherwise, revolve around center
           x: allStatsActive
             ? responsivePosition.x
             : [
                 Math.cos(angleOffset) * 100,
                 Math.cos(angleOffset + Math.PI/6) * 100,
                 Math.cos(angleOffset + Math.PI/3) * 100,
                 Math.cos(angleOffset + Math.PI/2) * 100,
                 Math.cos(angleOffset + 2*Math.PI/3) * 100,
                 Math.cos(angleOffset + 5*Math.PI/6) * 100,
                 Math.cos(angleOffset + Math.PI) * 100,
                 Math.cos(angleOffset + 7*Math.PI/6) * 100,
                 Math.cos(angleOffset + 4*Math.PI/3) * 100,
                 Math.cos(angleOffset + 3*Math.PI/2) * 100,
                 Math.cos(angleOffset + 5*Math.PI/3) * 100,
                 Math.cos(angleOffset + 11*Math.PI/6) * 100,
                 Math.cos(angleOffset + 2*Math.PI) * 100,
               ],
           y: allStatsActive
             ? responsivePosition.y
             : [
                 Math.sin(angleOffset) * 100,
                 Math.sin(angleOffset + Math.PI/6) * 100,
                 Math.sin(angleOffset + Math.PI/3) * 100,
                 Math.sin(angleOffset + Math.PI/2) * 100,
                 Math.sin(angleOffset + 2*Math.PI/3) * 100,
                 Math.sin(angleOffset + 5*Math.PI/6) * 100,
                 Math.sin(angleOffset + Math.PI) * 100,
                 Math.sin(angleOffset + 7*Math.PI/6) * 100,
                 Math.sin(angleOffset + 4*Math.PI/3) * 100,
                 Math.sin(angleOffset + 3*Math.PI/2) * 100,
                 Math.sin(angleOffset + 5*Math.PI/3) * 100,
                 Math.sin(angleOffset + 11*Math.PI/6) * 100,
                 Math.sin(angleOffset + 2*Math.PI) * 100,
               ],
           scale: allStatsActive ? 0 : 1,
           opacity: allStatsActive ? 0 : 1,
         }}
         transition={
           allStatsActive
             ? {
                 duration: 1,
                 ease: "easeOut",
               }
             : {
                 duration: 20,
                 repeat: Infinity,
                 ease: "linear",
                 repeatType: "loop",
               }
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
 }, [allStatsActive, stats, windowWidth]); // Added windowWidth dependency


 // Burst particles when stats appear
 const BurstParticles = React.memo(({ active }: { active: boolean }) => {
   // Only generate and render burst particles when active
   // and don't re-generate them on re-renders
   const bursts = useMemo(() => {
     if (!active) return [];
    
     const burstParticles: React.ReactNode[] = [];
    
     stats.forEach((stat, statIndex) => {
       const responsivePosition = getResponsivePosition(stat.finalPosition, statIndex);
      
       for (let i = 0; i < 20; i++) {
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
               duration: duration,
               ease: "easeOut",
               delay: delay,
             }}
           />
         );
       }
     });
    
     return burstParticles;
   }, [active, windowWidth]); // Added windowWidth dependency
  
   return <>{bursts}</>;
 });


 // Stats content that appears
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


 // Core energy visualization - isolated to prevent re-renders
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
     >
       {/* Core glow */}
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
      
       {/* Additional ring for better core visibility */}
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
      
       {/* Central energy core */}
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
   );
 });


 return (
   <section
     id="impact"
     ref={sectionRef}
     className="py-24 px-6 bg-stone-100 relative overflow-hidden"
   >
     {/* Background light elements */}
     <div
       className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '15s' }}
     ></div>
     <div
       className="absolute top-[150%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '22s' }}
     ></div>
     <div
       className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '22s' }}
     ></div>


     {/* Section heading */}
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
          
           {/* Animated star */}
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


       {/* Main animated visualization area */}
       <motion.div
         className="max-w-4xl mx-auto rounded-[48px]"
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.7, delay: 0.2 }}
         viewport={{ once: true }}
   
       >
         <div className="relative h-[32rem] flex items-center justify-center">
           {/* Particle system - completely independent of scroll state */}
           <ParticleSystem />
          
           {/* Core energy visualization */}
           <CoreEnergy />
          
           {/* Revolving stars */}
           {generateRevolvingStars}
          
           {/* Burst particles when stars transform */}
           <BurstParticles active={allStatsActive} />
          
           {/* Stats content that appears */}
           <StatsContent active={allStatsActive} />
          
          
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
    
     {/* Enhanced CSS for animations */}
     <style>
       {`
         @keyframes float {
           0% { transform: translateY(0px); }
           50% { transform: translateY(-15px); }
           100% { transform: translateY(0px); }
         }
       
         @keyframes float-medium {
           0% { transform: translateY(0px) rotate(0deg); }
           50% { transform: translateY(-12px) rotate(10deg); }
           100% { transform: translateY(0px) rotate(0deg); }
         }
       
         @keyframes float-slow {
           0% { transform: translateY(0px) rotate(0deg); }
           50% { transform: translateY(-20px) rotate(5deg); }
           100% { transform: translateY(0px) rotate(0deg); }
         }
       
         @keyframes pulse-fast {
           0%, 100% { opacity: 0.3; transform: scale(1); }
           50% { opacity: 0.5; transform: scale(1.1); }
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