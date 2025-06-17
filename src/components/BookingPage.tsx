import { useState, useEffect, useCallback, memo, useMemo, lazy, Suspense } from 'react';
import { BookOpen, Star, Award, BookMarked, Sparkles, LucideProps } from 'lucide-react';

// Lazy load the TallyForm to reduce initial bundle size
const LazyTallyForm = lazy(() => {
  return new Promise<{ default: React.ComponentType }>((resolve) => {
    // Add a small delay to prevent blocking main thread
    setTimeout(() => {
      resolve({
        default: memo(() => (
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
              loading="lazy"
            />
          </div>
        ))
      });
    }, 100);
  });
});

// Loading fallback component
const FormSkeleton = memo(() => (
  <div className="mt-6 h-[738px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-gray-400">Loading form...</div>
  </div>
));

// Types for component props
interface FloatingIconProps {
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  size: number;
  className: string;
  style?: React.CSSProperties;
}

interface BenefitItemProps {
  title: string;
  desc: string;
}

interface AnimatedWordProps {
  word: string;
}

interface FloatingIconData {
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  size: number;
  className: string;
}

interface BenefitData {
  title: string;
  desc: string;
}

// Constants moved outside component and frozen for better performance
const BENEFITS_DATA: readonly BenefitData[] = Object.freeze([
  { title: "Expert Guidance", desc: "Get advice from mentors at Ivy League & top universities" },
  { title: "Personalized Strategy", desc: "Develop a unique roadmap for your college applications" },
  { title: "Application Review", desc: "Get feedback on your essays and overall application" },
  { title: "Program Matching", desc: "Find the best universities for your unique profile" }
]);

const BOTTOM_WORDS: readonly string[] = Object.freeze(['✦', 'start', 'your', 'journey', 'today', '✦']);

const FLOATING_ICONS: readonly FloatingIconData[] = Object.freeze([
  { Icon: BookOpen, size: 60, className: "absolute top-1/4 left-[10%] animate-float-slow opacity-20 text-blue-600" },
  { Icon: Star, size: 40, className: "absolute top-1/3 right-[15%] animate-float-medium opacity-20 text-amber-600" },
  { Icon: Award, size: 50, className: "absolute bottom-1/4 left-[20%] animate-float opacity-20 text-blue-600" },
  { Icon: BookMarked, size: 45, className: "absolute bottom-1/3 right-[20%] animate-float-slow opacity-20 text-amber-600" }
]);

// Optimized floating icon component with reduced re-renders
const FloatingIcon = memo<FloatingIconProps>(({ Icon, size, className, style }) => {
  const combinedStyle = useMemo(() => ({
    willChange: 'transform',
    ...style
  }), [style]);

  return (
    <div className={className} style={combinedStyle}>
      <Icon size={size} />
    </div>
  );
});

FloatingIcon.displayName = 'FloatingIcon';

// Optimized benefit item with reduced DOM operations
const BenefitItem = memo<BenefitItemProps>(({ title, desc }) => (
  <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
      <span className="text-amber-500 text-sm">✦</span>
    </div>
    <div>
      <h4 className="text-gray-800 font-medium">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  </div>
));

BenefitItem.displayName = 'BenefitItem';

// Simplified animated word component
const AnimatedWord = memo<AnimatedWordProps>(({ word }) => (
  <span className="opacity-70 text-gray-600 cursor-default hover:opacity-100 hover:text-amber-600 hover:scale-110 hover:-translate-y-1 transition duration-300 inline-block">
    {word}
  </span>
));

AnimatedWord.displayName = 'AnimatedWord';

// Background elements component to reduce main component complexity
const BackgroundElements = memo(() => (
  <>
    <div
      className="absolute top-[15%] right-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
      style={{ 
        animationDuration: '15s',
        willChange: 'opacity'
      }}
    />
    <div
      className="absolute top-[-30%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
      style={{ 
        animationDuration: '22s',
        willChange: 'opacity'
      }}
    />
    <div
      className="absolute bottom-[15%] left-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
      style={{ 
        animationDuration: '22s',
        willChange: 'opacity'
      }}
    />
  </>
));

BackgroundElements.displayName = 'BackgroundElements';

// Floating icons component to reduce main component complexity
const FloatingIcons = memo(() => (
  <>
    {FLOATING_ICONS.map((icon, index) => (
      <FloatingIcon
        key={index}
        Icon={icon.Icon}
        size={icon.size}
        className={icon.className}
      />
    ))}
  </>
));

FloatingIcons.displayName = 'FloatingIcons';

export function BookingPage() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Memoized viewport height setter with debouncing
  const setVh = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  // Debounced resize handler to reduce excessive calls
  const debouncedSetVh = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setVh, 100);
    };
  }, [setVh]);

  // Memoized mouse handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoized styles to prevent recalculation
  const contentStyle = useMemo<React.CSSProperties>(() => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    willChange: isVisible ? 'auto' : 'opacity, transform'
  }), [isVisible]);

  const cardStyle = useMemo<React.CSSProperties>(() => ({
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    willChange: 'transform'
  }), [isHovered]);

  const sectionStyle = useMemo<React.CSSProperties>(() => ({
    minHeight: 'calc(var(--vh, 1vh) * 100)'
  }), []);

  useEffect(() => {
    // Initialize viewport height
    setVh();
    
    // Use passive event listener for better performance
    window.addEventListener('resize', debouncedSetVh, { passive: true });

    // Batch DOM operations
    requestAnimationFrame(() => {
      // Ensure scrolling is enabled
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      
      // Trigger scroll event after DOM is ready
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 100);
    });
    
    // Show component with slight delay for animation
    const visibilityTimer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('resize', debouncedSetVh);
      clearTimeout(visibilityTimer);
    };
  }, [setVh, debouncedSetVh]);

  return (
    <>
      <section 
        className="py-20 px-6 bg-stone-100 w-full min-h-screen pt-20 relative overflow-hidden" 
        style={sectionStyle}
      >
        <BackgroundElements />
        <FloatingIcons />

        <br />

        {/* Content container with optimized transitions */}
        <div 
          className="relative z-10 w-full pb-12 px-4 max-w-5xl mx-auto"
          style={contentStyle}
        >
          {/* Page title */}
          <div className="flex items-center justify-center mb-16">
            <div className="relative">
              <h2 className="text-4xl font-medium text-gray-800 text-center">
                book a <span className="font-['PT_Serif',serif] italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">meeting</span>
              </h2>
              
              <span
                className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic"
                style={{
                  animation: 'rotate-and-scale 5s infinite ease-in-out',
                  willChange: 'transform'
                }}
              >
                ✦
              </span>
            </div>
          </div>

          {/* Main content card with optimized hover effects */}
          <div
            className="max-w-3xl mx-auto rounded-[48px] p-2.5 bg-gradient-to-br from-blue-100 via-blue-50 to-amber-50 backdrop-blur-sm shadow-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={cardStyle}
          >
            <div className="relative bg-white rounded-[38px] p-8 md:p-12 shadow-xl border border-blue-200 overflow-hidden">
              {/* Animated background glow effect - memoized */}
              <div className="absolute inset-0 opacity-40">
                <div
                  className={`absolute w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl ${isHovered ? 'animate-pulse-fast' : 'animate-pulse'}`}
                  style={{ 
                    top: '20%', 
                    left: '10%',
                    willChange: 'opacity, transform'
                  }}
                />
                <div
                  className={`absolute w-1/3 h-1/3 bg-amber-100 rounded-full blur-3xl ${isHovered ? 'animate-pulse-fast' : 'animate-pulse'}`}
                  style={{ 
                    bottom: '20%', 
                    right: '15%',
                    willChange: 'opacity, transform'
                  }}
                />
              </div>
              
              <div className="relative z-10">
                {/* Intro text */}
                <div>
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                    <span className="text-amber-500 relative inline-block mr-2 cursor-default">
                      ✦
                    </span>
                    Schedule a free consultation with our admissions experts to discuss your college application journey. Our mentors from top universities will help craft your path to success.
                  </p>
                </div>
                
                {/* Lazy-loaded Tally Form with suspense fallback */}
                <div className="mt-8 p-6 rounded-3xl bg-blue-50 border border-blue-200">
                  <Suspense fallback={<FormSkeleton />}>
                    <LazyTallyForm />
                  </Suspense>
                </div>
                
                {/* Benefits section - memoized list */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {BENEFITS_DATA.map((item, index) => (
                    <BenefitItem
                      key={index}
                      title={item.title}
                      desc={item.desc}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action section */}
          <div className="mt-10 pt-8 flex justify-center">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-amber-50 hover:from-blue-100 hover:to-amber-100 transition-colors duration-300 group cursor-pointer">
              <Sparkles size={16} className="text-amber-600 animate-pulse" />
              <p className="text-gray-700 font-medium">
                Let's craft your path to academic excellence together!
              </p>
            </div>
          </div>
          
          {/* Bottom accent decoration - memoized */}
          <div className="mt-16 w-full flex justify-center gap-2 text-sm">
            {BOTTOM_WORDS.map((word, index) => (
              <AnimatedWord key={index} word={word} />
            ))}
          </div>
        </div>
      </section>

      {/* Optimized CSS with GPU acceleration hints */}
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

          /* Optimized base styles with performance hints */
          html, body {
            height: 100%;
            overscroll-behavior: none;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          body {
            overflow-y: auto !important;
          }

          /* GPU acceleration for animated elements */
          .animate-float,
          .animate-float-medium,
          .animate-float-slow,
          .animate-pulse,
          .animate-pulse-fast {
            will-change: transform;
            transform: translateZ(0);
          }

          /* Optimize hover effects */
          .group:hover {
            will-change: transform;
          }
        `}
      </style>
    </>
  );
}

export default BookingPage;