import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { ChevronRight, Check } from 'lucide-react';
import { createApiUrl } from '../config/api';
import { checkApiHealth, showApiUnavailableMessage } from '../config/healthCheck';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LayerControl = ({ layers, visibleLayers, onLayerToggle }) => {
  const [expandedSections, setExpandedSections] = useState({
    humanDeaths: false,
    elephantDeaths: false,
    other: true
  });

  // Group layers by type
  const humanDeathLayers = layers.filter(layer => layer.name.startsWith('human_deaths_'));
  const elephantDeathLayers = layers.filter(layer => layer.name.startsWith('elephant_deaths_'));
  const otherLayers = layers.filter(layer => 
    !layer.name.startsWith('human_deaths_') && !layer.name.startsWith('elephant_deaths_')
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleAllYearsForType = (layerType, checked) => {
    const layersToToggle = layerType === 'human' ? humanDeathLayers : elephantDeathLayers;
    layersToToggle.forEach(layer => {
      if (visibleLayers[layer.name] !== checked) {
        onLayerToggle(layer.name);
      }
    });
  };

  const getYearsFromLayers = (layerList) => {
    return layerList.map(layer => {
      const match = layer.name.match(/_(\d{4})$/);
      return match ? match[1] : '';
    }).filter(Boolean).sort();
  };

  const isAnyYearVisible = (layerType) => {
    const layersToCheck = layerType === 'human' ? humanDeathLayers : elephantDeathLayers;
    return layersToCheck.some(layer => visibleLayers[layer.name]);
  };

  return (
    <div className="layer-control absolute top-4 right-4 z-[1000] max-w-xs">
      <div className="relative group">
        {/* Enhanced Glass background with better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-black/70 backdrop-blur-2xl rounded-3xl border border-white/30 group-hover:border-white/40 transition-all duration-500 shadow-2xl"></div>
        
        {/* Additional glow for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-blue-500/15 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
        
        <div className="relative p-6">
          <h3 className="text-white font-black text-xl mb-6 text-center drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text">
            Map Layers
          </h3>
          
          {/* Human Deaths Section */}
          {humanDeathLayers.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => toggleSection('humanDeaths')}
                  className="flex items-center text-white text-sm font-bold hover:text-red-300 transition-all duration-300 group/button"
                >
                  <ChevronRight 
                    className={`mr-3 w-4 h-4 transform transition-transform duration-300 text-red-400 ${expandedSections.humanDeaths ? 'rotate-90' : ''}`}
                  />
                  <span className="drop-shadow-md">Human Deaths</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAllYearsForType('human', true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-white/10 font-medium"
                    title="Show all years"
                  >
                    All
                  </button>
                  <button
                    onClick={() => toggleAllYearsForType('human', false)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-white/10 font-medium"
                    title="Hide all years"
                  >
                    None
                  </button>
                </div>
              </div>
              
              {expandedSections.humanDeaths && (
                <div className="ml-6 grid grid-cols-3 gap-2">
                  {getYearsFromLayers(humanDeathLayers).map(year => {
                    const layerName = `human_deaths_${year}`;
                    const isChecked = visibleLayers[layerName] || false;
                    return (
                      <label key={layerName} className="flex items-center cursor-pointer group/checkbox hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
                        <div className="relative mr-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onLayerToggle(layerName)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all duration-300 ${
                            isChecked 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 shadow-lg' 
                              : 'border-red-400/50 bg-white/5 hover:border-red-400 hover:bg-white/10'
                          }`}>
                            {isChecked && (
                              <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 transform scale-75" />
                            )}
                          </div>
                        </div>
                        <span className="text-white text-xs font-medium group-hover/checkbox:text-red-300 transition-colors duration-300">{year}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              
              {!expandedSections.humanDeaths && isAnyYearVisible('human') && (
                <div className="ml-6 text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 backdrop-blur-xl">
                  <span className="font-medium">{getYearsFromLayers(humanDeathLayers).filter(year => 
                    visibleLayers[`human_deaths_${year}`]
                  ).join(', ')} visible</span>
                </div>
              )}
            </div>
          )}

          {/* Elephant Deaths Section */}
          {elephantDeathLayers.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => toggleSection('elephantDeaths')}
                  className="flex items-center text-white text-sm font-bold hover:text-orange-300 transition-all duration-300 group/button"
                >
                  <ChevronRight 
                    className={`mr-3 w-4 h-4 transform transition-transform duration-300 text-orange-400 ${expandedSections.elephantDeaths ? 'rotate-90' : ''}`}
                  />
                  <span className="drop-shadow-md">Elephant Deaths</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAllYearsForType('elephant', true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-white/10 font-medium"
                    title="Show all years"
                  >
                    All
                  </button>
                  <button
                    onClick={() => toggleAllYearsForType('elephant', false)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-white/10 font-medium"
                    title="Hide all years"
                  >
                    None
                  </button>
                </div>
              </div>
              
              {expandedSections.elephantDeaths && (
                <div className="ml-6 grid grid-cols-3 gap-2">
                  {getYearsFromLayers(elephantDeathLayers).map(year => {
                    const layerName = `elephant_deaths_${year}`;
                    const isChecked = visibleLayers[layerName] || false;
                    return (
                      <label key={layerName} className="flex items-center cursor-pointer group/checkbox hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
                        <div className="relative mr-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onLayerToggle(layerName)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all duration-300 ${
                            isChecked 
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400 shadow-lg' 
                              : 'border-orange-400/50 bg-white/5 hover:border-orange-400 hover:bg-white/10'
                          }`}>
                            {isChecked && (
                              <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 transform scale-75" />
                            )}
                          </div>
                        </div>
                        <span className="text-white text-xs font-medium group-hover/checkbox:text-orange-300 transition-colors duration-300">{year}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              
              {!expandedSections.elephantDeaths && isAnyYearVisible('elephant') && (
                <div className="ml-6 text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 backdrop-blur-xl">
                  <span className="font-medium">{getYearsFromLayers(elephantDeathLayers).filter(year => 
                    visibleLayers[`elephant_deaths_${year}`]
                  ).join(', ')} visible</span>
                </div>
              )}
            </div>
          )}

          {/* Other Layers Section */}
          {otherLayers.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <button
                  onClick={() => toggleSection('other')}
                  className="flex items-center text-white text-sm font-bold hover:text-blue-300 transition-all duration-300 group/button"
                >
                  <ChevronRight 
                    className={`mr-3 w-4 h-4 transform transition-transform duration-300 text-blue-400 ${expandedSections.other ? 'rotate-90' : ''}`}
                  />
                  <span className="drop-shadow-md">Other Layers</span>
                </button>
              </div>
              
              {expandedSections.other && (
                <div className="ml-6 space-y-2">
                  {otherLayers.map((layer) => {
                    const isChecked = visibleLayers[layer.name] || false;
                    return (
                      <label key={layer.name} className="flex items-center cursor-pointer group/checkbox hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
                        <div className="relative mr-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onLayerToggle(layer.name)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all duration-300 ${
                            isChecked 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 shadow-lg' 
                              : 'border-blue-400/50 bg-white/5 hover:border-blue-400 hover:bg-white/10'
                          }`}>
                            {isChecked && (
                              <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 transform scale-75" />
                            )}
                          </div>
                        </div>
                        <span className="text-white text-sm font-medium group-hover/checkbox:text-blue-300 transition-colors duration-300">{layer.displayName}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MapClickHandler = ({ onMapClick, isReportMode }) => {
  useMapEvents({
    click: (e) => {
      if (isReportMode && onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const MapComponent = ({ 
  showUserReports = false, 
  isReportMode = false, 
  onMapClick = null,
  selectedLocation = null,
  mapCenter = null,
  refreshReports = 0, // Add this prop to trigger refresh
  initialVisibleLayers = {}, // Add prop for initial layer visibility
  showLayerControl = true, // Add prop to control layer control visibility
  onlyShowSpecificLayers = [], // Add prop to only show specific layers
  reportFilters = {} // Add prop for filtering reports
}) => {
  const [layers, setLayers] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState({});
  const [layerData, setLayerData] = useState({});
  const [userReports, setUserReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const mapRef = useRef();

  // Available layers configuration
  const availableLayers = [
    // Human deaths by year (2018-2022) - Red color scheme
    { name: 'human_deaths_2018', displayName: 'Human Deaths 2018', color: '#000000ff' },
    { name: 'human_deaths_2019', displayName: 'Human Deaths 2019', color: '#000000ff' },
    { name: 'human_deaths_2020', displayName: 'Human Deaths 2020', color: '#000000ff' },
    { name: 'human_deaths_2021', displayName: 'Human Deaths 2021', color: '#000000ff' },
    { name: 'human_deaths_2022', displayName: 'Human Deaths 2022', color: '#000000ff' },
    
    // Elephant deaths by year (2018-2023) - Orange/Yellow color scheme  
    { name: 'elephant_deaths_2018', displayName: 'Elephant Deaths 2018', color: '#ff0000ff' },
    { name: 'elephant_deaths_2019', displayName: 'Elephant Deaths 2019', color: '#ff0000ff' },
    { name: 'elephant_deaths_2020', displayName: 'Elephant Deaths 2020', color: '#ff0000ff' },
    { name: 'elephant_deaths_2021', displayName: 'Elephant Deaths 2021', color: '#ff0000ff' },
    { name: 'elephant_deaths_2022', displayName: 'Elephant Deaths 2022', color: '#ff0000ff' },
    { name: 'elephant_deaths_2023', displayName: 'Elephant Deaths 2023', color: '#ff0000ff' },
    
    { name: 'hec_density', displayName: 'HEC Density', color: '#DC2626' },
    { name: 'forest_cover', displayName: 'Forest Cover', color: '#047857' },
    { name: 'habitat_1960', displayName: 'Habitat 1960', color: '#F59E0B' },
    { name: 'habitat_2020', displayName: 'Habitat 2020', color: '#D97706' },
    { name: 'forests', displayName: 'Forests', color: '#059669' },
    { name: 'dsds', displayName: 'Divisional Secretariats', color: '#10B981' },
    { name: 'districts', displayName: 'Districts', color: '#3B82F6' }
  ];

  // Sri Lanka center coordinates
  const sriLankaCenter = [7.8731, 80.7718];

  useEffect(() => {
    const initializeApp = async () => {
      // Check API health first
      const isApiHealthy = await checkApiHealth();
      setApiAvailable(isApiHealthy);
      
      if (!isApiHealthy) {
        showApiUnavailableMessage();
        setLoading(false);
        return;
      }
      
      // If API is available, fetch data
      fetchAvailableLayers();
      if (showUserReports) {
        fetchUserReports();
      }
    };
    
    initializeApp();
  }, [showUserReports]);

  // Handle map center changes from search
  useEffect(() => {
    if (mapCenter && mapRef.current) {
      mapRef.current.setView([mapCenter.lat, mapCenter.lng], 13);
    }
  }, [mapCenter]);

  // Handle refresh of user reports
  useEffect(() => {
    if (showUserReports && refreshReports > 0) {
      fetchUserReports();
    }
  }, [refreshReports, showUserReports]);

  const fetchAvailableLayers = async () => {
    try {
      const response = await axios.get(createApiUrl('/layers'));
      if (response.data.success) {
        const availableLayerNames = response.data.layers;
        
        // Filter layers based on what's available from the API
        let filteredLayers = availableLayers.filter(layer => {
          // For year-specific death layers, check if the base layer exists
          const isYearSpecificLayer = layer.name.match(/^(human_deaths|elephant_deaths)_(\d{4})$/);
          if (isYearSpecificLayer) {
            const [, baseLayerName] = isYearSpecificLayer;
            return availableLayerNames.includes(baseLayerName);
          }
          // For other layers, check directly
          return availableLayerNames.includes(layer.name);
        });
        
        // If only specific layers should be shown, filter further
        if (onlyShowSpecificLayers.length > 0) {
          filteredLayers = filteredLayers.filter(layer => 
            onlyShowSpecificLayers.includes(layer.name)
          );
        }
        
        setLayers(filteredLayers);
        
        // Initialize visible layers (merge with initial visibility prop)
        const initialVisibility = {};
        filteredLayers.forEach(layer => {
          initialVisibility[layer.name] = initialVisibleLayers[layer.name] || false;
        });
        setVisibleLayers(initialVisibility);
        
        // Fetch initial visible layers data
        Object.keys(initialVisibleLayers).forEach(layerName => {
          if (initialVisibleLayers[layerName] && !layerData[layerName]) {
            fetchLayerData(layerName);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching layers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReports = async () => {
    try {
      const response = await axios.get(createApiUrl('/reports'));
      if (response.data.success) {
        setUserReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const fetchLayerData = async (layerName) => {
    try {
      // Check if this is a year-specific death layer
      const isYearSpecificLayer = layerName.match(/^(human_deaths|elephant_deaths)_(\d{4})$/);
      
      if (isYearSpecificLayer) {
        const [, layerType, year] = isYearSpecificLayer;
        const baseLayerName = layerType; // 'human_deaths' or 'elephant_deaths'
        
        // Fetch the base layer data
        const response = await axios.get(createApiUrl(`/layers/${baseLayerName}`));
        if (response.data.success) {
          // Filter the data based on the year and layer type
          const filteredData = {
            ...response.data.data,
            features: response.data.data.features.filter(feature => {
              const layerValue = feature.properties.layer;
              if (!layerValue) return false;
              
              // Check if the layer value matches the expected format
              const expectedPattern = layerType === 'human_deaths' ? `${year}HUM` : `${year}ELE`;
              return layerValue === expectedPattern;
            })
          };
          
          setLayerData(prev => ({
            ...prev,
            [layerName]: filteredData
          }));
        }
      } else {
        // For non-year-specific layers, fetch normally
        const response = await axios.get(createApiUrl(`/layers/${layerName}`));
        if (response.data.success) {
          setLayerData(prev => ({
            ...prev,
            [layerName]: response.data.data
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching layer ${layerName}:`, error);
    }
  };

  const handleLayerToggle = (layerName) => {
    setVisibleLayers(prev => {
      const newVisibility = {
        ...prev,
        [layerName]: !prev[layerName]
      };
      
      // Fetch data if layer is being turned on and we don't have data yet
      if (newVisibility[layerName] && !layerData[layerName]) {
        fetchLayerData(layerName);
      }
      
      return newVisibility;
    });
  };

  const getHecDensityColor = (properties) => {
    // Common property names that might contain density information
    const possibleDensityProps = ['level'];
    
    let densityValue = null;
    
    // Try to find the density property
    for (const prop of possibleDensityProps) {
      if (properties[prop] !== undefined && properties[prop] !== null) {
        densityValue = properties[prop];
        break;
      }
    }
    
    // If no specific property found, check for numeric properties
    if (densityValue === null) {
      const numericProps = Object.keys(properties).filter(key => 
        typeof properties[key] === 'number' || 
        (typeof properties[key] === 'string' && !isNaN(Number(properties[key])))
      );
      if (numericProps.length > 0) {
        densityValue = properties[numericProps[0]];
      }
    }
    
    // Convert to number if it's a string
    if (typeof densityValue === 'string') {
      const numValue = Number(densityValue);
      if (!isNaN(numValue)) {
        densityValue = numValue;
      }
    }
    
    // Color scheme for 5 density levels (lightest to darkest red)
    const colorScheme = [
      '#FEE2E2', // Very light red - Level 1 (lowest density)
      '#FECACA', // Light red - Level 2
      '#F87171', // Medium red - Level 3
      '#EF4444', // Dark red - Level 4
      '#DC2626'  // Very dark red - Level 5 (highest density)
    ];
    
    // If we have a numeric value, determine the color based on value
    if (typeof densityValue === 'number') {
      if (densityValue <= 1) return colorScheme[0];
      else if (densityValue <= 2) return colorScheme[1];
      else if (densityValue <= 3) return colorScheme[2];
      else if (densityValue <= 4) return colorScheme[3];
      else return colorScheme[4];
    }
    
    // If we have a string value, try to map it to a level
    if (typeof densityValue === 'string') {
      const lowerValue = densityValue.toLowerCase();
      if (lowerValue.includes('1') || lowerValue.includes('low') || lowerValue.includes('very low')) return colorScheme[0];
      else if (lowerValue.includes('2') || lowerValue.includes('medium low')) return colorScheme[1];
      else if (lowerValue.includes('3') || lowerValue.includes('medium')) return colorScheme[2];
      else if (lowerValue.includes('4') || lowerValue.includes('high') || lowerValue.includes('medium high')) return colorScheme[3];
      else if (lowerValue.includes('5') || lowerValue.includes('very high')) return colorScheme[4];
    }
    
    // Default to medium color if unable to determine
    return colorScheme[2];
  };

  const getLayerStyle = (layerName, feature = null) => {
    const layer = availableLayers.find(l => l.name === layerName);
    
    // Special handling for HEC density layer
    if (layerName === 'hec_density' && feature && feature.properties) {
      const color = getHecDensityColor(feature.properties);
      return {
        color: color,
        weight: 1,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.6
      };
    }
    
    return {
      color: layer?.color || '#3B82F6',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3
    };
  };

  const onEachFeature = (layerName) => (feature, layer) => {
    if (feature.properties) {
      const properties = feature.properties;
      
      // Special handling for HEC density layer
      if (layerName === 'hec_density') {
        const possibleDensityProps = ['density', 'level', 'class', 'category', 'value', 'DENSITY', 'LEVEL', 'CLASS'];
        let densityValue = null;
        let densityProp = null;
        
        // Try to find the density property
        for (const prop of possibleDensityProps) {
          if (properties[prop] !== undefined && properties[prop] !== null) {
            densityValue = properties[prop];
            densityProp = prop;
            break;
          }
        }
        
        // If no specific property found, check for numeric properties
        if (densityValue === null) {
          const numericProps = Object.keys(properties).filter(key => 
            typeof properties[key] === 'number' || 
            (typeof properties[key] === 'string' && !isNaN(Number(properties[key])))
          );
          if (numericProps.length > 0) {
            densityValue = properties[numericProps[0]];
            densityProp = numericProps[0];
          }
        }
        
        if (densityValue !== null) {
          const popupContent = `<div style="color: white;"><strong>HEC Density Level:</strong> ${densityValue}</div>`;
          layer.bindPopup(popupContent);
        } else {
          // Show all properties for debugging if no density found
          const allProps = Object.keys(properties).map(key => `<strong>${key}:</strong> ${properties[key]}`).join('<br/>');
          const popupContent = `<div style="color: white;">HEC Density Area<br/>${allProps}</div>`;
          layer.bindPopup(popupContent);
        }
        return;
      }
      
      // Define which attribute to display for each layer
      const layerAttributeMap = {
        'districts': 'ADM2_EN',
        'dsds': 'ADM3_EN',
        'forest_cover': null,
        'forests': 'Location',
        'habitat_1960': null,
        'hec_density': null,
        // Year-specific death layers will be handled dynamically
      };
      
      // Check if this is a year-specific death layer
      const isDeathLayer = layerName.match(/^(human_deaths|elephant_deaths)(_\d{4})?$/);
      let attributeToShow = layerAttributeMap[layerName];
      
      // For death layers (both year-specific and general), use 'Date of De'
      if (isDeathLayer) {
        attributeToShow = 'Date of De';
      }
      
      if (attributeToShow && properties[attributeToShow] !== null && properties[attributeToShow] !== undefined) {
        let popupContent;
        
        // For death layers, show "Date of Death" label with year if available
        if (isDeathLayer) {
          const yearMatch = layerName.match(/_(\d{4})$/);
          const yearInfo = yearMatch ? ` (${yearMatch[1]})` : '';
          popupContent = `<div style="color: white;"><strong>Date of Death${yearInfo}:</strong> ${properties[attributeToShow]}</div>`;
        } else {
          // For other layers, show only the value
          popupContent = `<div style="color: white;">${properties[attributeToShow]}</div>`;
        }
        
        layer.bindPopup(popupContent);
      } else if (attributeToShow === null) {
        // For layers that should show nothing, don't bind a popup
        return;
      } else {
        // If the specific attribute doesn't exist, show a message
        const popupContent = `<div style="color: white;"><em>No data available</em></div>`;
        layer.bindPopup(popupContent);
      }
    }
  };

  const getUserReportStyle = () => ({
    color: '#DC2626',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.7,
    radius: 8
  });

  const onEachUserReport = (feature, layer) => {
    if (feature.properties) {
      const props = feature.properties;
      const popupContent = `
        <div style="color: white;">
          <strong>Report Type:</strong> ${props.report_type || 'N/A'}<br/>
          <strong>Description:</strong> ${props.description || 'N/A'}<br/>
          <strong>Date:</strong> ${props.date || 'N/A'}<br/>
          <strong>Time:</strong> ${props.time || 'N/A'}<br/>
          <strong>Status:</strong> ${props.status || 'N/A'}<br/>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading map...</div>
      </div>
    );
  }

  if (!apiAvailable) {
    return (
      <div className="relative w-full h-full">
        <MapContainer
          center={sriLankaCenter}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Map click handler */}
          <MapClickHandler onMapClick={onMapClick} isReportMode={isReportMode} />
        </MapContainer>
        
        {/* API unavailable warning */}
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-red-900/90 backdrop-blur-xl border border-red-500/50 rounded-xl p-4 text-white">
          <div className="text-lg font-bold">⚠️ Backend Service Unavailable</div>
          <div className="text-sm mt-1">Map layers and data features are currently unavailable. Only the base map is shown.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={sriLankaCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render GeoJSON layers */}
        {layers.map((layer) => {
          if (visibleLayers[layer.name] && layerData[layer.name]) {
            // Check if this is a death layer (point features)
            const isDeathLayer = layer.name.match(/^(human_deaths|elephant_deaths)(_\d{4})?$/);
            
            return (
              <GeoJSON
                key={layer.name}
                data={layerData[layer.name]}
                style={(feature) => getLayerStyle(layer.name, feature)}
                onEachFeature={onEachFeature(layer.name)}
                pointToLayer={isDeathLayer ? (feature, latlng) => {
                  const style = getLayerStyle(layer.name, feature);
                  return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: style.color,
                    color: style.color,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  });
                } : undefined}
              />
            );
          }
          return null;
        })}
        
        {/* Render user reports */}
        {showUserReports && userReports && (
          <GeoJSON
            data={userReports}
            style={getUserReportStyle}
            onEachFeature={onEachUserReport}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, getUserReportStyle());
            }}
          />
        )}
        
        {/* Selected location marker for report mode */}
        {selectedLocation && (
          <GeoJSON
            data={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [selectedLocation.lng, selectedLocation.lat]
              },
              properties: { name: 'Selected Location' }
            }}
            pointToLayer={(feature, latlng) => {
              return L.marker(latlng, {
                icon: L.icon({
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  shadowSize: [41, 41]
                })
              });
            }}
          />
        )}
        
        <MapClickHandler onMapClick={onMapClick} isReportMode={isReportMode} />
      </MapContainer>
      
      {/* Layer Control */}
      {!isReportMode && showLayerControl && (
        <LayerControl
          layers={layers}
          visibleLayers={visibleLayers}
          onLayerToggle={handleLayerToggle}
        />
      )}
    </div>
  );
};

export default MapComponent;

