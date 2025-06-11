import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
 FileText,
 Edit,
 Award,
 Users,
 Globe,
 Lightbulb,
 PenTool,
 Star,
 BookMarked,
 Briefcase,
} from 'lucide-react';


export const ServicesCard = () => {
 const [activeService, setActiveService] = useState(1);
 const [hoveredService, setHoveredService] = useState<number | null>(null);
 const [screenSize, setScreenSize] = useState('desktop');
 const [isVisible, setIsVisible] = useState(false);
 const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 const sectionRef = useRef<HTMLElement | null>(null);


 // Enhanced mouse movement for spotlight effect
 const handleMouseMove = (e: React.MouseEvent) => {
   if (sectionRef.current) {
     const rect = sectionRef.current.getBoundingClientRect();
     setMousePosition({
       x: e.clientX - rect.left,
       y: e.clientY - rect.top
     });
   }
 };


 // Enhanced responsive detection
 useEffect(() => {
   const updateScreenSize = () => {
     const width = window.innerWidth;
     if (width < 640) {
       setScreenSize('mobile');
     } else if (width < 768) {
       setScreenSize('sm');
     } else if (width < 1024) {
       setScreenSize('tablet');
     } else if (width < 1280) {
       setScreenSize('laptop');
     } else {
       setScreenSize('desktop');
     }
   };


   updateScreenSize();
   window.addEventListener('resize', updateScreenSize);
   return () => window.removeEventListener('resize', updateScreenSize);
 }, []);


 useEffect(() => {
   const timer = setTimeout(() => setIsVisible(true), 200);


   const observer = new IntersectionObserver(
     (entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           setIsVisible(true);
         }
       });
     },
     { threshold: 0.1 }
   );


   if (sectionRef.current) {
     observer.observe(sectionRef.current);
   }


   return () => {
     clearTimeout(timer);
     if (sectionRef.current) {
       observer.unobserve(sectionRef.current);
     }
   };
 }, []);


 const services = [
   {
     id: 1,
     title: "Application Strategy",
     icon: FileText,
     description: "We develop comprehensive strategies to make your application stand out. Our experts create personalized roadmaps tailored to your academic strengths, extracurricular achievements, and career aspirations.",
     color: "blue",
   },
   {
     id: 2,
     title: "Essay Crafting",
     icon: Edit,
     description: "Our mentors from top universities guide you through the art of crafting compelling narratives that captivate admission officers. We help you identify your unique stories and refine your writing style.",
     color: "amber",
   },
   {
     id: 3,
     title: "Interview Preparation",
     icon: Users,
     description: "Master the art of impressive interviews with our comprehensive preparation program. We conduct mock interviews tailored to your target schools' specific formats and questions.",
     color: "blue",
   },
   {
     id: 4,
     title: "Academic Excellence",
     icon: Award,
     description: "Achieve your highest potential with our personalized academic support and test preparation strategies. Our expert tutors develop customized study plans targeting your specific areas for improvement.",
     color: "amber",
   },
   {
     id: 5,
     title: "Portfolio Development",
     icon: Briefcase,
     description: "Stand out with a thoughtfully curated portfolio of meaningful activities. We help you identify and develop extracurricular pursuits that align with your academic interests.",
     color: "blue",
   },
   {
     id: 6,
     title: "International Access",
     icon: Globe,
     description: "Navigate the complex landscape of international university admissions with our specialized guidance. We provide insights into country-specific application requirements and visa processes.",
     color: "amber",
   },
   {
     id: 7,
     title: "Career Planning",
     icon: Lightbulb,
     description: "Discover the academic path that aligns with your strengths and aspirations. Our mentors help you explore various disciplines and understand career trajectories.",
     color: "blue",
   },
 ];


 // Enhanced arc positioning with better scaling and more space for content
 const getPositionOnInvertedUArc = (index: number, total: number) => {
   const screenConfig = {
     desktop: { arcHeight: 1.6, arcWidth: 0.9 },
     laptop: { arcHeight: 1.5, arcWidth: 0.85 },
     tablet: { arcHeight: 1.4, arcWidth: 0.8 },
     sm: { arcHeight: 1.3, arcWidth: 0.75 }
   };
  
   const config = screenConfig[screenSize as keyof typeof screenConfig] || screenConfig.desktop;
   const angleStep = Math.PI / (total - 1);
   const angle = Math.PI - index * angleStep;


   const x = Math.cos(angle) * config.arcWidth;
   const y = Math.sin(angle) * config.arcHeight;


   return { x, y };
 };


 const isMobile = screenSize === 'mobile';


 // Better content positioning in the center of the arc
 const getContentPosition = () => {
   switch (screenSize) {
     case 'desktop':
       return 'top-[35%]';
     case 'laptop':
       return 'top-[35%]';
     case 'tablet':
       return 'top-[40%]';
     case 'sm':
       return 'top-[38%]';
     default:
       return 'top-1/2';
   }
 };


 // Better responsive text sizes - made smaller as requested
 const getResponsiveTextSizes = () => {
   const titleSizes = {
     mobile: 'text-lg',
     sm: 'text-xl',
     tablet: 'text-2xl',
     laptop: 'text-3xl',
     desktop: 'text-3xl'
   };


   const descriptionSizes = {
     mobile: 'text-sm',
     sm: 'text-sm',
     tablet: 'text-base',
     laptop: 'text-base',
     desktop: 'text-base'
   };


   const iconSizes = {
     mobile: 18,
     sm: 20,
     tablet: 24,
     laptop: 28,
     desktop: 32
   };


   const iconContainerSizes = {
     mobile: 'w-10 h-10',
     sm: 'w-12 h-12',
     tablet: 'w-14 h-14',
     laptop: 'w-16 h-16',
     desktop: 'w-18 h-18'
   };


   return {
     title: titleSizes[screenSize as keyof typeof titleSizes] || titleSizes.desktop,
     description: descriptionSizes[screenSize as keyof typeof descriptionSizes] || descriptionSizes.desktop,
     iconSize: iconSizes[screenSize as keyof typeof iconSizes] || iconSizes.desktop,
     iconContainer: iconContainerSizes[screenSize as keyof typeof iconContainerSizes] || iconContainerSizes.desktop
   };
 };


 // Better circle sizes for the numbered buttons
 const getCircleSizes = () => {
   const sizes = {
     mobile: { container: 'w-12 h-12', text: 'text-sm' },
     sm: { container: 'w-14 h-14', text: 'text-base' },
     tablet: { container: 'w-16 h-16', text: 'text-lg' },
     laptop: { container: 'w-20 h-20', text: 'text-xl' },
     desktop: { container: 'w-24 h-24', text: 'text-2xl' }
   };


   return sizes[screenSize as keyof typeof sizes] || sizes.desktop;
 };


 const textSizes = getResponsiveTextSizes();
 const circleSizes = getCircleSizes();


 return (
   <section
     id="services"
     ref={sectionRef}
     className="py-16 lg:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden"
     onMouseMove={handleMouseMove}
   >
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
     {/* Enhanced interactive background */}
     <div
       className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-1000"
       style={{
         background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent)`
       }}
     />


     {/* Background elements */}
     <div className="absolute top-[8%] right-[-6%] w-64 h-64 bg-amber-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '18s' }} />
     <div className="absolute bottom-[8%] left-[-8%] w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '22s' }} />


     {/* Floating elements */}
     {!isMobile && (
       <>
         <div className="absolute top-1/4 left-[6%] animate-float-slow opacity-10">
           <PenTool size={screenSize === 'desktop' ? 50 : 35} className="text-blue-600" />
         </div>
         <div className="absolute top-1/3 right-[8%] animate-float-medium opacity-10">
           <Star size={screenSize === 'desktop' ? 35 : 25} className="text-amber-600" />
         </div>
         <div className="absolute bottom-1/4 left-[12%] animate-float opacity-10">
           <Award size={screenSize === 'desktop' ? 40 : 30} className="text-blue-600" />
         </div>
         <div className="absolute bottom-1/3 right-[10%] animate-float-slow opacity-10">
           <BookMarked size={screenSize === 'desktop' ? 35 : 28} className="text-amber-600" />
         </div>
       </>
     )}


     <div className="max-w-7xl mx-auto relative z-10">
       {/* Header - Updated to match impact card styling */}
       <motion.div
         className="flex items-center justify-center mb-16"
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.7 }}
         viewport={{ once: true }}
       >
         <div className="relative">
           <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
             our<span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">services</span>
           </h2>
         
           {/* Animated star */}
           <motion.span
             className="absolute -right-8 -top-1 text-xl text-amber-500 not-italic"
             animate={{
               rotate: [0, 15, 0, -15, 0],
               scale: [1, 1.2, 1, 1.2, 1]
             }}
             transition={{
               duration: 5,
               repeat: Infinity,
               ease: "easeInOut"
             }}
           >✦
           </motion.span>
         </div>
       </motion.div>


       {/* Main display area with better spacing */}
       <div className={`relative max-w-6xl mx-auto ${isMobile ? 'flex flex-col' : 'min-h-[700px]'}`}>
        
         {/* Service content display - positioned in center of arc */}
         <div className={`${
           isMobile
             ? 'order-1 mb-8'
             : `absolute w-full max-w-2xl z-20 ${getContentPosition()} left-1/2 transform -translate-x-1/2 -translate-y-1/2`
         }`}>
           <div className="mx-auto px-4">
             {services.map(service => {
               if (service.id === activeService) {
                 const ServiceIcon = service.icon;
                 return (
                   <div
                     key={service.id}
                     className="text-center space-y-4 lg:space-y-5"
                     style={{
                       opacity: isVisible ? 1 : 0,
                       transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                       transition: 'opacity 0.6s ease, transform 0.6s ease'
                     }}
                   >
                     {/* Icon */}
                     <div
                       className={`
                         ${textSizes.iconContainer} rounded-full mx-auto flex items-center justify-center shadow-md backdrop-blur-sm
                         ${service.color === 'blue'
                           ? 'bg-blue-50/80 border border-blue-100/50'
                           : 'bg-amber-50/80 border border-amber-100/50'
                         }
                       `}
                       style={{
                         transform: hoveredService === service.id ? 'scale(1.05)' : 'scale(1)',
                         transition: 'all 0.4s ease'
                       }}
                     >
                       <ServiceIcon
                         size={textSizes.iconSize}
                         className={`${service.color === 'blue' ? 'text-blue-600' : 'text-amber-600'}`}
                       />
                     </div>


                     {/* Title - made smaller */}
                     <h3 className={`${textSizes.title} font-medium text-gray-800 tracking-tight leading-tight`}>
                       {service.title}
                     </h3>


                     {/* Description - made smaller */}
                     <div className="max-w-xl mx-auto">
                       <p className={`text-gray-700 leading-relaxed ${textSizes.description} font-light tracking-wide`}>
                         {service.description}
                       </p>
                     </div>


                     {/* Accent */}
                     <div className="flex items-center justify-center gap-1.5">
                       <div className={`w-6 h-0.5 rounded-full ${service.color === 'blue' ? 'bg-blue-500/40' : 'bg-amber-500/40'}`} />
                       <div className={`w-1.5 h-1.5 rounded-full ${service.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                       <div className={`w-6 h-0.5 rounded-full ${service.color === 'blue' ? 'bg-blue-500/40' : 'bg-amber-500/40'}`} />
                     </div>
                   </div>
                 );
               }
               return null;
             })}
           </div>
         </div>


         {/* Service selection */}
         <div className={`${isMobile ? 'order-2' : 'relative w-full h-[700px]'}`}>
           {isMobile ? (
             // Mobile layout
             <div className="flex gap-4 pb-4 overflow-x-auto px-4 scrollbar-hide">
               {services.map((service, index) => (
                 <div
                   key={service.id}
                   className="flex-shrink-0 cursor-pointer transition-all duration-400 ease-out flex flex-col items-center group"
                   style={{
                     opacity: isVisible ? 1 : 0,
                     animationDelay: `${0.1 * index}s`,
                     animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                   }}
                   onClick={() => setActiveService(service.id)}
                   onMouseEnter={() => setHoveredService(service.id)}
                   onMouseLeave={() => setHoveredService(null)}
                 >
                   <div
                     className={`
                       relative ${circleSizes.container} rounded-full flex items-center justify-center overflow-hidden shadow-md backdrop-blur-sm
                       ${activeService === service.id
                         ? service.color === 'blue'
                           ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25'
                           : 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/25'
                         : 'bg-white/90 border border-gray-200/60 group-hover:border-gray-300/80'}
                       transition-all duration-400 ease-out
                     `}
                     style={{
                       transform: hoveredService === service.id ? 'scale(1.05) translateY(-1px)' : 'scale(1) translateY(0)'
                     }}
                   >
                     <div
                       className={`
                         ${circleSizes.text} font-bold relative
                         ${activeService === service.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}
                       `}
                     >
                       {String(service.id).padStart(2, '0')}
                     </div>
                   </div>


                   <div
                     className={`
                       w-16 text-center text-xs font-medium tracking-wide mt-2
                       ${activeService === service.id
                         ? service.color === 'blue'
                           ? 'text-blue-600'
                           : 'text-amber-600'
                         : 'text-gray-600 group-hover:text-gray-800'}
                       transition-all duration-300
                     `}
                   >
                     {service.title}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             // Desktop arc layout with bigger circles
             <>
               {services.map((service, index) => {
                 const position = getPositionOnInvertedUArc(index, services.length);
                 const leftPercent = ((position.x + 1) / 2) * 100;
                 const topPercent = (((position.y) / 2) * 100) + 10;


                 return (
                   <div
                     key={service.id}
                     className="absolute cursor-pointer transition-all duration-400 ease-out group"
                     style={{
                       left: `${leftPercent}%`,
                       top: `${topPercent}%`,
                       transform: 'translate(-50%, -50%)',
                       opacity: isVisible ? 1 : 0,
                       animationDelay: `${0.1 * index}s`,
                       animation: isVisible ? 'fadeInScale 0.6s ease-out forwards' : 'none'
                     }}
                     onClick={() => setActiveService(service.id)}
                     onMouseEnter={() => setHoveredService(service.id)}
                     onMouseLeave={() => setHoveredService(null)}
                   >
                     <div
                       className={`
                         relative ${circleSizes.container} rounded-full flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-sm
                         ${activeService === service.id
                           ? service.color === 'blue'
                             ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30'
                             : 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30'
                           : 'bg-white/95 border border-gray-200/70 group-hover:border-gray-300/90 group-hover:shadow-md'}
                         transition-all duration-400 ease-out
                       `}
                       style={{
                         transform: hoveredService === service.id
                           ? 'scale(1.1) translateY(-2px)'
                           : activeService === service.id
                             ? 'scale(1.05)'
                             : 'scale(1) translateY(0)'
                       }}
                     >
                       <div className="relative">
                         <div
                           className={`
                             ${circleSizes.text} font-bold relative
                             ${activeService === service.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}
                           `}
                         >
                           {String(service.id).padStart(2, '0')}
                         </div>
                       </div>
                     </div>


                     <div
                       className={`
                         absolute w-32 top-full left-1/2 transform -translate-x-1/2 mt-4
                         text-center font-medium tracking-wide text-sm
                         ${activeService === service.id
                           ? service.color === 'blue'
                             ? 'text-blue-600'
                             : 'text-amber-600'
                           : 'text-gray-600 group-hover:text-gray-800'}
                         transition-all duration-300
                       `}
                       style={{
                         opacity: hoveredService === service.id || activeService === service.id ? 1 : 0.7,
                         transform: `translate(-50%, ${hoveredService === service.id || activeService === service.id ? '0' : '-2px'})`
                       }}
                     >
                       {service.title}
                     </div>
                   </div>
                 );
               })}
             </>
           )}
         </div>
       </div>
     </div>


     {/* CSS animations */}
     <style>{`
       .scrollbar-hide {
         -ms-overflow-style: none;
         scrollbar-width: none;
       }
       .scrollbar-hide::-webkit-scrollbar {
         display: none;
       }


       .w-18 { width: 4.5rem; }
       .h-18 { height: 4.5rem; }


       @keyframes float {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-8px) rotate(1deg); }
       }


       @keyframes float-medium {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-6px) rotate(-2deg); }
       }


       @keyframes float-slow {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-10px) rotate(1deg); }
       }


       @keyframes fadeInScale {
         from {
           opacity: 0;
           transform: translateY(15px) scale(0.9) translate(-50%, -50%);
         }
         to {
           opacity: 1;
           transform: translateY(0) scale(1) translate(-50%, -50%);
         }
       }


       @keyframes fadeInUp {
         from {
           opacity: 0;
           transform: translateY(15px);
         }
         to {
           opacity: 1;
           transform: translateY(0);
         }
       }


       .animate-float {
         animation: float 6s ease-in-out infinite;
       }

       .animate-float-medium {
         animation: float-medium 8s ease-in-out infinite;
       }


       .animate-float-slow {
         animation: float-slow 10s ease-in-out infinite;
       }
     `}</style>
   </section>
 );
};