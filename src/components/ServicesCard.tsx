import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
 ArrowRight,
 Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Memoized services data to prevent recreation on every render
const SERVICES_DATA = [
  {
    id: 1,
    title: "Application Strategy",
    icon: FileText,
    description: "We don't believe in one-size-fits-all. Our team works closely with you to understand your story, strengths, and dreams. Then we build a step-by-step plan that brings your college goals into focus—helping you apply with purpose, clarity, and confidence.",
    color: "blue",
    features: ["Personalized Assessment", "Strategic Roadmap", "Timeline Planning", "Goal Setting"]
  },
  {
    id: 2,
    title: "Essay Crafting",
    icon: Edit,
    description: "Your experiences deserve to be heard and remembered. College essays aren't just about writing well; they're about sharing who you are in a way that feels real, meaningful, and unforgettable. We help you find the right story, structure it with purpose, and refine it until every word feels like you.",
    color: "amber",
    features: ["Story Development", "Writing Refinement", "Multiple Drafts", "Expert Review"]
  },
  {
    id: 3,
    title: "Profile Building",
    icon: Users,
    description: "Admissions committees look beyond grades—they want to see who you are outside the classroom. We help you shape a profile that reflects your passions, impact, and potential. Whether you're just getting started or refining years of activities, we'll guide you in building a story that feels meaningful and strategic.",
    color: "blue",
    features: ["Activity Planning", "Leadership Development", "Achievement Mapping", "Personal Branding "]
  },
  {
    id: 4,
    title: "Academic Excellence",
    icon: Award,
    description: "Whether you're aiming to raise your GPA or master a tough subject, we match you with expert tutors who break down complex ideas into clear steps. We also help you build smarter study habits that work for your schedule and goals.",
    color: "amber",
    features: ["Test Preparation", "Study Plans", "Progress Tracking", "Subject Mastery"]
  },
  {
    id: 5,
    title: "Portfolio Development",
    icon: Briefcase,
    description: "If you're applying for programs in art, design, research, or innovation, we help you showcase your best work in a way that's thoughtful, powerful, and true to you. From idea curation to final presentation, your portfolio will reflect who you are.",
    color: "blue",
    features: ["Activity Curation", "Skills Showcase", "Project Guidance", "Achievement Documentation"]
  },
  {
    id: 6,
    title: "International Access",
    icon: Globe,
    description: "Studying abroad is exciting—but also overwhelming. We make it easier. Whether you're applying from outside the U.S., U.K., or Canada, or targeting global programs, we'll help you understand requirements, adapt your applications, and feel supported at every step.",
    color: "amber",
    features: ["Visa Guidance", "Country Requirements", "Document Support", "Cultural Preparation"]
  },
  {
    id: 7,
    title: "Career Planning",
    icon: Lightbulb,
    description: "College is just the beginning. We help you think beyond your major—exploring future careers based on what excites you, what you're good at, and where you want to grow. You'll come away with direction, not just a degree plan.",
    color: "blue",
    features: ["Path Exploration", "Career Mapping", "Industry Insights", "Future Planning"]
  },
] as const;

// Memoized CSS styles to prevent recreation
const CSS_STYLES = `
  .scale-101 {
    transform: scale(1.01);
  }

  .scale-102 {
    transform: scale(1.02);
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(15deg) scale(1.05); }
    50% { transform: rotate(0deg) scale(1.1); }
    75% { transform: rotate(-15deg) scale(1.05); }
  }

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

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-medium {
    animation: float-medium 8s ease-in-out infinite;
  }

  .animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
  }

  .animate-pulse-fast {
    animation: pulse-fast 3s ease-in-out infinite;
  }
`;

export default function ServicesCard() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  // Memoized callback to prevent recreation on every render
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  // Memoized callback for navigation
  const handleGetStarted = useCallback(() => {
    navigate('/book');
  }, [navigate]);

  // Memoized callback for service selection
  const handleServiceSelect = useCallback((serviceId: number) => {
    setActiveService(serviceId);
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

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(timer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Memoized active service data
  const activeServiceData = useMemo(() => 
    SERVICES_DATA.find(service => service.id === activeService), 
    [activeService]
  );

  const ActiveIcon = activeServiceData?.icon;

  // Memoized mouse position style
  const mousePositionStyle = useMemo(() => ({
    background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent)`
  }), [mousePosition.x, mousePosition.y]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 bg-stone-100 relative overflow-hidden will-change-transform"
      onMouseMove={handleMouseMove}
    >
      {/* Background Elements */}
      <div
        className="absolute top-[10%] left-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      <div
        className="absolute bottom-[10%] right-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '22s' }}
      />
     
      {/* Interactive background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-1000"
        style={mousePositionStyle}
      />

      {/* Floating elements - Only render on larger screens to reduce DOM complexity */}
      <div className="hidden xl:block absolute top-1/4 left-[5%] animate-float-slow opacity-10">
        <PenTool size={40} className="text-blue-600" />
      </div>
      <div className="hidden xl:block absolute top-1/4 right-[5%] animate-float-medium opacity-10">
        <Star size={32} className="text-amber-600" />
      </div>
      <div className="hidden xl:block absolute bottom-1/4 left-[5%] animate-float opacity-10">
        <Award size={36} className="text-blue-600" />
      </div>
      <div className="hidden xl:block absolute bottom-1/4 right-[5%] animate-float-slow opacity-10">
        <BookMarked size={32} className="text-amber-600" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
              our
              <span className="font-serif italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3 pr-1">services</span>
            </h2>
          
            {/* Animated star */}
            <span
              className="absolute -right-6 -top-1 text-xl text-amber-500 not-italic"
              style={{
                animation: 'star-pulse 5s ease-in-out infinite'
              }}
            >
              ✦
            </span>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed text-center">
            Comprehensive guidance tailored to your unique academic journey
          </p>
        </div>

        {/* Main Content - Balanced 50/50 layout */}
        <div className="grid lg:grid-cols-2 gap-6">
         
          {/* Service Navigation - Left Side */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-6">
              <div className="space-y-2">
                {SERVICES_DATA.map((service, index) => {
                  const ServiceIcon = service.icon;
                  const isActive = activeService === service.id;
                  
                  return (
                    <div
                      key={service.id}
                      className={`
                        cursor-pointer p-3 rounded-xl border transition-all duration-300 transform will-change-transform
                        ${isActive
                          ? service.color === 'blue'
                            ? 'bg-blue-50 border-blue-200 shadow-md scale-102'
                            : 'bg-amber-50 border-amber-200 shadow-md scale-102'
                          : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:shadow-sm hover:scale-101'
                        }
                      `}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateX(${isVisible ? 0 : -20}px) ${isActive ? 'scale(1.02)' : 'scale(1)'}`,
                        transitionDelay: `${index * 0.08}s`
                      }}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Service Number */}
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${isActive
                              ? service.color === 'blue'
                                ? 'bg-blue-500 text-white shadow-blue-500/30'
                                : 'bg-amber-500 text-white shadow-amber-500/30'
                              : 'bg-gray-100 text-gray-600'
                            }
                            transition-all duration-300 shadow-md
                          `}
                        >
                          {String(service.id).padStart(2, '0')}
                        </div>

                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <ServiceIcon
                              size={14}
                              className={`
                                flex-shrink-0
                                ${isActive
                                  ? service.color === 'blue'
                                    ? 'text-blue-600'
                                    : 'text-amber-600'
                                  : 'text-gray-500'
                                }
                              `}
                            />
                            <h4
                              className={`
                                font-medium text-sm
                                ${isActive
                                  ? service.color === 'blue'
                                    ? 'text-blue-700'
                                    : 'text-amber-700'
                                  : 'text-gray-700'
                                }
                              `}
                            >
                              {service.title}
                            </h4>
                          </div>
                         
                          {/* Preview text for non-active services */}
                          {!isActive && (
                            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
                              {service.description.substring(0, 50)}...
                            </p>
                          )}
                        </div>

                        {/* Active indicator */}
                        <div className="flex-shrink-0">
                          {isActive ? (
                            <div
                              className={`
                                w-1 h-6 rounded-full
                                ${service.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}
                              `}
                            />
                          ) : (
                            <div className="w-1 h-6" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Service Content - Right Side */}
          <div className="order-1 lg:order-2">
            {activeServiceData && (
              <div
                key={activeService}
                className="rounded-[48px] p-2.5 bg-gradient-to-br from-blue-100 via-blue-50 to-amber-50 backdrop-blur-sm shadow-lg will-change-transform"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '0.2s'
                }}
              >
                <div className="relative bg-white rounded-[38px] p-8 shadow-xl border border-blue-200 overflow-hidden">
                  {/* Animated background glow effect */}
                  <div className="absolute inset-0 opacity-40">
                    <div
                      className={`absolute w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl ${isHovered ? 'animate-pulse-fast' : 'animate-pulse'}`}
                      style={{ top: '15%', left: '5%' }}
                    />
                    <div
                      className={`absolute w-1/3 h-1/3 bg-amber-100 rounded-full blur-3xl ${isHovered ? 'animate-pulse-fast' : 'animate-pulse'}`}
                      style={{ bottom: '15%', right: '10%' }}
                    />
                  </div>

                  <div className="relative z-10">
                    {/* Icon and Title */}
                    <div className="flex items-start space-x-4 mb-5">
                      <div
                        className={`
                          w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0
                          ${activeServiceData.color === 'blue'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30'
                            : 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30'
                          }
                        `}
                      >
                        {ActiveIcon && (
                          <ActiveIcon size={24} className="text-white" />
                        )}
                      </div>
                     
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl lg:text-3xl font-light text-gray-800 mb-2 leading-tight">
                          {activeServiceData.title}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</span>
                          <div
                            className={`
                              w-8 h-0.5 rounded-full
                              ${activeServiceData.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}
                            `}
                          />
                          <span
                            className={`
                              text-xs font-bold px-2 py-1 rounded-full
                              ${activeServiceData.color === 'blue'
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-amber-600 bg-amber-50'
                              }
                            `}
                          >
                            {String(activeServiceData.id).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description in styled container */}
                    <div className="bg-gray-50/80 rounded-3xl p-6 mb-6 border border-gray-100/50">
                      <p className="text-gray-700 text-base leading-relaxed font-light">
                        {activeServiceData.description}
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeServiceData.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check
                              size={14}
                              className={`
                                flex-shrink-0
                                ${activeServiceData.color === 'blue' ? 'text-blue-500' : 'text-amber-500'}
                              `}
                            />
                            <span className="text-sm text-gray-600 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Call to action */}
                    <div className="pt-5 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleGetStarted}
                          className={`
                            px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex-1 sm:flex-initial flex items-center justify-center space-x-2 will-change-transform
                            ${activeServiceData.color === 'blue'
                              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25'
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                            }
                            shadow-lg hover:shadow-xl transform hover:-translate-y-1
                          `}
                        >
                          <span>Get Started</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Service Dots */}
        <div className="lg:hidden mt-6 flex justify-center space-x-2">
          {SERVICES_DATA.map((service) => (
            <button
              key={service.id}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${activeService === service.id
                  ? service.color === 'blue'
                    ? 'bg-blue-500 scale-125 shadow-blue-500/30 shadow-lg'
                    : 'bg-amber-500 scale-125 shadow-amber-500/30 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400'
                }
              `}
              onClick={() => handleServiceSelect(service.id)}
            />
          ))}
        </div>
      </div>

      {/* CSS animations - Render once */}
      <style dangerouslySetInnerHTML={{ __html: CSS_STYLES }} />
    </section>
  );
}