import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import MapComponent from '../components/MapComponent';
import axios from 'axios';
import { createApiUrl } from '../config/api';
import { checkApiHealth } from '../config/healthCheck';
import { MapPin, Calendar, Clock, AlertTriangle, Camera, X, CheckCircle2, Search, Sparkles, Zap, Send } from 'lucide-react';

const Live = () => {
  const [showReportForm, setShowReportForm] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [refreshReports, setRefreshReports] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const searchRef = useRef(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle clicking outside search results
  useEffect(() => {
    setIsLoaded(true);
    
    // Check API health on component mount
    const checkApi = async () => {
      const isHealthy = await checkApiHealth();
      setApiAvailable(isHealthy);
    };
    checkApi();
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
    setShowSearchResults(false); // Hide search results when clicking on map
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      alert('Please select a location on the map first');
      return;
    }

    if (!apiAvailable) {
      alert('Backend service is currently unavailable. Cannot submit report.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const reportData = {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        report_type: formData.type,
        description: formData.description,
        date: formData.date,
        time: formData.time
      };

      const response = await axios.post(createApiUrl('/reports'), reportData);
      
      if (response.data.success) {
        setSubmitMessage('REPORT SUBMITTED SUCCESSFULLY');
        // Reset form after successful submission
        setTimeout(() => {
          setSelectedLocation(null);
          setFormData({ date: '', time: '', type: '', description: '' });
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitMessage('FAILED TO SUBMIT REPORT');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitMessage('ERROR SUBMITTING REPORT');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Using Nominatim API for geocoding (free OpenStreetMap service)
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: `${query}, Sri Lanka`,
          format: 'json',
          limit: 5,
          countrycodes: 'lk'
        }
      });

      const results = response.data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        place_id: item.place_id
      }));

      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleSelectSearchResult = (result) => {
    setMapCenter({ lat: result.lat, lng: result.lon });
    setSearchQuery(result.display_name.split(',')[0]); // Show just the main location name
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
    }
  };

  const reportTypes = [
    { value: 'sighting', label: 'Elephant Sighting', icon: '🐘' },
    { value: 'crop_damage', label: 'Crop Damage', icon: '🌾' },
    { value: 'property_damage', label: 'Property Damage', icon: '🏠' },
    { value: 'human_injury', label: 'Human Injury', icon: '🚑' },
    { value: 'elephant_injury', label: 'Elephant Injury', icon: '⚕️' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(245, 101, 101, 0.2) 50%, transparent 100%)',
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`,
            transform: 'translate(50%, 50%)',
            animationDelay: '1s',
          }}
        />
      </div>

      <div className="relative z-10 h-screen flex pt-20">\
        {/* Map Section */}
        <div className="flex-1 relative">
          {/* Enhanced Search Box */}
          <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] w-96 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`} ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="relative">
                {/* Enhanced Glass background with better visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-black/70 backdrop-blur-2xl rounded-2xl border border-white/30 group-hover:border-white/40 transition-all duration-300 shadow-2xl"></div>
                
                {/* Enhanced Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                <Input
                  type="text"
                  placeholder="Search for a location in Sri Lanka..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="relative bg-transparent border-0 text-white placeholder-gray-300 pr-12 pl-12 py-4 text-lg font-medium focus:ring-0"
                />
                
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
                
                {/* Search icon indicator */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              
              {/* Enhanced Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <div className="bg-gradient-to-br from-black/80 via-black/90 to-black/80 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={result.place_id}
                        type="button"
                        onClick={() => handleSelectSearchResult(result)}
                        className="w-full text-left px-6 py-4 text-white hover:bg-white/20 border-b border-white/10 last:border-b-0 transition-all duration-300 group/item"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl group-hover/item:from-blue-500/40 group-hover/item:to-purple-500/40 transition-all duration-300">
                            <MapPin className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-sm leading-relaxed">{result.display_name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          <MapComponent
            showUserReports={true}
            isReportMode={true}
            onMapClick={handleMapClick}
            selectedLocation={selectedLocation}
            mapCenter={mapCenter}
          />

          {/* Enhanced Instructions overlay */}
          {!selectedLocation && (
            <div className={`absolute bottom-6 left-6 z-[1000] transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative group">
                {/* Enhanced Glass background with better visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-black/70 backdrop-blur-2xl rounded-3xl border border-white/30 group-hover:border-white/40 transition-all duration-500 shadow-2xl"></div>
                
                {/* Additional glow for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/15 to-red-500/20 rounded-2xl blur-md opacity-50 group-hover:opacity-70 transition-all duration-400"></div>

                <Card className="relative bg-transparent border-0 max-w-sm group-hover:scale-[1.03] transition-all duration-400">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="p-2.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl shadow-md">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-red-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2 flex items-center drop-shadow">
                          Report an Incident
                          <Zap className="w-4 h-4 ml-1 text-yellow-400 animate-pulse" />
                        </h3>
                        <p className="text-gray-200 text-sm leading-normal drop-shadow-sm text-justify">
                          Click anywhere on the map to select a location and report an elephant sighting or conflict.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
            </div>
          )}
        </div>

        {/* Enhanced Report Form Section */}
        {showReportForm && (
          <div className="w-[28rem] relative">
            {/* Glass background for entire sidebar */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border-l border-white/10"></div>
            
            <div className="relative h-full overflow-y-auto">
              <div className="p-8 space-y-8">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                          REPORT
                        </h2>
                        <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text">
                          INCIDENT
                        </h3>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center px-4 py-2 bg-red-500/20 backdrop-blur-xl rounded-full border border-red-500/30">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-red-400 text-sm font-medium tracking-wide">Live Reporting</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Location Info */}
                {selectedLocation && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 backdrop-blur-xl rounded-2xl border border-blue-500/20"></div>
                    
                    <Card className="relative bg-transparent border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-lg font-bold mb-1">Selected Location</p>
                            <p className="text-gray-400 font-mono text-sm">
                              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Enhanced Date and Time */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-bold text-lg flex items-center">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-3">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        Date
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10"></div>
                        <Input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="relative bg-transparent border-0 text-white py-4 focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:filter"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white font-bold text-lg flex items-center">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-3">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        Time
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10"></div>
                        <Input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="relative bg-transparent border-0 text-white py-4 focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:filter"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-white font-bold text-lg flex items-center">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mr-3">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                      Incident Type
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10"></div>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger className="relative bg-transparent border-0 text-white py-4 focus:ring-0">
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl">
                          {reportTypes.map((type) => (
                            <SelectItem 
                              key={type.value} 
                              value={type.value}
                              className="text-white hover:bg-white/10 focus:bg-white/10 rounded-xl"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{type.icon}</span>
                                <span className="font-medium">{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced Description */}
                  <div className="space-y-3">
                    <Label className="text-white font-bold text-lg">Description</Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10"></div>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="relative bg-transparent border-0 text-white resize-none py-4 focus:ring-0"
                        placeholder="Provide detailed description of the incident or sighting..."
                        required
                      />
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 group-hover:blur-2xl transition-all duration-300"></div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative w-full bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-500/30 text-white hover:from-red-500/30 hover:to-orange-500/30 hover:border-red-400/50 py-6 rounded-2xl font-black text-lg transition-all duration-300 group-hover:scale-105"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>SUBMITTING...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Send className="w-5 h-5" />
                          <span>SUBMIT REPORT</span>
                          <Sparkles className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Enhanced Submit Message */}
                {submitMessage && (
                  <div className="relative group">
                    <div className={`absolute inset-0 backdrop-blur-xl rounded-2xl border ${
                      submitMessage.includes('SUCCESSFULLY') 
                        ? 'bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-500/5 border-emerald-500/20' 
                        : 'bg-gradient-to-br from-red-500/5 via-orange-500/5 to-red-500/5 border-red-500/20'
                    }`}></div>
                    
                    <Card className="relative bg-transparent border-0">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-2xl ${
                            submitMessage.includes('SUCCESSFULLY') 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                              : 'bg-gradient-to-r from-red-500 to-orange-600'
                          }`}>
                            {submitMessage.includes('SUCCESSFULLY') ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : (
                              <AlertTriangle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <span className={`font-black text-lg ${
                            submitMessage.includes('SUCCESSFULLY') ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {submitMessage}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
