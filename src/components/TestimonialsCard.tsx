import { useState, useEffect } from 'react';
import { Star, BookOpen, Quote, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestimonialsCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      quote: "I had no idea where to start with my college applications. College Crafters guided me step by step with my activities and essays, offering personalized support and a strong sense of community. Thanks to them, I felt confident showcasing my best self.",
      name: "Muhammed Umer Bhatti",
      designation: "University of Miami",
      src: "/Umer.jpeg",
      gradient: "from-amber-400/20 to-blue-500/20",
      instagramUrl: "https://www.instagram.com/p/DI6tN_7IwwF/?utm_source=ig_web_copy_link&igsh=MTMwNGRyZGE2Znloeg=="
    },
    {
      quote: "I struggled to connect my passion for the environment with my fascination for physics. College Crafters helped me tie these themes together in a way that felt natural and compelling. Their guidance highlighted my unique interests while staying true to who I am.",
      name: "Maaz Habib",
      designation: "University College London",
      src: "/maaz.jpeg",
      gradient: "from-blue-400/20 to-amber-500/20",
      instagramUrl: "https://www.instagram.com/p/DKRinexI8Db/?utm_source=ig_web_copy_link&igsh=bHdkaDZpd3ZteWt1"
    },
    {
      quote: "I joined late and didn’t really know how to bring my ideas together. QCC made space for what mattered to me and still helped me build essays that were sharp and meaningful. Their feedback made everything clearer, and I wouldn’t have gotten here without them.",
      name: "Taimoor Ali Asghar",
      designation: "Bennington College",
      src: "/taimoor.jpeg",
      gradient: "from-amber-500/20 to-blue-400/20",
      instagramUrl: "https://www.instagram.com/p/DKC7y2KoZ_Y/?utm_source=ig_web_copy_link&igsh=MTY4czAwM2hpdnd5aw=="
    },
    {
      quote: "The personalized approach at College Crafters made all the difference. They didn't just help me with applications - they helped me discover my strengths and present them authentically. I couldn't have done it without their support.",
      name: "Niloufar Rasouli",
      designation: "Carleton College",
      src: "/niloufar.jpeg",
      gradient: "from-blue-500/20 to-amber-400/20",
      instagramUrl: "https://www.instagram.com/p/DI9ocUpg7g4/?utm_source=ig_web_copy_link&igsh=M2tuZDVsbW5uejBu"
    },
    {
      quote: "In my journey through college applications, QCC supported me by encouraging me to take part in activities which reflected my interest in my intended major. In particular, they helped me showcase the honours I had accumulated over the years to create a lasting impression on the admission officers' minds. Truly indebted to them to help my dream to study abroad come true.",
      name: "Hafi Shaheer Khan",
      designation: "Duke Kunshan",
      src: "/hafi.jpeg",
      gradient: "from-amber-600/20 to-blue-600/20",
      instagramUrl: "https://www.instagram.com/p/DJAGypng5b-/?utm_source=ig_web_copy_link&igsh=MzZybG8xajdteGlv"
    },
    {
      quote: "From brainstorming to final drafts, QCC guided me through every essay with care and clarity. They helped me find meaning in moments I’d overlooked and made the whole process feel a lot less overwhelming. Even in the busiest stretches, their support felt steady and thoughtful. Their guidance turned a stressful journey into something empowering.",
      name: "Rida Habib",
      designation: "Minerva University",
      src: "/WhatsApp Image 2025-05-30 at 17.58.07.jpeg",
      gradient: "from-blue-600/20 to-amber-600/20",
      instagramUrl: "https://www.instagram.com/p/DKSMtNDo_vN/?utm_source=ig_web_copy_link&igsh=dGhkZThsMWthaTI5"
    },
    {
      quote: "I remember sending QCC my first draft thinking it was pretty solid. They sent it back, torn apart in the best way. Every sentence was challenged. Every idea had to earn its place. It wasn’t easy, but it was exactly what I needed. They didn’t just help me write essays. They made sure I understood my story. QCC pushed me, sharpened my thinking, and made me better. Wouldn’t have made it without them.",
      name: "Ahmed Bajwa",
      designation: "Imperial college London",
      src: "/bajwa.jpeg",
      gradient: "from-blue-600/20 to-amber-600/20",
      instagramUrl: "https://www.instagram.com/p/DKPqS38IOt1/?utm_source=ig_web_copy_link&igsh=N3A2eHFjaGZlMjJj"
    },
    {
      quote: "The essay guidance I received was incredible. They helped me find my voice and tell my story in a way that felt genuine and compelling. I'm grateful for their expertise and support throughout the process.",
      name: "Shahvaiz Alvi",
      designation: "Union College",
      src: "/shah.jpeg",
      gradient: "from-blue-600/20 to-amber-600/20",
      instagramUrl: "https://www.instagram.com/p/DJ971XgAgFb/?utm_source=ig_web_copy_link&igsh=MWtyZXo0YTM1Ymx0eg=="
    },
    {
      quote: "I came in with stories from startups, trading, and tech but didn’t know how to put them together. QCC helped me build a clear strategy and made sure my essays actually sounded like me. Their feedback made the whole process simple and real.",
      name: "Muhammad Hassnain Khan",
      designation: "Minerva University",
      src: "/hasnain.jpeg",
      gradient: "from-blue-600/20 to-amber-600/20",
      instagramUrl: "https://www.instagram.com/p/DJUpff6AROc/?utm_source=ig_web_copy_link&igsh=ZjBtdzRwNmdvczFi"
    }
  ];

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 3) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 3 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const handleCardClick = (instagramUrl: string) => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], originalIndex: index });
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section id="testimonials" className="py-20 px-6 bg-stone-100  relative overflow-hidden">
      {/* Background decorative elements */}
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

      {/* Floating icons */}
      <div className="absolute top-[15%] left-[8%] animate-float-elegant opacity-8">
        <BookOpen size={36} className="text-blue-600/30" />
      </div>
      <div className="absolute top-[20%] right-[12%] animate-float-gentle opacity-8">
        <Star size={32} className="text-amber-600/30" />
      </div>
      <div className="absolute bottom-[40%] left-[15%] animate-float-subtle opacity-8">
        <Quote size={34} className="text-blue-600/30" />
      </div>

      <div
        className="max-w-7xl mx-auto relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
              our<span className="font-['PT_Serif',serif] italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3">testimonials</span>
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
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed mt-4">
            Discover how we've helped students achieve their dreams at top universities
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.originalIndex}-${currentIndex}`}
              className={`group relative transition-all duration-700 ease-out cursor-pointer ${
                isAnimating ? 'animate-slide-up' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleCardClick(testimonial.instagramUrl)}
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500 hover:-translate-y-2 h-full">
               
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
               
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
                        <img
                          src={testimonial.src}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                          draggable={false}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextElementSibling;
                            if (sibling && sibling instanceof HTMLElement) sibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm hidden">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                   
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-base mb-2">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-1">
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
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-gray-200/50 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50/50"
          >
            <ChevronLeft className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:-translate-x-0.5" />
          </button>
         
          <div className="flex gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-sm">
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
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-gray-200/50 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50/50"
          >
            <ChevronRight className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Bottom decorative text */}
        <div className="flex justify-center items-center gap-3 text-base mt-12">
          {['✦', 'Success', 'Stories', 'That', 'Inspire', '✦'].map((word, index) => (
            <span
              key={index}
              className="text-gray-500 cursor-default transition-all duration-300 hover:text-gray-700 font-light tracking-wider"
              style={{
                fontSize: word === '✦' ? '1.1rem' : '0.95rem'
              }}
              onMouseEnter={(e) => {
                if (word === '✦') {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.2)';
                  e.currentTarget.style.color = '#f59e0b';
                } else {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.color = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              {word}
            </span>
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