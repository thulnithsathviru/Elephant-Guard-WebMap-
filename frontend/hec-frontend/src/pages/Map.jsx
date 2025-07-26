import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Layers, Zap, Sparkles, Eye, Globe } from 'lucide-react';

const Map = () => {
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
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)',
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`,
            transform: 'translate(50%, 50%)',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Map takes full screen minus navigation */}
      <div className="relative z-10 h-full pt-20">
        <MapComponent />
        
        {/* Enhanced Map Info Card */}
        <div className={`absolute bottom-6 left-6 z-[1000] transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            {/* Enhanced Glass background with better visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-black/70 backdrop-blur-2xl rounded-3xl border border-white/30 group-hover:border-white/40 transition-all duration-500 shadow-2xl"></div>
            
            {/* Additional glow for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-blue-500/20 rounded-2xl blur-md opacity-50 group-hover:opacity-70 transition-all duration-400"></div>

            <Card className="relative bg-transparent border-0 max-w-sm group-hover:scale-[1.03] transition-all duration-400">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white font-bold text-lg drop-shadow flex items-center">
                        GIS Data Visualization
                        <Globe className="w-4 h-4 ml-1 text-blue-400 animate-pulse" />
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-xl px-3 py-0.5 rounded-full text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Interactive
                      </Badge>
                    </div>

                    <p className="text-gray-200 text-sm leading-normal drop-shadow-sm text-justify">
                      Explore comprehensive Human-Elephant Conflict data across Sri Lanka. Use the layer controls to visualize different datasets including habitat areas, conflict density, and incident reports.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;

