import { useState, useEffect, useRef, memo } from 'react';
import {
  BookOpen,
  BookMarked,
  MapPin,
  Sparkles,
  LucideIcon
} from 'lucide-react';

// Type definitions
interface FloatingIconProps {
  Icon: LucideIcon;
  size: number;
  className: string;
  style?: React.CSSProperties;
}

interface CountryBadgeProps {
  country: string;
}

// Memoized floating icon component to prevent unnecessary re-renders
const FloatingIcon = memo<FloatingIconProps>(({ Icon, size, className, style }) => (
  <div className={className} style={style}>
    <Icon size={size} />
  </div>
));

// Memoized country badge component
const CountryBadge = memo<CountryBadgeProps>(({ country }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-300 border border-gray-200/60 shadow-sm font-medium">
    <MapPin size={12} className="opacity-70" />
    <span>{country}</span>
  </div>
));

// Extract CSS to prevent recalculation on every render
const styles = `
  @keyframes float-slow {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-25px) rotate(3deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  @keyframes pulse-fast {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
  }
  
  @keyframes star-pulse {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(15deg) scale(1.2); }
    50% { transform: rotate(0deg) scale(1); }
    75% { transform: rotate(-15deg) scale(1.2); }
    100% { transform: rotate(0deg) scale(1); }
  }
  
  .animate-float-slow {
    animation: float-slow 9s ease-in-out infinite;
  }
  
  .animate-pulse-fast {
    animation: pulse-fast 3s ease-in-out infinite;
  }
`;

// Countries array moved outside component to prevent recreation
const COUNTRIES = ['US', 'UK', 'UAE', 'Pakistan', 'Canada', 'China', 'Afghanistan', 'Singapore', 'Hong Kong', 'Germany', 'Australia'];

export const AboutCard = memo(() => {
  // Optimized state management
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Use requestAnimationFrame for smoother animation timing
    const timer = requestAnimationFrame(() => {
      setTimeout(() => setIsVisible(true), 100);
    });

    // Optimized intersection observer with passive event listeners
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]; // Only one element to observe
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start animation slightly before element is visible
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      cancelAnimationFrame(timer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  // Memoized inline styles to prevent object recreation
  const sectionStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 1.2s ease, transform 1.2s ease'
  };

  const cardStyle = {
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    transition: 'transform 0.3s ease'
  };

  const contentStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease'
  };

  return (
    <>
      {/* Inject styles only once */}
      <style>{styles}</style>
      
      <section
        id="about"
        ref={sectionRef}
        className="py-24 px-6 bg-stone-100 relative overflow-hidden"
      >
        {/* Optimized background elements - using transform instead of positioning */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_400px_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
        
        {/* Floating background shapes with will-change for better performance */}
        <div 
          className="absolute top-[10%] right-[-8%] w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl will-change-transform"
          style={{ animation: 'pulse 18s ease-in-out infinite' }}
        />
        <div 
          className="absolute bottom-[10%] left-[-12%] w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/20 rounded-full blur-3xl will-change-transform"
          style={{ animation: 'pulse 25s ease-in-out infinite' }}
        />

        {/* Floating icons with optimized positioning */}
        <FloatingIcon
          Icon={BookOpen}
          size={56}
          className="absolute top-1/4 left-[8%] animate-float-slow opacity-15 text-blue-500 will-change-transform"
        />
        <FloatingIcon
          Icon={BookMarked}
          size={42}
          className="absolute bottom-1/3 right-[15%] animate-float-slow opacity-15 text-amber-500 will-change-transform"
        />

        {/* Main container */}
        <div
          className="max-w-4xl mx-auto relative z-10"
          style={sectionStyle}
        >
          {/* Header section */}
          <div className="flex items-center justify-center mb-16">
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
                about
                <span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">
                  us
                </span>
              </h2>
              
              {/* Animated star */}
              <span
                className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic will-change-transform"
                style={{ animation: 'star-pulse 5s ease-in-out infinite' }}
              >
                ✦
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div className="flex justify-center mb-12">
            <p className="text-gray-600 max-w-2xl text-center font-light text-lg leading-relaxed">
              We're not just consultants. We're former applicants who've been through the same journey and succeeded.
              <br />
              <span className="text-blue-600 font-medium">
                Our passion is helping you achieve your academic dreams.
              </span>
            </p>
          </div>

          {/* Main card */}
          <div
            className="max-w-4xl mx-auto rounded-[48px] p-2.5 bg-gradient-to-br from-blue-100 via-blue-50 to-amber-50 backdrop-blur-sm shadow-lg will-change-transform"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={cardStyle}
          >
            <div className="relative bg-white rounded-[38px] p-10 md:p-14 shadow-xl border border-blue-200 overflow-hidden">
              {/* Background glow effects */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div
                  className={`absolute w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl will-change-transform ${
                    isHovered ? 'animate-pulse-fast' : 'animate-pulse'
                  }`}
                  style={{ top: '15%', left: '5%' }}
                />
                <div
                  className={`absolute w-1/3 h-1/3 bg-amber-100 rounded-full blur-3xl will-change-transform ${
                    isHovered ? 'animate-pulse-fast' : 'animate-pulse'
                  }`}
                  style={{ bottom: '15%', right: '10%' }}
                />
              </div>

              <div className="relative z-10">
                {/* Content area */}
                <div className="bg-gray-50/80 rounded-3xl p-8 mb-10 border border-gray-100/50">
                  <div className="prose max-w-none" style={contentStyle}>
                    <p className="text-lg md:text-xl leading-relaxed relative text-gray-700 font-light">
                      <span className="absolute -left-4 top-1 text-amber-400 text-lg">✦</span>
                      At QCC, we understand what it feels like to be on the other side of the admissions process. 
                      You are hopeful, uncertain, and determined. We have been there too. That is why we created QCC, 
                      a platform built by students for students. Our mission is to make world-class college guidance 
                      accessible, affordable, and honest.
                    </p>
                    
                    <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light mt-6">
                      From personal statements to scholarship essays, we have helped students gain admission to 
                      universities like Carleton College, University of Miami, Imperial College London, University of Toronto, Minerva, KAIST, and more. 
                      Our team offers real experience and effective strategies, supported by a global network of mentors, 
                      alumni, and former admissions officers who understand what it takes to succeed.
                    </p>

                    <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light mt-6">
                      We believe ambition should never be limited by access. At QCC, we are here to help you craft 
                      your story and make sure it is heard.
                    </p>
                  </div>
                </div>
              
                {/* Testimonial quote */}
                <div className="relative bg-gradient-to-r from-amber-50/60 to-orange-50/40 rounded-2xl p-6 mb-12 border-l-4 border-amber-300/60">
                  <Sparkles className="absolute -left-2 -top-2 text-amber-400 h-6 w-6" />
                  <p className="italic text-gray-600 text-lg font-light leading-relaxed">
                    "Our mission is simple: to transform aspirations into acceptance letters.
                    We've been where you are, and we know the path forward."
                  </p>
                  <div className="text-right mt-3 text-sm text-gray-500 not-italic font-medium">
                    — QCC Team
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          {/* Countries section */}
          <div className="mt-12 flex flex-col items-center">
            <h4 className="text-sm font-medium text-gray-500 mb-4 tracking-wide">
              We serve students from around the world
            </h4>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {COUNTRIES.map((country) => (
                <CountryBadge key={country} country={country} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
});