import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu';
import { Button } from './ui/button';

interface NavItem {
  label: string;
  id: string;
}

// Memoized nav items to prevent recreation on every render
const NAV_ITEMS: NavItem[] = [
  { label: 'Home', id: 'home' },
  { label: 'Impact', id: 'impact' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Contact', id: 'contact' },
];

// Throttle utility for scroll events
const throttle = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  // Memoize computed values
  const isHomePage = useMemo(() => 
    location.pathname === '/' || location.pathname === '/home', 
    [location.pathname]
  );

  // Memoize scroll handler with throttling
  const handleScrollForBackground = useCallback(
    throttle(() => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    }, 16), // ~60fps
    []
  );

  // Memoize section tracking handler with throttling
  const handleSectionTracking = useCallback(
    throttle(() => {
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
    }, 16), // ~60fps
    []
  );

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

  // Handle scroll events for navbar background
  useEffect(() => {
    setScrolled(window.scrollY > 20);
    
    window.addEventListener('scroll', handleScrollForBackground, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScrollForBackground);
    };
  }, [location.pathname, handleScrollForBackground]);

  // Track sections on home page only
  useEffect(() => {
    if (!isHomePage) return;
    
    handleSectionTracking();
    window.addEventListener('scroll', handleSectionTracking, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleSectionTracking);
    };
  }, [isHomePage, handleSectionTracking]);

  // Memoize navigation handler
  const navigateToSection = useCallback((id: string) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
    setIsMobileMenuOpen(false);
  }, [isHomePage, navigate]);

  // Handle hash navigation when returning to home page
  useEffect(() => {
    if (isHomePage && location.hash) {
      const id = location.hash.substring(1);
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [location, isHomePage]);

  // Memoize mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Memoize navigation handlers
  const handleLogoClick = useCallback(() => {
    navigate('/');
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const handleBookClick = useCallback(() => {
    navigate('/book');
    setIsMobileMenuOpen(false);
  }, [navigate]);

  // Memoize class names to prevent recalculation
  const headerClassName = useMemo(() => 
    `w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
      (scrolled || !isHomePage)
        ? 'bg-white/95 backdrop-blur-md shadow-md shadow-blue-100/50 border-b border-blue-100'
        : 'bg-white/80 backdrop-blur-sm'
    }`, 
    [scrolled, isHomePage]
  );

  const navMenuClassName = useMemo(() => 
    `flex h-10 sm:h-12 items-center justify-center p-1 rounded-full shadow-lg shadow-blue-100/50 ${
      (scrolled || !isHomePage) ? 'bg-stone-100' : 'bg-white/80 backdrop-blur-sm'
    } border border-blue-100 hover:shadow-blue-200/50 transition-all duration-300 w-auto`,
    [scrolled, isHomePage]
  );

  const mobileMenuClassName = useMemo(() => 
    `fixed inset-0 bg-from-white to-gray-50/98 backdrop-blur-lg z-50 transform transition-all duration-300 ease-in-out ${
      isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
    }`,
    [isMobileMenuOpen]
  );

  return (
    <header className={headerClassName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center w-full h-16 sm:h-18 md:h-20">
          {/* Logo - Improved responsive container */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
          >
            <div className="relative h-10 sm:h-12 md:h-14 max-w-full overflow-visible">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto object-contain object-left max-w-[180px] sm:max-w-[200px] md:max-w-[240px] transition-all duration-300 hover:brightness-125 hover:scale-105"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* Desktop Navigation - Centered but not covering logo/button */}
          <div className="hidden md:flex items-center justify-center mx-auto">
            <NavigationMenu>
              <NavigationMenuList className={navMenuClassName}>
                {NAV_ITEMS.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      className={`relative flex justify-center px-2 md:px-3 lg:px-5 py-2 mx-0.5 cursor-pointer transition-all duration-300 rounded-full group text-xs sm:text-sm
                        ${(isHomePage && activeSection === item.id)
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                      onClick={() => navigateToSection(item.id)}
                      onKeyDown={(e) => e.key === 'Enter' && navigateToSection(item.id)}
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
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* CTA Button - Only visible on tablet and larger screens */}
          <Button
            onClick={handleBookClick}
            className="hidden md:flex h-8 sm:h-9 px-3 sm:px-4 md:px-5 bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300 rounded-full text-white text-xs sm:text-sm font-medium"
          >
            Book Free Meeting
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation - Enhanced with aesthetic matching contact card */}
      <div className={mobileMenuClassName}>
        {/* Background accents to match contact card aesthetics */}
        <div className="absolute top-[15%] right-[-5%] w-3/5 h-2/5 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-[-30%] right-[20%] w-1/2 h-1/2 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '22s' }}></div>
        <div className="absolute bottom-[15%] left-[-10%] w-3/4 h-2/4 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '22s' }}></div>
        
        <div className="flex flex-col h-full">
          {/* Mobile menu header with improved styling */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-100 bg-stone-100 relative z-10">
            {/* Improved mobile logo container with background */}
            <div
              className="flex items-center h-10 sm:h-12 bg-stone-100 rounded-lg cursor-pointer"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-auto object-contain object-left max-w-[150px] sm:max-w-[180px]"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <button
              className="text-amber-600 hover:text-blue-600 transition-all duration-300 p-2 hover:rotate-90 bg-stone-100 rounded-full"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Mobile menu items with improved aesthetic to match contact card */}
          <div className="flex flex-col justify-center flex-grow px-4 sm:px-6 py-8">
            <div>
              <div className="bg-stone-100 rounded-[28px] p-4 sm:p-6 border border-blue-200">
                {NAV_ITEMS.map((item, index) => (
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
          <div className="p-4 sm:p-6 border-t border-blue-100 bg-stone-100 relative z-10">
            <Button
              onClick={handleBookClick}
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