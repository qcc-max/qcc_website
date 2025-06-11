import { useState, useEffect } from 'react';
import { BookOpen, Star, Award, BookMarked, Sparkles } from 'lucide-react';


// Tally Form Component
const TallyForm = () => (
 <div className="mt-6">
   <iframe
     src="https://tally.so/r/wbAE97"
     width="100%"
     height="738"
     title="Consultation Request Form"
     frameBorder="0"
     marginHeight={0}
     marginWidth={0}
     style={{ border: 'none' }}
   />
 </div>
);


export function BookingPage() {
 const [isHovered, setIsHovered] = useState(false);
 const [isVisible, setIsVisible] = useState(false);
 
 // Setup effect for proper page initialization
 useEffect(() => {
   // Fix for mobile viewport height issues
   const setVh = () => {
     const vh = window.innerHeight * 0.01;
     document.documentElement.style.setProperty('--vh', `${vh}px`);
   };
  
   // Call it on initial load and resize
   setVh();
   window.addEventListener('resize', setVh);
  
   // CRITICAL: Trigger scroll event to update navbar background
   setTimeout(() => {
     window.dispatchEvent(new Event('scroll'));
   }, 100);
  
   // Ensure scrolling is enabled
   document.body.style.overflow = 'auto';
   document.documentElement.style.overflow = 'auto';
   
   // Show component with slight delay for animation
   const timer = setTimeout(() => setIsVisible(true), 100);
   
   return () => {
     window.removeEventListener('resize', setVh);
     clearTimeout(timer);
   };
 }, []);


 return (
   // Add adequate padding at the top to account for the navbar height
   <section className="py-20 px-6 bg-gray-50 w-full min-h-screen pt-20 relative overflow-hidden" 
     style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
   >
     {/* Light mode background elements */}
     <div
       className="absolute top-[15%] right-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '15s' }}
     ></div>

     <div
       className="absolute top-[-30%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '22s' }}
     ></div>

     <div
       className="absolute bottom-[15%] left-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '22s' }}
     ></div>

     {/* Enhanced floating elements with more variety */}
     <div className="absolute top-1/4 left-[10%] animate-float-slow opacity-20">
       <BookOpen size={60} className="text-blue-600" />
     </div>
     <div className="absolute top-1/3 right-[15%] animate-float-medium opacity-20">
       <Star size={40} className="text-amber-600" />
     </div>
     <div className="absolute bottom-1/4 left-[20%] animate-float opacity-20">
       <Award size={50} className="text-blue-600" />
     </div>
     <div className="absolute bottom-1/3 right-[20%] animate-float-slow opacity-20">
       <BookMarked size={45} className="text-amber-600" />
     </div>
     <br></br>

     {/* Scrollable content c
     ontainer */}
     <div 
       className="relative z-10 w-full pb-12 px-4 max-w-5xl mx-auto"
       style={{
         opacity: isVisible ? 1 : 0,
         transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
         transition: 'opacity 0.8s ease, transform 0.8s ease'
       }}
     >
       {/* Page title */}
       <div className="flex items-center justify-center mb-16">
         <div className="relative">
           <h2 className="text-4xl font-medium text-gray-800 text-center">
             book a <span className="font-['PT_Serif',serif] italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">meeting</span>
           </h2>
          
           {/* Enhanced animated element */}
           <span
             className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic"
             style={{
               animation: 'rotate-and-scale 5s infinite ease-in-out'
             }}
           >
             ✦
           </span>
         </div>
       </div>

       {/* Main content card */}
       <div
         className="max-w-3xl mx-auto rounded-[48px] p-2.5 bg-gradient-to-br from-blue-100 via-blue-50 to-amber-50 backdrop-blur-sm shadow-lg"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         style={{
           transform: isHovered ? 'scale(1.02)' : 'scale(1)',
           transition: 'transform 0.3s ease'
         }}
       >
         <div className="relative bg-white rounded-[38px] p-8 md:p-12 shadow-xl border border-blue-200 overflow-hidden">
           {/* Animated background glow effect */}
           <div className="absolute inset-0 opacity-40">
             <div
               className={`absolute w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl ${isHovered ? 'animate-pulse-fast' : 'animate-pulse'}`}
               style={{ top: '20%', left: '10%' }}
             ></div>
             <div
               className={`absolute w-1/3 h-1/3 bg-amber-100 rounded-full blur-3xl ${isHovered ? 'animate-pulse-fast' : 'animate-pulse'}`}
               style={{ bottom: '20%', right: '15%' }}
             ></div>
           </div>
          
           <div className="relative z-10">
             {/* Intro text */}
             <div>
               <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                 <span
                   className="text-amber-500 relative inline-block mr-2 cursor-default"
                 >
                   ✦
                 </span>
                 Schedule a free consultation with our admissions experts to discuss your college application journey. Our mentors from top universities will help craft your path to success.
               </p>
             </div>
            
             {/* Tally Form */}
             <div
               className="mt-8 p-6 rounded-3xl bg-blue-50 border border-blue-200"
             >
               <TallyForm />
             </div>
            
             {/* Benefits section */}
             <div
               className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
             >
               {[
                 { title: "Expert Guidance", desc: "Get advice from mentors at Ivy League & top universities" },
                 { title: "Personalized Strategy", desc: "Develop a unique roadmap for your college applications" },
                 { title: "Application Review", desc: "Get feedback on your essays and overall application" },
                 { title: "Program Matching", desc: "Find the best universities for your unique profile" }
               ].map((item, index) => (
                 <div
                   key={index}
                   className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300"
                 >
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                     <span
                       className="text-amber-500 text-sm"
                     >
                       ✦
                     </span>
                   </div>
                   <div>
                     <h4 className="text-gray-800 font-medium">{item.title}</h4>
                     <p className="text-gray-600 text-sm">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
      
       {/* Call to action section - matches ContactCard style */}
       <div className="mt-10 pt-8 flex justify-center">
         <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-amber-50 hover:from-blue-100 hover:to-amber-100 transition-colors duration-300 group cursor-pointer">
           <Sparkles size={16} className="text-amber-600 animate-pulse" />
           <p className="text-gray-700 font-medium">
             Let's craft your path to academic excellence together!
           </p>
         </div>
       </div>
      
       {/* Enhanced bottom accent decoration - matching ContactCard */}
       <div className="mt-16 w-full flex justify-center gap-2 text-sm">
         {['✦', 'start', 'your', 'journey', 'today', '✦'].map((word, index) => (
           <span
             key={index}
             className="opacity-70 text-gray-600 cursor-default hover:opacity-100 hover:text-amber-600 hover:scale-110 hover:-translate-y-1 transition duration-300"
             style={{
               transformOrigin: 'center',
               transform: 'translateY(0) rotate(0)',
               display: 'inline-block'
             }}
           >
             {word}
           </span>
         ))}
       </div>
     </div>
    
     {/* CSS for animations and fixes */}
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
        
         @keyframes rotate-and-scale {
           0%, 100% { transform: rotate(0deg) scale(1); }
           25% { transform: rotate(15deg) scale(1.2); }
           50% { transform: rotate(0deg) scale(1); }
           75% { transform: rotate(-15deg) scale(1.2); }
         }
        
         @keyframes ping-slow {
           0%, 100% { transform: scale(0); opacity: 0; }
           50% { transform: scale(1); opacity: 0.8; }
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
        
         .animate-ping-slow {
           animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
         }

         /* Fix for iOS browser address bar resizing issues */
         html, body {
           height: 100%;
           overscroll-behavior: none;
           margin: 0;
           padding: 0;
           overflow-x: hidden;
         }
        
         /* Make sure content is scrollable */
         body {
           overflow-y: auto !important;
         }
       `}
     </style>
   </section>
 );
}


export default BookingPage;