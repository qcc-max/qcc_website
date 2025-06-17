import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Star, BookOpen, Quote, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  gradient: string;
  instagramUrl: string;
}

// Memoized testimonial data to prevent re-creation on every render
const TESTIMONIALS_DATA: Testimonial[] = [
  {
    quote: "I'm grateful I started working with QCC early, as it helped structure my entire college application process. They guided me in building a strong activity list, refining my Common App essay, and weaving my extracurriculars into a cohesive story. Their university selection advice was excellent, and they continued to support me through the visa process. Their expertise truly made a difference.",
    name: "Muhammed Umer Bhatti",
    designation: "University of Miami",
    src: "/Umer.webp",
    gradient: "from-amber-400/20 to-blue-500/20",
    instagramUrl: "https://www.instagram.com/p/DI6tN_7IwwF/?utm_source=ig_web_copy_link&igsh=MTMwNGRyZGE2Znloeg=="
  },
  {
    quote: "The QCC team supported me throughout my college application journey with guidance at every step. They helped organize my activities and honors, and worked closely with me to craft a personal statement that reflected my identity and experiences as an Afghan girl. Their insight was especially valuable in turning my four-year gap into a powerful story of resilience. Thanks to QCC, I navigated a stressful process with clarity and strength.",
    name: "Niloufar Rasouli",
    designation: "Carleton College",
    src: "/niloufar.webp",
    gradient: "from-blue-500/20 to-amber-400/20",
    instagramUrl: "https://www.instagram.com/p/DI9ocUpg7g4/?utm_source=ig_web_copy_link&igsh=M2tuZDVsbW5uejBu"
  },
  {
    quote: "I remember sending QCC my first draft thinking it was pretty solid. They sent it back, torn apart in the best way. Every sentence was challenged. Every idea had to earn its place. It wasn't easy, but it was exactly what I needed. They didn't just help me write essays. They made sure I understood my story. QCC pushed me, sharpened my thinking, and made me better. Wouldn't have made it without them.",
    name: "Ahmed Bajwa",
    designation: "Imperial college London",
    src: "/bajwa.webp",
    gradient: "from-blue-600/20 to-amber-600/20",
    instagramUrl: "https://www.instagram.com/p/DKPqS38IOt1/?utm_source=ig_web_copy_link&igsh=N3A2eHFjaGZlMjJj"
  },
  {
    quote: "I came in with big goals but wasn't sure how to bring everything together. QCC helped me craft essays that truly reflected who I am — from research to extracurriculars. Their feedback was always thoughtful and sharp, and their support kept me grounded through the most stressful parts of the process. They also constantly kept me updated about scholarship opportunities around the world, which helped me stay ahead and focused.",
    name: "Maaz Habib",
    designation: "University College London",
    src: "/maaz.webp",
    gradient: "from-blue-400/20 to-amber-500/20",
    instagramUrl: "https://www.instagram.com/p/DKRinexI8Db/?utm_source=ig_web_copy_link&igsh=bHdkaDZpd3ZteWt1"
  },
  {
    quote: "I joined late and didn't really know how to bring my ideas together. QCC made space for what mattered to me and still helped me build essays that were sharp and meaningful. Their feedback made everything clearer, and I wouldn't have gotten here without them.",
    name: "Taimoor Ali Asghar",
    designation: "Bennington College",
    src: "/taimoor.webp",
    gradient: "from-amber-500/20 to-blue-400/20",
    instagramUrl: "https://www.instagram.com/p/DKC7y2KoZ_Y/?utm_source=ig_web_copy_link&igsh=MTY4czAwM2hpdnd5aw=="
  },
  {
    quote: "In my journey through college applications, QCC supported me by encouraging me to take part in activities which reflected my interest in my intended major. In particular, they helped me showcase the honours I had accumulated over the years to create a lasting impression on the admission officers' minds. Truly indebted to them to help my dream to study abroad come true.",
    name: "Hafi Shaheer Khan",
    designation: "Duke Kunshan",
    src: "/hafi.webp",
    gradient: "from-amber-600/20 to-blue-600/20",
    instagramUrl: "https://www.instagram.com/p/DJAGypng5b-/?utm_source=ig_web_copy_link&igsh=MzZybG8xajdteGlv"
  },
  {
    quote: "From brainstorming to final drafts, QCC guided me through every essay with care and clarity. They helped me find meaning in moments I'd overlooked and made the whole process feel a lot less overwhelming. Even in the busiest stretches, their support felt steady and thoughtful. Their guidance turned a stressful journey into something empowering.",
    name: "Rida Habib",
    designation: "Minerva University",
    src: "/rida.webp",
    gradient: "from-blue-600/20 to-amber-600/20",
    instagramUrl: "https://www.instagram.com/p/DKSMtNDo_vN/?utm_source=ig_web_copy_link&igsh=dGhkZThsMWthaTI5"
  },
  {
    quote: "The essay guidance I received was incredible. They helped me find my voice and tell my story in a way that felt genuine and compelling. I'm grateful for their expertise and support throughout the process.",
    name: "Shahvaiz Alvi",
    designation: "Union College",
    src: "/shah.webp",
    gradient: "from-blue-600/20 to-amber-600/20",
    instagramUrl: "https://www.instagram.com/p/DJ971XgAgFb/?utm_source=ig_web_copy_link&igsh=MWtyZXo0YTM1Ymx0eg=="
  },
  {
    quote: "I came in with stories from startups, trading, and tech but didn't know how to put them together. QCC helped me build a clear strategy and made sure my essays actually sounded like me. Their feedback made the whole process simple and real.",
    name: "Muhammad Hassnain Khan",
    designation: "Minerva University",
    src: "/hasnain.webp",
    gradient: "from-blue-600/20 to-amber-600/20",
    instagramUrl: "https://www.instagram.com/p/DJUpff6AROc/?utm_source=ig_web_copy_link&igsh=ZjBtdzRwNmdvczFi"
  }
];

// Memoized decorative icons component
const DecorativeIcons = memo(() => (
  <>
    <div className="absolute top-[15%] left-[8%] animate-float-elegant opacity-8">
      <BookOpen size={36} className="text-blue-600/30" />
    </div>
    <div className="absolute top-[20%] right-[12%] animate-float-gentle opacity-8">
      <Star size={32} className="text-amber-600/30" />
    </div>
    <div className="absolute bottom-[40%] left-[15%] animate-float-subtle opacity-8">
      <Quote size={34} className="text-blue-600/30" />
    </div>
  </>
));

// Memoized background elements component
const BackgroundElements = memo(() => (
  <>
    <div
      className="absolute top-[10%] left-[-8%] w-4/5 h-3/5 bg-gradient-to-br from-amber-300/15 via-amber-200/10 to-transparent rounded-full blur-3xl animate-pulse"
      style={{
        animationDuration: '20s',
        clipPath: 'ellipse(70% 60% at 30% 40%)'
      }}
    />
    <div
      className="absolute top-[50%] right-[15%] w-3/5 h-3/5 bg-gradient-to-tl from-blue-300/15 via-blue-200/10 to-transparent rounded-full blur-3xl animate-pulse"
      style={{
        animationDuration: '25s',
        animationDelay: '5s',
        clipPath: 'ellipse(60% 80% at 70% 30%)'
      }}
    />
    <div
      className="absolute bottom-[10%] right-[-12%] w-4/5 h-2/3 bg-gradient-to-tr from-amber-300/12 via-blue-200/8 to-transparent rounded-full blur-3xl animate-pulse"
      style={{
        animationDuration: '18s',
        animationDelay: '10s',
        clipPath: 'ellipse(80% 50% at 20% 70%)'
      }}
    />
  </>
));

interface OptimizedImageProps {
  src: string;
  alt: string;
  name: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

// Optimized image component with proper sizing and fallbacks
const OptimizedImage = memo(({ src, alt, name, onError }: OptimizedImageProps) => {
  const initials = useMemo(() => 
    name.split(' ').map(n => n[0]).join(''), 
    [name]
  );

  return (
    <>
      <img
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
        draggable={false}
        onError={onError}
        style={{ 
          aspectRatio: '1/1',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm hidden">
        {initials}
      </div>
    </>
  );
});

interface TestimonialCardProps {
  testimonial: Testimonial & { originalIndex?: number };
  index: number;
  isAnimating: boolean;
  onCardClick: (url: string) => void;
}

// Memoized testimonial card component
const TestimonialCard = memo(({ testimonial, index, isAnimating, onCardClick }: TestimonialCardProps) => {
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const sibling = target.nextElementSibling as HTMLElement;
    if (sibling) sibling.style.display = 'flex';
  }, []);

  const handleClick = useCallback(() => {
    onCardClick(testimonial.instagramUrl);
  }, [testimonial.instagramUrl, onCardClick]);

  return (
    <div
      className={`group relative transition-all duration-700 ease-out cursor-pointer ${
        isAnimating ? 'animate-slide-up' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      <div className="relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500 hover:-translate-y-2 h-full">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`} />
        
        {/* University Badge */}
        <div className="absolute -top-4 -right-4 z-20">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-500/25 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-100" />
              <span className="text-sm font-semibold tracking-wide">
                {testimonial.designation}
              </span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full pt-4">
          {/* Quote */}
          <div className="flex-1 mb-6">
            <Quote size={24} className="text-amber-400 mb-4 opacity-60" />
            <p className="text-gray-700 leading-relaxed text-sm font-normal line-height-relaxed">
              "{testimonial.quote}"
            </p>
          </div>

          {/* Student Info */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100/50">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center border-2 border-white shadow-sm">
                <OptimizedImage
                  src={testimonial.src}
                  alt={`${testimonial.name} - QCC Student Success Story`}
                  name={testimonial.name}
                  onError={handleImageError}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-base mb-2">
                {testimonial.name}
              </h3>
              <div className="flex items-center gap-1 mb-1" role="img" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" className="text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                Success Story
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized animated star component
const AnimatedStar = memo(() => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 15) % 360);
      setScale(prev => prev === 1 ? 1.2 : 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic transition-all duration-500 ease-in-out"
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      ✦
    </span>
  );
});

interface DecorativeWordProps {
  word: string;
  index: number;
}

// Decorative word component
const DecorativeWord = memo(({ word, index }: DecorativeWordProps) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <span
      className="opacity-70 text-gray-600 cursor-default transition-all duration-300"
      style={{
        opacity: hovered ? 1 : 0.7,
        transform: hovered ? `translateY(-5px) rotate(${index % 2 === 0 ? 15 : -15}deg) scale(1.2)` : 'none',
        color: hovered ? '#F59E0B' : '#4B5563'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {word}
    </span>
  );
});

// Main component
export default function TestimonialsCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent re-renders by caching the testimonials array
  const testimonials = TESTIMONIALS_DATA;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const step = direction === 'next' ? 3 : -3;
    const newIndex = (currentIndex + step + testimonials.length) % testimonials.length;
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, currentIndex, testimonials.length]);

  const handleNext = useCallback(() => handleNavigation('next'), [handleNavigation]);
  const handlePrev = useCallback(() => handleNavigation('prev'), [handleNavigation]);

  const handleDotClick = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, currentIndex]);

  const handleCardClick = useCallback((instagramUrl: string) => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const visibleTestimonials = useMemo(() => {
    const visible: (Testimonial & { originalIndex: number })[] = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], originalIndex: index });
    }
    return visible;
  }, [currentIndex, testimonials]);

  const decorativeWords = ['✦', 'success', 'stories', 'that', 'inspire', '✦'];

  return (
    <section id="testimonials" className="py-20 px-6 bg-stone-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundElements />
      
      {/* Floating icons */}
      <DecorativeIcons />

      <div
        className="max-w-7xl mx-auto relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Header */}
        <header className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
              student<span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">testimonials</span>
            </h2>
            <AnimatedStar />
          </div>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed mt-4">
            Discover how we've helped students achieve their dreams at top universities
          </p>
        </header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {visibleTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.originalIndex}-${currentIndex}`}
              testimonial={testimonial}
              index={index}
              isAnimating={isAnimating}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className="flex justify-center items-center gap-6" aria-label="Testimonials navigation">
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-gray-200/50 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50/50"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:-translate-x-0.5" />
          </button>
         
          <div className="flex gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-sm" role="tablist">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={isAnimating}
                className={`rounded-full transition-all duration-300 ease-out disabled:cursor-not-allowed ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 w-8 h-3'
                    : 'bg-gray-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 w-3 h-3 hover:scale-125'
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-gray-200/50 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50/50"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:translate-x-0.5" />
          </button>
        </nav>

        {/* Bottom decorative text */}
        <div className="mt-16 w-full flex justify-center gap-2 text-sm">
          {decorativeWords.map((word, index) => (
            <DecorativeWord key={index} word={word} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float-elegant {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-12px) rotate(3deg);
            opacity: 0.12;
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-15px) rotate(-5deg) scale(1.05);
            opacity: 0.12;
          }
        }

        @keyframes float-subtle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.08;
          }
          33% {
            transform: translateY(-8px) rotate(2deg);
            opacity: 0.1;
          }
          66% {
            transform: translateY(-4px) rotate(-1deg);
            opacity: 0.11;
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-float-elegant {
          animation: float-elegant 14s ease-in-out infinite;
        }

        .animate-float-gentle {
          animation: float-gentle 16s ease-in-out infinite;
        }

        .animate-float-subtle {
          animation: float-subtle 18s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .line-height-relaxed {
          line-height: 1.7;
        }
      `}</style>
    </section>
  );
}