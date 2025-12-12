import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { BookOpen, FileText, Award, BookMarked, Sparkles, ExternalLink, Download, Users, Target } from 'lucide-react';

// Types for component props
interface FloatingIconProps {
  Icon: React.ForwardRefExoticComponent<any>;
  size: number;
  className: string;
  style?: React.CSSProperties;
}

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  link: string;
  icon: React.ForwardRefExoticComponent<any>;
  isNew?: boolean;
}

interface CategoryFilterProps {
  categories: readonly string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface AnimatedWordProps {
  word: string;
}

interface FloatingIconData {
  Icon: React.ForwardRefExoticComponent<any>;
  size: number;
  className: string;
}

interface ResourceData {
  title: string;
  description: string;
  category: string;
  link: string;
  icon: React.ForwardRefExoticComponent<any>;
  isNew?: boolean;
}

// Constants moved outside component and frozen for better performance
const RESOURCES_DATA: readonly ResourceData[] = Object.freeze([
  {
    title: "QCC Guide to Crafting a Compelling Common App Personal Statement",
    description: "Your Common App essay should reveal how you think and feel, not list achievements. This guide helps you write something vivid, well-structured, and strategically aligned with your application.",
    category: "Essays",
    link: "https://docs.google.com/document/d/1tmILzgzElQLsEzR2SLxvmmr3EcP0dJYy1cXjWKGV1Cs/edit?usp=sharing",
    icon: BookOpen,
    isNew: true
  },
  {
    title: "QCC Guide to Understanding “Fit” in College Applications",
    description: "Selective colleges look beyond grades, scores, and activities because they also care about “fit,” which means how well you match what the school values. Showing this alignment can be the factor that moves you from rejection to acceptance.",
    category: "Applications",
    link: "https://docs.google.com/document/d/1VoCHi0wQ9VAZ9xN87cB1nwbN5tTzT3WWleIxMs8umLk/edit?usp=sharing",
    icon: FileText,
    isNew: true
  },
  {
    title: "QCC Undergraduate Scholarship Guide",
    description: "A global guide to undergraduate scholarships offering full rides or major tuition support across 30+ countries. Highlights the most generous awards, lower-cost education routes, and strategic application tips.",
    category: "Financial Aid / Scholarships",
    link: "https://docs.google.com/document/d/1vWEdCoHWyXBajfnDxXmZHfQlyIHszv6mO1bcoMOaikQ/edit?usp=sharing",
    icon: Award,
    isNew: true
  },
  {
    title: "QCC Guide to Filling Your Common App Awards Section",
    description: "Essays and activities show who you are, but awards show that others have recognized your work. A strong awards section adds instant credibility, and the key is being specific and giving clear context.",
    category: "Activities",
    link: "https://docs.google.com/document/d/sample4",
    icon: BookMarked,
    isNew: true
  },
  {
    title: "QCC Guide to Writing Impactful Extracurriculars",
    description: "Essays matter, but students often miss how much extracurriculars show their initiative and impact. A strong EC section can elevate an application, and the examples below highlight what effective descriptions look like.",
    category: "Activities",
    link: "https://docs.google.com/document/d/1HI-ucedX4Nj4pgAIY-HJ8MRpFNKOc8nXMo39DbGVIfM/edit?usp=sharing",
    icon: BookMarked,
    isNew: true
  },
]);

const CATEGORIES: readonly string[] = Object.freeze([
  "All", "Applications", "Essays", "Financial Aid / Scholarships", "Interviews", "Test Prep", "Activities", "College Search"
]);

const BOTTOM_WORDS: readonly string[] = Object.freeze(['✦', 'access', 'expert', 'resources', 'today', '✦']);

const FLOATING_ICONS: readonly FloatingIconData[] = Object.freeze([
  { Icon: BookOpen, size: 60, className: "absolute top-1/4 left-[10%] animate-float-slow opacity-20 text-blue-600" },
  { Icon: FileText, size: 40, className: "absolute top-1/3 right-[15%] animate-float-medium opacity-20 text-amber-600" },
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

// Resource card component
const ResourceCard = memo<ResourceCardProps>(({ title, description, category, link, icon: Icon, isNew }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const cardStyle = useMemo<React.CSSProperties>(() => ({
    transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
    transition: 'all 0.3s ease',
    willChange: 'transform'
  }), [isHovered]);

  return (
    <div
      className="relative bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      onClick={() => window.open(link, '_blank')}
    >
      {/* New badge */}
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          NEW
        </div>
      )}

      {/* Card background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-200 rounded-full blur-xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and category */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <Icon size={24} className="text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Title and description */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Access button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
            <ExternalLink size={16} />
            <span>Access Resource</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Download size={14} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
});

ResourceCard.displayName = 'ResourceCard';

// Category filter component
const CategoryFilter = memo<CategoryFilterProps>(({ categories, activeCategory, onCategoryChange }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onCategoryChange(category)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          activeCategory === category
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:text-blue-600 hover:shadow-md'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
));

CategoryFilter.displayName = 'CategoryFilter';

// Simplified animated word component
const AnimatedWord = memo<AnimatedWordProps>(({ word }) => (
  <span className="opacity-70 text-gray-600 cursor-default hover:opacity-100 hover:text-amber-600 hover:scale-110 hover:-translate-y-1 transition duration-300 inline-block">
    {word}
  </span>
));

AnimatedWord.displayName = 'AnimatedWord';

// Background elements component
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

// Floating icons component
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

export function ResourcesPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Memoized viewport height setter with debouncing
  const setVh = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  // Debounced resize handler
  const debouncedSetVh = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setVh, 100);
    };
  }, [setVh]);

  // Filter resources based on active category
  const filteredResources = useMemo(() => {
    return activeCategory === "All" 
      ? RESOURCES_DATA 
      : RESOURCES_DATA.filter(resource => resource.category === activeCategory);
  }, [activeCategory]);

  // Memoized styles
  const contentStyle = useMemo<React.CSSProperties>(() => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    willChange: isVisible ? 'auto' : 'opacity, transform'
  }), [isVisible]);

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

        {/* Content container */}
        <div 
          className="relative z-10 w-full pb-12 px-4 max-w-7xl mx-auto"
          style={contentStyle}
        >
          {/* Page title */}
          <div className="flex items-center justify-center mb-16">
            <div className="relative">
              <h2 className="text-4xl font-medium text-gray-800 text-center">
                expert <span className="font-['PT_Serif',serif] italic font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">resources</span>
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

          {/* Subtitle */}
          <div className="text-center mb-12">
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              <span className="text-amber-500 relative inline-block mr-2 cursor-default">
                ✦
              </span>
              Access our comprehensive collection of college admissions resources, guides, and templates designed by experts from top universities.
            </p>
          </div>

          {/* Category filters */}
          <CategoryFilter 
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Resources grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={index}
                title={resource.title}
                description={resource.description}
                category={resource.category}
                link={resource.link}
                icon={resource.icon}
                isNew={resource.isNew}
              />
            ))}
          </div>

          {/* Call to action section */}
          <div className="mt-16 pt-8 flex justify-center">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-amber-50 hover:from-blue-100 hover:to-amber-100 transition-colors duration-300 group cursor-pointer">
              <Sparkles size={16} className="text-amber-600 animate-pulse" />
              <p className="text-gray-700 font-medium">
                Need personalized guidance? Book a consultation with our experts!
              </p>
            </div>
          </div>
          
          {/* Bottom accent decoration */}
          <div className="mt-16 w-full flex justify-center gap-2 text-sm">
            {BOTTOM_WORDS.map((word, index) => (
              <AnimatedWord key={index} word={word} />
            ))}
          </div>
        </div>
      </section>

      {/* Optimized CSS */}
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

          /* Optimized base styles */
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
          .animate-pulse {
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

export default ResourcesPage;