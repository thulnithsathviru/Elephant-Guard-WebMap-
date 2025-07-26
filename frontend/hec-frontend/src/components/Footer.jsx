import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, MapPin, Shield, Heart, Globe, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/live', label: 'Go Live' },
    { path: '/map', label: 'Map' },
    { path: '/about', label: 'About' }
  ];

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/thulnithsathviru/Elephant-Guard', label: 'GitHub' },
    { icon: <Mail className="w-5 h-5" />, href: 'mailto:contact@elephantguard.lk', label: 'Email' },
    { icon: <Globe className="w-5 h-5" />, href: '#', label: 'Website' }
  ];

  return (
    <footer className="relative bg-gradient-to-t from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Mouse-following gradient */}
        <div 
          className="absolute w-[800px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.01}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[600px] h-[300px] rounded-full opacity-8 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(245, 101, 101, 0.1) 50%, transparent 100%)',
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.01}%`,
            transform: 'translate(50%, 50%)',
          }}
        />
      </div>

      {/* Glass border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="relative z-10">\
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Brand Section with Glass Effect */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Glass background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10"></div>
                
                <div className="relative p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl">
                        <img 
                          src="/Logo.png" 
                          alt="Elephant Guard Logo" 
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text font-black text-2xl tracking-tight">
                        ELEPHANT GUARD
                      </h3>
                      <p className="text-emerald-400 text-sm font-medium tracking-wide">Human-Elephant Conflict Management</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                    Protecting both humans and elephants through innovative technology and community engagement. 
                    Together, we can create a sustainable future where humans and elephants coexist peacefully.
                  </p>

                  {/* Mission Statement with Enhanced Glass */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 backdrop-blur-xl rounded-2xl border border-emerald-500/20"></div>
                    <div className="relative flex items-start space-x-4 p-6">
                      <div className="p-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-emerald-400 font-bold text-lg mb-2">Our Mission</h4>
                        <p className="text-gray-300 leading-relaxed">
                          Reducing human-elephant conflict through real-time monitoring and community-driven solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links with Glass Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10"></div>
              
              <div className="relative p-6">
                <h4 className="text-white font-black text-xl mb-6 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  Quick Links
                </h4>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-lg"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-4 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border-t border-white/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              
              {/* Copyright with Enhanced Design */}
              <div className="flex items-center space-x-3 text-gray-300 text-lg">
                <span>© {currentYear} Elephant Guard.</span>
              </div>

              {/* Enhanced Social Links */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-300 text-lg font-medium">Connect:</span>
                <div className="flex items-center space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      title={social.label}
                    >
                      {/* Glass background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 group-hover:from-white/10 group-hover:to-white/15 transition-all duration-300"></div>
                      
                      {/* Icon container */}
                      <div className="relative p-3 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
