import { useState, useEffect } from 'react';
import {
 Mail,
 Phone,
 Instagram,
 Sparkles,
 ExternalLink,
 BookOpen,
 Star,
 Award,
 BookMarked,
 MessageCircle,
 Youtube
} from 'lucide-react';
import { motion } from 'framer-motion';


export const ContactCard = () => {
 const [activeItem, setActiveItem] = useState<string | null>(null);
 const [isVisible, setIsVisible] = useState(false);
 const [isHovered, setIsHovered] = useState(false);


 useEffect(() => {
   // Show component with slight delay for animation
   const timer = setTimeout(() => setIsVisible(true), 100);
   return () => clearTimeout(timer);
 }, []);


 const contactInfo = [
   {
     icon: <Mail className="w-5 h-5" />,
     text: "qcatalancounselling@gmail.com",
     href: "mailto:qcatalancounselling@gmail.com",
     color: "text-blue-600",
     bgColor: "bg-blue-100",
     hoverColor: "group-hover:text-blue-700",
     sparkleColor: "#2563eb" // blue-600
   },
   {
     icon: <Phone className="w-5 h-5" />,
     text: "+92 309 6598984",
     href: "tel:+923096598984",
     color: "text-amber-600",
     bgColor: "bg-amber-100",
     hoverColor: "group-hover:text-amber-700",
     sparkleColor: "#d97706" // amber-600
   },
   {
     icon: <Phone className="w-5 h-5" />,
     text: "+92 306 6633330",
     href: "tel:+923028082222",
     color: "text-blue-600",
     bgColor: "bg-blue-100",
     hoverColor: "group-hover:text-blue-700",
     sparkleColor: "#2563eb" // blue-600
   },
  
 ];


 const socialLinks = [
   {
     icon: <Instagram className="w-5 h-5" />,
     label: "Instagram",
     href: "https://www.instagram.com/qcc.intl?igsh=MTk3eWpnM2dyYzFvdg%3D%3D&utm_source=qr",
     color: "text-amber-600",
     bgColor: "bg-amber-100",
     hoverColor: "group-hover:text-amber-700",
     sparkleColor: "#d97706", // amber-600
     actionText: "Follow us on"
   },
   {
     icon: <Youtube className="w-5 h-5" />,
     label: "Youtube Channel",
     href: "https://youtube.com/@qcatalancounselling?si=Wj0THIOACspSgpBt",
     color: "text-blue-600",
     bgColor: "bg-blue-100",
     hoverColor: "group-hover:text-blue-700",
     sparkleColor: "#2563eb", // blue-600
     actionText: "Subscribe to our"
   },
   {
 icon: <MessageCircle className="w-5 h-5" />,
 label: "Whatsapp Community",
 href: "https://chat.whatsapp.com/JZYKmlYhHYEELi8Ocrzhf0", 
 color: "text-amber-600",
 bgColor: "bg-amber-100",
 hoverColor: "group-hover:text-amber-700",
 sparkleColor: "#d97706", // amber-600
 actionText: "Join our"
}


 ];


 // Function to render sparkles
 const renderSparkles = (color: string) => {
   return (
     <div className="absolute -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
       {[...Array(3)].map((_, i) => (
         <div
           key={i}
           className="absolute w-1 h-1 rounded-full animate-ping-slow"
           style={{
             backgroundColor: color,
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 2}s`,
             animationDuration: `${2 + Math.random() * 3}s`
           }}
         />
       ))}
     </div>
   );
 };


 return (
   <section
     id="contact"
     className="py-20 px-6 bg-stone-100 relative overflow-hidden"
   >
     {/* Light mode background elements */}
     <div
       className="absolute top-[15%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '15s' }}
     ></div>


     <div
       className="absolute top-[15%] left-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
       style={{ animationDuration: '22s' }}
     ></div>


     <div
       className="absolute bottom-[15%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
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


     {/* Main container with spotlight effect */}
     <div
       className="max-w-5xl mx-auto relative z-10"
       style={{
         opacity: isVisible ? 1 : 0,
         transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
         transition: 'opacity 0.8s ease, transform 0.8s ease'
       }}
     >
       {/* Header section with animation - UPDATED TO MATCH IMPACT CARD */}
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
               get in<span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">touch</span>
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
       </div>


       {/* Contact card with matching style to About card */}
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


           {/* Content grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
             {/* Left column - contact info */}
             <div>
               <div className="flex items-center gap-3 mb-6">
                 <span className="text-blue-600 text-2xl animate-pulse">•</span>
                 <h3 className="text-xl font-medium text-gray-800">Contact Details</h3>
               </div>


               <div className="space-y-5">
                 {contactInfo.map((item, index) => (
                   <a
                     key={index}
                     href={item.href}
                     className={`group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                       activeItem === `contact-${index}` ? 'bg-gray-100' : 'hover:bg-gray-50'
                     }`}
                     onMouseEnter={() => setActiveItem(`contact-${index}`)}
                     onMouseLeave={() => setActiveItem(null)}
                   >
                     {renderSparkles(item.sparkleColor)}
                    
                     <div className={`flex-shrink-0 w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                       <span className={`${item.color} ${item.hoverColor} transition-colors duration-300`}>{item.icon}</span>
                     </div>
                    
                     <div className="flex flex-col">
                       <span className="text-sm text-gray-500 mb-0.5">
                         {index === 0 ? 'Email' : 'Phone'}
                       </span>
                       <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                         {item.text}
                       </span>
                     </div>
                    
                     <ExternalLink
                       size={14}
                       className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     />
                   </a>
                 ))}
               </div>
             </div>


             {/* Right column - social links */}
             <div>
               <div className="flex items-center gap-3 mb-6">
                 <span className="text-amber-600 text-2xl animate-pulse" style={{animationDelay: '0.5s'}}>•</span>
                 <h3 className="text-xl font-medium text-gray-800">Connect Online</h3>
               </div>


               <div className="space-y-5">
                 {socialLinks.map((item, index) => (
                   <a
                     key={index}
                     href={item.href}
                     className={`group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                       activeItem === `social-${index}` ? 'bg-gray-100' : 'hover:bg-gray-50'
                     }`}
                     onMouseEnter={() => setActiveItem(`social-${index}`)}
                     onMouseLeave={() => setActiveItem(null)}
                   >
                     {renderSparkles(item.sparkleColor)}
                    
                     <div className={`flex-shrink-0 w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                       <span className={`${item.color} ${item.hoverColor} transition-colors duration-300`}>{item.icon}</span>
                     </div>
                    
                     <div className="flex flex-col">
                       <span className="text-sm text-gray-500 mb-0.5">{item.actionText}</span>
                       <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                         {item.label}
                       </span>
                     </div>
                    
                     <ExternalLink
                       size={14}
                       className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     />
                   </a>
                 ))}
               </div>
             </div>
           </div>


           {/* Call to action section - matches AboutCard style */}
           <div className="mt-10 pt-8 border-t border-blue-100 flex justify-center">
             <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-amber-50 hover:from-blue-100 hover:to-amber-100 transition-colors duration-300 group cursor-pointer">
               <Sparkles size={16} className="text-amber-600 animate-pulse" />
               <p className="text-gray-700 font-medium">
                 Let's craft your path to academic excellence together!
               </p>
             </div>
           </div>
         </div>
       </div>
      
       {/* Enhanced bottom accent decoration - matching AboutCard */}
       <div className="mt-16 w-full flex justify-center gap-2 text-sm">
         {['✦', 'your', 'path', 'to', 'success', '✦'].map((word, index) => (
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
    
     {/* Enhanced CSS for animations - matching AboutCard */}
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
       `}
     </style>
   </section>
 );
};