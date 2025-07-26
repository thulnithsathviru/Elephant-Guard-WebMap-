import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, MapPin, AlertTriangle, Users, TreePine, Sparkles, Zap, Shield } from 'lucide-react';
import MapComponent from '../components/MapComponent';

// Custom component for home page map with HEC density enabled
const HomeMapComponent = () => {
  const [mapKey, setMapKey] = useState(0);
  
  useEffect(() => {
    // Force re-render to ensure map loads properly
    const timer = setTimeout(() => {
      setMapKey(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 z-10 pointer-events-none"></div>
      <MapComponent 
        key={mapKey} 
        initialVisibleLayers={{ hec_density: true }}
        showLayerControl={false}
        onlyShowSpecificLayers={['hec_density']}
      />
    </div>
  );
};

const Home = () => {
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

  const stats = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "Elephant Population",
      value: "7,000",
      description: "Highest density of Asian elephants globally",
      gradient: "from-emerald-400/20 via-emerald-500/20 to-teal-600/20",
      iconGradient: "from-emerald-400 to-teal-500",
      sparkle: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-emerald-400" />
    },
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: "Annual Elephant Deaths",
      value: "300-400",
      description: "Critical conservation concern",
      gradient: "from-red-400/20 via-orange-500/20 to-red-600/20",
      iconGradient: "from-red-400 to-orange-500",
      sparkle: <Zap className="w-4 h-4 absolute -top-1 -right-1 text-red-400" />
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Annual Human Deaths",
      value: "80-100",
      description: "Lives lost due to conflict",
      gradient: "from-amber-400/20 via-orange-500/20 to-red-500/20",
      iconGradient: "from-amber-400 to-orange-500",
      sparkle: <Shield className="w-4 h-4 absolute -top-1 -right-1 text-amber-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(139, 69, 19, 0.2) 50%, transparent 100%)',
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`,
            transform: 'translate(50%, 50%)',
            animationDelay: '1s',
          }}
        />
        <div 
          className="absolute w-[1000px] h-[400px] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(245, 101, 101, 0.1) 50%, transparent 100%)',
            left: '50%',
            top: `${mousePosition.y * 0.01 + 30}%`,
            transform: 'translate(-50%, -50%)',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Video Background with reduced overlay */}
        <div className="absolute inset-0 z-10">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-70"
          >
            <source src="/Background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.05),transparent_70%)]"></div>
        </div>
        
        <div className={`relative z-20 max-w-7xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          
          {/* Enhanced Title */}
          <div className="space-y-6 mb-12">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
              <span className="block text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text drop-shadow-2xl">
                ELEPHANT
              </span>
              <span className="block text-transparent bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text">
                GUARD
              </span>
            </h1>
            
            {/* Enhanced Subtitle with Dynamic Glass Effects */}
            <div className="relative mx-auto max-w-6xl group">
              {/* Multi-layered glass effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/20 to-red-500/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent rounded-2xl backdrop-blur-xl border border-white/15 group-hover:border-white/25 transition-all duration-400"></div>

              <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                {/* Main description with enhanced typography */}
                <p className="text-lg sm:text-xl md:text-2xl text-transparent bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text font-semibold leading-snug mb-4">
                  Advanced GIS platform for monitoring and managing
                  <span className="inline-block mx-2 px-3 py-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-lg border border-red-400/30 text-red-300 font-bold">
                    Human-Elephant Conflict
                  </span>
                  in Sri Lanka
                </p>
              </div>
              
              {/* Bottom glow effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full opacity-60 group-hover:opacity-100 group-hover:w-48 transition-all duration-700"></div>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/live" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl group-hover:blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                <Button className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl border border-red-400/20 backdrop-blur-xl hover:scale-105 transition-all duration-300 group-hover:shadow-red-500/50">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>REPORT SIGHTING</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </div>
            </Link>
            
            <Link to="/map" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Button className="relative bg-white/5 hover:bg-white/10 text-white px-8 py-4 text-lg font-bold rounded-2xl backdrop-blur-xl border border-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 group-hover:shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <span>EXPLORE MAP</span>
                  </div>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section with Glass Morphism */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-16"></div>
              <div className="mx-4 px-4 py-2 bg-red-500/10 backdrop-blur-xl rounded-full border border-red-500/20">
                <span className="text-red-400 text-sm font-medium tracking-wide">IMPACT METRICS</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-16"></div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text mb-6 leading-tight">
              Critical Statistics
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
                Understanding the scale of Human-Elephant Conflict in Sri Lanka through 
                <span className="text-white font-medium"> data-driven insights</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`group transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative h-full">
                  {/* Glass card background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                  
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                  
                  <Card className="relative bg-transparent border-0 h-full group-hover:scale-105 transition-all duration-500">
                    <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                      {/* Icon */}
                      <div className="relative mb-8">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.iconGradient} shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <div className="text-white">
                            {stat.icon}
                          </div>
                        </div>
                        {stat.sparkle}
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4 flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                          {stat.title}
                        </h3>
                        
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text">
                          {stat.value}
                        </div>
                        
                        <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                          {stat.description}
                        </p>
                      </div>
                      
                      {/* Bottom indicator */}
                      <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full group-hover:via-white/40 transition-all duration-500"></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HEC Monitoring & Live Data Section with Advanced Glass Effects */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Enhanced Design */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-3xl rounded-full"></div>
              <h2 className="relative text-5xl sm:text-6xl md:text-7xl font-black leading-tight">
                <span className="block text-transparent bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text">
                  HEC
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl text-gray-300 mt-2 font-medium tracking-wider">
                  MONITORING SYSTEM
                </span>
              </h2>
            </div>
            
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-full mx-auto mb-8 animate-pulse"></div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
                Advanced GIS platform combining 
                <span className="text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text font-semibold"> Human-Elephant Conflict data analysis </span>
                with real-time density visualization for comprehensive wildlife conservation management
              </p>
            </div>
          </div>

          {/* Main Content Grid with Glass Morphism */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - HEC Information with Glass Cards */}
            <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
                  Understanding the Crisis
                </h3>
                
                <div className="relative group">
                  {/* Glass background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                  
                  <Card className="relative bg-transparent border-0 group-hover:scale-[1.02] transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <p className="text-gray-300 text-lg leading-relaxed">
                          Human-Elephant Conflict (HEC) represents one of the most pressing conservation challenges 
                          in Asia and Africa. As human settlements expand into traditional elephant habitats, 
                          these magnificent creatures are forced to navigate through human-dominated landscapes 
                          in search of food and space.
                        </p>
                        
                        {/* Highlighted section with glass effect */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 backdrop-blur-xl rounded-2xl"></div>
                          <div className="relative border-l-4 border-gradient-to-b from-red-400 to-orange-500 pl-6 py-4">
                            <p className="text-gray-300 text-lg leading-relaxed">
                              In Sri Lanka, this crisis is particularly acute, with over 
                              <span className="inline-flex items-center mx-2 px-3 py-1 bg-red-500/20 backdrop-blur-xl rounded-full border border-red-500/30 text-red-300 font-bold text-sm">
                                300 elephants
                              </span> 
                              and approximately 
                              <span className="inline-flex items-center mx-2 px-3 py-1 bg-orange-500/20 backdrop-blur-xl rounded-full border border-orange-500/30 text-orange-300 font-bold text-sm">
                                100 people
                              </span> 
                              dying annually due to conflict. This threatens both rural livelihoods and elephant conservation efforts.
                            </p>
                          </div>
                        </div>

                        {/* Solution highlight with enhanced glass */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 backdrop-blur-xl rounded-2xl border border-emerald-500/20"></div>
                          <div className="relative p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="p-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-emerald-400 font-bold text-lg">Our Solution</h4>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                              Real-time monitoring, data-driven insights, and community engagement to reduce conflict 
                              incidents while protecting both elephants and human communities.
                            </p>
                          </div>
                        </div>

                        {/* CTA Button with glass effect */}
                        <div className="pt-6">
                          <Link to="/map" className="group">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl group-hover:blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                              <Button className="relative w-full bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/30 text-white hover:from-red-500/30 hover:to-orange-500/30 hover:border-red-400/50 py-4 rounded-2xl font-bold transition-all duration-300 group-hover:scale-105">
                                <div className="flex items-center justify-center space-x-3">
                                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                  <span>Explore Full Interactive Map</span>
                                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                              </Button>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Live Density Data with Glass Map */}
            <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white">
                      HEC Density Map
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-gray-400 leading-relaxed">
                  Interactive conflict hotspot visualization powered by 
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold"> GIS technology</span>. 
                  Monitor current density patterns and identify high-risk areas for proactive intervention.
                </p>
              </div>

              {/* Enhanced Map Container with Glass Effect */}
              <div className="relative group">
                {/* Glass background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                
                <Card className="relative bg-transparent border-0 overflow-hidden group-hover:scale-[1.02] transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="relative h-[500px]">
                      {/* Map component with enhanced overlay */}
                      <HomeMapComponent />
                      
                      {/* Enhanced Live Data Indicator */}
                      <div className="absolute top-6 left-6 z-20">
                        <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-4 border border-red-500/30 shadow-2xl">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="relative">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            </div>
                            <span className="text-red-400 font-bold text-sm tracking-wide">LIVE HEC DATA</span>
                          </div>
                          <p className="text-gray-300 text-xs">
                            Click areas for density details
                          </p>
                        </div>
                      </div>
                      
                      {/* Enhanced Legend */}
                      <div className="absolute bottom-6 right-6 z-20">
                        <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-2xl">
                          <div className="text-xs text-gray-300 space-y-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                              <span className="font-medium">High Density</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                              <span className="font-medium">Medium Density</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                              <span className="font-medium">Low Density</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating action button */}
                      <div className="absolute bottom-6 left-6 z-20">
                        <Link to="/map" className="group">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl group-hover:blur-2xl opacity-60 transition-all duration-300"></div>
                            <Button className="relative bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 text-white hover:from-blue-500/30 hover:to-purple-600/30 p-3 rounded-full group-hover:scale-110 transition-all duration-300">
                              <ArrowRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

