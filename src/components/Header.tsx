import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string, suiteId?: string) => void;
}

export default function Header({ currentView, setView }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticScrollTimeoutRef = useRef<any>(null);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Suites', id: 'suites-section' },
    { label: 'Facilities', id: 'facilities-section' },
    { label: 'Policy', id: 'policy' },
    { label: 'Cek Status', id: 'booking-status' }
  ];

  const setProgrammaticActiveSection = (id: string) => {
    setActiveSection(id);
    isProgrammaticScrollRef.current = true;
    
    if (programmaticScrollTimeoutRef.current) {
      clearTimeout(programmaticScrollTimeoutRef.current);
    }
    
    programmaticScrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1200); // 1.2s covers standard smooth scroll duration comfortably
  };

  useEffect(() => {
    if (currentView !== 'home') return;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollPos = window.scrollY + 250; // offset for sticky header + trigger threshold
      
      const suitesEl = document.getElementById('suites-section');
      const facilitiesEl = document.getElementById('facilities-section');
      
      let currentActive = 'home';
      
      if (facilitiesEl) {
        const facilitiesTop = facilitiesEl.offsetTop;
        if (scrollPos >= facilitiesTop) {
          currentActive = 'facilities-section';
        } else if (suitesEl) {
          const suitesTop = suitesEl.offsetTop;
          if (scrollPos >= suitesTop) {
            currentActive = 'suites-section';
          }
        }
      } else if (suitesEl) {
        const suitesTop = suitesEl.offsetTop;
        if (scrollPos >= suitesTop) {
          currentActive = 'suites-section';
        }
      }
      
      setActiveSection(currentActive);
    };

    // Calculate initial position on load / view change
    const timer = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentView]);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'suites-section' || id === 'facilities-section') {
      setProgrammaticActiveSection(id);
      if (currentView !== 'home') {
        setView('home');
        // Give React a tick to mount the home view before scrolling
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setView(id);
      if (id === 'home') {
        setProgrammaticActiveSection('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-[#F5ECE7]/95 backdrop-blur-md border-b border-[#D3C4B9]/50 text-[#1E1B18]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="font-serif text-xl md:text-2xl tracking-[0.25em] text-[#62462b] font-light">
            CASA DREAM
          </span>
          <span className="text-[9px] tracking-[0.45em] text-[#81756c] -mt-1 pl-0.5">
            VILLA SANCTUARY
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = currentView === 'home' ? activeSection === item.id : currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm tracking-[0.2em] uppercase transition-colors duration-300 font-light ${
                  isActive 
                    ? 'text-[#62462b] font-medium border-b-2 border-[#62462b]/85 pb-1' 
                    : 'text-[#4F453D] hover:text-[#62462b]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Booking CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            id="header-book-now-btn"
            onClick={() => {
              setView('suite-detail', 'casa-dream-villa');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-[#62462b] hover:bg-[#7c5d41] text-white font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-full flex items-center space-x-2 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#4F453D] hover:text-[#62462b] transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#F5ECE7] border-b border-[#D3C4B9]/50 shadow-2xl py-6 px-8 flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const isActive = currentView === 'home' ? activeSection === item.id : currentView === item.id;
              return (
                <button
                   key={item.id}
                   onClick={() => handleNavClick(item.id)}
                   className={`text-left text-sm tracking-[0.2em] uppercase py-2 border-b border-[#D3C4B9]/30 font-light ${
                     isActive ? 'text-[#62462b] font-medium' : 'text-[#4F453D]'
                   }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setView('suite-detail', 'casa-dream-villa');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 bg-[#62462b] hover:bg-[#7c5d41] text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-full flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Casa Dream Villa</span>
          </button>
        </div>
      )}
    </header>
  );
}
