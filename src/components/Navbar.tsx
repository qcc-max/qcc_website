import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu';
import { Button } from './ui/button';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Check current page
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // IMPORTANT: Set initial scrolled state immediately when component mounts
  useEffect(() => {
    setScrolled(window.scrollY > 20);
    
    // Handle scroll events for navbar background
    const handleScrollForBackground = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    
    // Add event listener
    window.addEventListener('scroll', handleScrollForBackground);
    
    // Force a scroll event to ensure correct initial state
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScrollForBackground);
    };
  }, [location.pathname]); // Re-run when route changes

  // Track sections on home page only
  useEffect(() => {
    if (!isHomePage) return;
    
    
    const handleSectionTracking = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };
    
    // Set initial active section
    handleSectionTracking();
    
    // Add event listener for home page
    window.addEventListener('scroll', handleSectionTracking);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleSectionTracking);
    };
  }, [isHomePage]);

  // Handle navigation to sections
  const navigateToSection = (id: string) => {
    if (isHomePage) {
      // If already on home page, just scroll to the section
      scrollToSection(id);
    } else {
      // If on another page, navigate to home with section hash
      navigate(`/#${id}`);
    }
    setIsMobileMenuOpen(false);
  };

  // Smooth scrolling to sections
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Section with id "${id}" not found`);
    }
  };

  // Handle hash navigation when returning to home page
  useEffect(() => {
    if (isHomePage && location.hash) {
      // Remove the # from the hash to get the element id
      const id = location.hash.substring(1);
      // Use setTimeout to ensure the DOM is fully loaded
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    }
  }, [location, isHomePage]);

  // Nav items
  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Impact', id: 'impact' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md shadow-blue-100/50 border-b border-blue-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center w-full h-16 sm:h-18 md:h-20">
          {/* Logo - Improved responsive container */}
          <div
            className="flex items-center"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <div className="relative h-10 sm:h-12 md:h-14 max-w-full overflow-visible">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto object-contain object-left max-w-[180px] sm:max-w-[200px] md:max-w-[240px] transition-all duration-300 hover:brightness-125 hover:scale-105"
              />
            </div>
          </div>

          {/* Desktop Navigation - Centered but not covering logo/button */}
          <div className="hidden md:flex items-center justify-center mx-auto">
            <NavigationMenu>
              <NavigationMenuList className={`flex h-10 sm:h-12 items-center justify-center p-1 rounded-full shadow-lg shadow-blue-100/50 ${
                scrolled ? 'bg-white' : 'bg-white/80 backdrop-blur-sm'
              } border border-blue-100 hover:shadow-blue-200/50 transition-all duration-300 w-auto`}>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      className={`relative flex justify-center px-2 md:px-3 lg:px-5 py-2 mx-0.5 cursor-pointer transition-all duration-300 rounded-full group text-xs sm:text-sm
                        ${(isHomePage && activeSection === item.id)
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                      onClick={() => navigateToSection(item.id)}
                    >
                      <div className="font-medium leading-none">
                        {item.label}
                      </div>
                      {/* Highlight effect on hover */}
                      <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                        (isHomePage && activeSection === item.id) ? 'bg-amber-100' : 'bg-blue-100'
                      }`}></span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button - Moved to right corner */}
          <div className="flex md:hidden ml-auto">
            <button
              className="text-blue-600 hover:text-blue-500 transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* CTA Button - Only visible on tablet and larger screens */}
          <Button
            onClick={() => navigate('/book')}
            className="hidden md:flex h-8 sm:h-9 px-3 sm:px-4 md:px-5 bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300 rounded-full text-white text-xs sm:text-sm font-medium"
          >
            Book Free Meeting
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation - Enhanced with aesthetic matching contact card */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-white to-gray-50/98 backdrop-blur-lg z-50 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Background accents to match contact card aesthetics */}
        <div className="absolute top-[15%] right-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-[-30%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '22s' }}></div>
        <div className="absolute bottom-[15%] left-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '22s' }}></div>
        
        <div className="flex flex-col h-full">
          {/* Mobile menu header with improved styling */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-100 bg-white relative z-10">
            {/* Improved mobile logo container with background */}
            <div
              className="flex items-center h-10 sm:h-12 bg-white rounded-lg"
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto object-contain object-left max-w-[150px] sm:max-w-[180px]"
              />
            </div>
            
            <button
              className="text-amber-600 hover:text-blue-600 transition-all duration-300 p-2 hover:rotate-90 bg-white rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Mobile menu items with improved aesthetic to match contact card */}
          <div className="flex flex-col justify-center flex-grow px-4 sm:px-6 py-8">
            <div>
              <div className="bg-white rounded-[28px] p-4 sm:p-6 border border-blue-200">
                {navItems.map((item, index) => (
                  <div key={item.id} className="mb-1.5 last:mb-0">
                    <button
                      onClick={() => navigateToSection(item.id)}
                      className={`py-3 sm:py-4 text-center text-lg sm:text-xl w-full rounded-xl transition-all duration-300 transform
                        ${(isHomePage && activeSection === item.id)
                          ? 'text-amber-600 font-medium bg-amber-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        transitionDelay: `${index * 0.05}s`
                      }}
                    >
                      {item.label}
                      {(isHomePage && activeSection === item.id) && (
                        <span className="ml-2 text-xs inline-block">✦</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile footer CTA with gradient matching contact card */}
          <div className="p-4 sm:p-6 border-t border-blue-100 bg-white relative z-10">
            <Button
              onClick={() => {
                navigate('/book');
                setIsMobileMenuOpen(false);
              }}
              className="w-full h-12 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full text-base sm:text-lg font-medium transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200/50"
            >
              Book Free Meeting
            </Button>
            
            {/* Link bar with visual separator */}
            <div className="flex justify-center items-center mt-4 text-xs text-gray-500">
              <span className="mx-auto flex items-center">
                <span className="opacity-50">✦</span>
                <span className="mx-2 opacity-70">Q Catalan Counselling</span>
                <span className="opacity-50">✦</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
          
          .animate-pulse {
            animation: pulse-slow 8s ease-in-out infinite;
          }
        `}
      </style>
    </header>
  );
};