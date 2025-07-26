import React, { useState, useEffect } from 'react';
import { Linkedin, MessageCircle, Instagram, GraduationCap, MapPin, Award, Sparkles, Code, Database, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const technologies = [
    { icon: <Code className="w-6 h-6" />, name: "React & JavaScript", color: "from-blue-400 to-cyan-500" },
    { icon: <Database className="w-6 h-6" />, name: "GIS & Remote Sensing", color: "from-emerald-400 to-teal-500" },
    { icon: <Globe className="w-6 h-6" />, name: "Spatial Analysis", color: "from-purple-400 to-pink-500" }
  ];

  const achievements = [
    "Real-time conflict monitoring and reporting",
    "Data-driven conservation planning",
    "Community engagement and awareness",
    "Evidence-based policy recommendations"
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(139, 69, 19, 0.2) 50%, transparent 100%)',
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`,
            transform: 'translate(50%, 50%)',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-16"></div>
              <div className="mx-4 px-6 py-3 bg-blue-500/10 backdrop-blur-xl rounded-full border border-blue-500/20">
                <span className="text-blue-400 text-sm font-medium tracking-wide">🎓 ACADEMIC PROJECT</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-16"></div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-8">
              <span className="block text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text">
                ABOUT
              </span>
              <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text">
                THE PROJECT
              </span>
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-8 animate-pulse"></div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Profile Card - Enhanced */}
            <div className={`lg:col-span-1 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="relative group">
                {/* Glass background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                
                <Card className="relative bg-transparent border-0 overflow-hidden group-hover:scale-[1.02] transition-all duration-500">
                  <CardContent className="p-0">
                    {/* Profile Image Section */}
                    <div className="relative h-80 overflow-hidden rounded-t-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                      <img 
                        src="https://i.ibb.co/CsJQDPxF/tss.png" 
                        alt="Thulnith Sathviru" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Floating badges */}
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-300">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Planning Student
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 z-20">
                        <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Profile Info Section */}
                    <div className="p-8 space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text mb-2">
                          Thulnith Sathviru
                        </h3>
                        <p className="text-gray-400 flex items-center justify-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>University of Moratuwa</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20">
                        <Award className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300 font-medium">Town & Country Planning</span>
                      </div>
                      
                      {/* Social Links */}
                      <div className="flex justify-center space-x-3 pt-4">
                        {[
                          { icon: <Linkedin className="w-5 h-5" />, color: "from-blue-500 to-blue-600", label: "LinkedIn" },
                          { icon: <MessageCircle className="w-5 h-5" />, color: "from-green-500 to-green-600", label: "WhatsApp" },
                          { icon: <Instagram className="w-5 h-5" />, color: "from-pink-500 to-pink-600", label: "Instagram" }
                        ].map((social, index) => (
                          <div key={index} className="group/social relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-2xl blur-xl opacity-60 group-hover/social:opacity-80 group-hover/social:blur-2xl transition-all duration-300`}></div>
                            <Button 
                              className={`relative bg-gradient-to-r ${social.color}/20 backdrop-blur-xl border border-white/20 text-white hover:scale-110 transition-all duration-300 p-3 rounded-2xl`}
                              title={social.label}
                            >
                              {social.icon}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Content Sections */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Introduction Section */}
              <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                  
                  <Card className="relative bg-transparent border-0 group-hover:scale-[1.02] transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white">About Me</h2>
                      </div>
                      
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Hi, I'm <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text font-bold">Thulnith</span> — an undergraduate in 
                        <span className="text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text font-bold"> Town & Country Planning</span> at the University of Moratuwa, 
                        Sri Lanka. I'm passionate about using spatial data and technology to solve real-world challenges 
                        in regional planning and environmental conservation.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Project Description */}
              <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                  
                  <Card className="relative bg-transparent border-0 group-hover:scale-[1.02] transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white">Project Overview</h2>
                      </div>
                      
                      <p className="text-gray-300 text-lg leading-relaxed">
                        This project was developed as part of the <span className="text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text font-bold">Advanced GIS and Remote Sensing</span> module, 
                        with a focus on Human-Elephant Conflict (HEC) — a pressing issue that impacts both rural livelihoods and 
                        wildlife in Sri Lanka. Through this interactive platform, my goal is to visualize patterns of 
                        conflict, empower public participation, and support data-driven planning decisions that promote 
                        coexistence between humans and elephants.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

