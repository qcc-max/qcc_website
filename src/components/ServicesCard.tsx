import React, { useState, useEffect, useRef } from 'react';
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

export default function ServicesCard() {
  const [activeService, setActiveService] = useState(1);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

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
      features: ["Personalized Assessment", "Strategic Roadmap", "Timeline Planning", "Goal Setting"]
    },
    {
      id: 2,
      title: "Essay Crafting",
      icon: Edit,
      description: "Our mentors from top universities guide you through the art of crafting compelling narratives that captivate admission officers. We help you identify your unique stories and refine your writing style.",
      color: "amber",
      features: ["Story Development", "Writing Refinement", "Multiple Drafts", "Expert Review"]
    },
    {
      id: 3,
      title: "Interview Preparation",
      icon: Users,
      description: "Master the art of impressive interviews with our comprehensive preparation program. We conduct mock interviews tailored to your target schools' specific formats and questions.",
      color: "blue",
      features: ["Mock Interviews", "Confidence Building", "Body Language", "Question Practice"]
    },
    {
      id: 4,
      title: "Academic Excellence",
      icon: Award,
      description: "Achieve your highest potential with our personalized academic support and test preparation strategies. Our expert tutors develop customized study plans targeting your specific areas for improvement.",
      color: "amber",
      features: ["Test Preparation", "Study Plans", "Progress Tracking", "Subject Mastery"]
    },
    {
      id: 5,
      title: "Portfolio Development",
      icon: Briefcase,
      description: "Stand out with a thoughtfully curated portfolio of meaningful activities. We help you identify and develop extracurricular pursuits that align with your academic interests.",
      color: "blue",
      features: ["Activity Curation", "Skills Showcase", "Project Guidance", "Achievement Documentation"]
    },
    {
      id: 6,
      title: "International Access",
      icon: Globe,
      description: "Navigate the complex landscape of international university admissions with our specialized guidance. We provide insights into country-specific application requirements and visa processes.",
      color: "amber",
      features: ["Visa Guidance", "Country Requirements", "Document Support", "Cultural Preparation"]
    },
    {
      id: 7,
      title: "Career Planning",
      icon: Lightbulb,
      description: "Discover the academic path that aligns with your strengths and aspirations. Our mentors help you explore various disciplines and understand career trajectories.",
      color: "blue",
      features: ["Path Exploration", "Career Mapping", "Industry Insights", "Future Planning"]
    },
  ];

  const activeServiceData = services.find(service => service.id === activeService);
  const ActiveIcon = activeServiceData?.icon;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 bg-stone-100 relative overflow-hidden"
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
        style={{
          background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent)`
        }}
      />

      {/* Floating elements */}
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
       {/* Updated Header to match AboutCard format */}
       <div className="flex items-center justify-center mb-8">
         <div className="relative">
           <h2 className="text-4xl md:text-5xl font-light text-gray-800 relative inline-block tracking-tight">
             our
             <span className="font-serif italic font-semibold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent ml-3 pr-1">services</span>
           </h2>
          
           {/* Animated star - matching the about card */}
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
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Select Service</h3>
              <div className="space-y-2">
                {services.map((service, index) => {
                  const ServiceIcon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className={`
                        cursor-pointer p-3 rounded-xl border transition-all duration-300 transform
                        ${activeService === service.id
                          ? service.color === 'blue'
                            ? 'bg-blue-50 border-blue-200 shadow-md scale-102'
                            : 'bg-amber-50 border-amber-200 shadow-md scale-102'
                          : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:shadow-sm hover:scale-101'
                        }
                      `}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateX(${isVisible ? 0 : -20}px) ${activeService === service.id ? 'scale(1.02)' : 'scale(1)'}`,
                        transitionDelay: `${index * 0.08}s`
                      }}
                      onClick={() => setActiveService(service.id)}
                      onMouseEnter={() => setHoveredService(service.id)}
                      onMouseLeave={() => setHoveredService(null)}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Service Number */}
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${activeService === service.id
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
                                ${activeService === service.id
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
                                ${activeService === service.id
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
                          {activeService !== service.id && (
                            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
                              {service.description.substring(0, 50)}...
                            </p>
                          )}
                        </div>

                        {/* Active indicator */}
                        <div className="flex-shrink-0">
                          {activeService === service.id ? (
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
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100/50 h-full"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: `translateY(${isVisible ? 0 : 20}px)`,
                  transition: 'all 0.5s ease-out'
                }}
              >
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

                {/* Description */}
                <div className="mb-5">
                  <p className="text-gray-700 text-base leading-relaxed font-light">
                    {activeServiceData.description}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mb-5">
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
                      className={`
                        px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex-1 sm:flex-initial flex items-center justify-center space-x-2
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
                    <button className="px-6 py-3 rounded-xl font-medium text-sm border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Service Dots */}
        <div className="lg:hidden mt-6 flex justify-center space-x-2">
          {services.map((service) => (
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
              onClick={() => setActiveService(service.id)}
            />
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
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
}