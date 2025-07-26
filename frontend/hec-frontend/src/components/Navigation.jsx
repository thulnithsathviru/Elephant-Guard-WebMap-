import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/live', label: 'GO LIVE' },
    { path: '/map', label: 'MAP' },
    { path: '/about', label: 'ABOUT' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/20' 
        : 'bg-black/40 backdrop-blur-xl border-b border-white/5'
    }`}>
      {/* Dynamic background gradient following mouse */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(239, 68, 68, 0.1), rgba(245, 101, 101, 0.05), transparent 70%)`
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}>
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Logo container with glass effect */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-white/15 transition-all duration-300">
                <img 
                  src="/Logo.png" 
                  alt="Elephant Guard Logo" 
                  className="w-24 h-24 object-contain"
                />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            
            {/* Logo text with enhanced styling */}
            <div className="hidden sm:block">
              <span className="text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text font-black text-xl tracking-tight group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-300">
                ELEPHANT GUARD
              </span>
              <div className="h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Enhanced Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  {/* Glass background for active/hover state */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/30' 
                      : 'bg-white/0 group-hover:bg-white/5 group-hover:backdrop-blur-xl group-hover:border group-hover:border-white/10'
                  }`}></div>
                  
                  {/* Glowing effect for active item */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                  )}
                  
                  <Link
                    to={item.path}
                    className={`relative block px-4 py-2 font-bold text-xs tracking-widest transition-all duration-300 rounded-2xl ${
                      isActive
                        ? 'text-white scale-105 shadow-lg'
                        : 'text-gray-300 hover:text-white hover:scale-105'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                      !isActive ? 'opacity-0 group-hover:opacity-100 group-hover:bg-gradient-to-r group-hover:from-white/5 group-hover:to-white/10' : ''
                    }`}></div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

