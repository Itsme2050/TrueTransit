import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Clock, Route, ShieldCheck, Zap, Scale, PlusCircle, AlertTriangle, MapPin, Compass, Search, X, Crosshair } from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { MapView } from '../components/MapView';
import { SafetyHeatPoint, RouteAlternative } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { GeocodingService, GeocodedPlace } from '../services/geocodingService';
import { useLocationState } from '../context/LocationContext';

interface SafetyMapPageProps {
  onOpenReportModal: () => void;
  isActive?: boolean;
}

interface LandmarkInfo {
  lat: number;
  lng: number;
  desc: string;
  category?: string;
}

// 50+ Landmark & Metro coordinates across Delhi & NCR including Kashmere Gate, Central Hubs, Monuments, and Malls
const COMPREHENSIVE_LANDMARKS: Record<string, LandmarkInfo> = {
  // Major Metro & Intermodal Transit Hubs
  'Kashmere Gate ISBT & Metro Hub': { lat: 28.6667, lng: 77.2285, desc: 'Major DMRC Red/Yellow/Violet Interchange & North Bus Terminal', category: 'Major Transit Hub' },
  'Kashmere Gate Metro Station': { lat: 28.6667, lng: 77.2285, desc: 'DMRC Red/Yellow/Violet Line Interchange', category: 'Metro Hub' },
  'Rajiv Chowk (Connaught Place)': { lat: 28.6328, lng: 77.2195, desc: 'Central DMRC Yellow/Blue Line Interchange Hub', category: 'Metro Hub' },
  'Chandni Chowk Metro Station': { lat: 28.6578, lng: 77.2301, desc: 'Yellow Line Old Delhi Heritage Gateway', category: 'Metro Station' },
  'Hauz Khas Metro Interchange': { lat: 28.5432, lng: 77.2063, desc: 'Yellow / Magenta Line Interchange Hub', category: 'Metro Hub' },
  'Noida Sector 52 Metro Station': { lat: 28.5885, lng: 77.3689, desc: 'Blue Line & Aqua Line Link Hub', category: 'Metro Hub' },
  'Botanical Garden Metro (Noida)': { lat: 28.5642, lng: 77.3345, desc: 'Blue / Magenta Line Interchange', category: 'Metro Hub' },
  'Dwarka Sector 21 Metro Station': { lat: 28.5522, lng: 77.0585, desc: 'Blue / Airport Express Line Interchange', category: 'Metro Hub' },
  'Millennium City Centre (HUDA City Centre)': { lat: 28.4595, lng: 77.0725, desc: 'Gurugram Yellow Line Terminal', category: 'Metro Hub' },

  // DLF & Major Corporate / Commercial Hubs
  'DLF Cyber City (Gurugram)': { lat: 28.4986, lng: 77.0878, desc: 'NCR Premier Tech & Commercial Hub', category: 'Tech Park' },
  'DLF Cyber Hub (Gurugram)': { lat: 28.4986, lng: 77.0878, desc: 'Corporate Dining & Social Boulevard', category: 'Dining Hub' },
  'DLF Promenade (Vasant Kunj)': { lat: 28.5416, lng: 77.1558, desc: 'South Delhi Luxury Mall & Cinema', category: 'Shopping' },
  'DLF Emporio (Vasant Kunj)': { lat: 28.5422, lng: 77.1569, desc: 'Ultra-Luxury Fashion & Boutiques', category: 'Luxury Shopping' },
  'DLF Mall of India (Noida Sector 18)': { lat: 28.5678, lng: 77.3211, desc: 'Largest Shopping Mall in NCR', category: 'Mega Mall' },
  'DLF Phase 1 (Golf Course Road)': { lat: 28.4789, lng: 77.0982, desc: 'Gurugram Prime Residential & Business', category: 'Residential / Biz' },
  'DLF Phase 2 (Sikanderpur)': { lat: 28.4891, lng: 77.0886, desc: 'Rapid Metro & Commercial Corridor', category: 'Transit Corridor' },
  'DLF Phase 3 (Moulsari Avenue)': { lat: 28.4950, lng: 77.0920, desc: 'Corporate IT & Commercial Offices', category: 'IT Hub' },
  'DLF South Square (Sarojini Nagar)': { lat: 28.5770, lng: 77.1990, desc: 'Market Retail & Multilevel Automated Parking', category: 'Retail' },

  // Historic & Monumental Attractions
  'India Gate': { lat: 28.6129, lng: 77.2295, desc: 'Historic War Memorial & Kartavya Path', category: 'Monument' },
  'Red Fort (Lal Qila)': { lat: 28.6562, lng: 77.2410, desc: 'Mughal Historic Citadel & UNESCO Site', category: 'Monument' },
  'Qutub Minar': { lat: 28.5244, lng: 77.1855, desc: 'UNESCO World Heritage Minaret complex', category: 'Monument' },
  'Lotus Temple (Baháʼí)': { lat: 28.5535, lng: 77.2588, desc: 'Architectural House of Worship', category: 'Spiritual' },
  'Akshardham Temple': { lat: 28.6127, lng: 77.2773, desc: 'Spiritual Cultural Campus & Light Show', category: 'Spiritual' },
  'Humayun\'s Tomb': { lat: 28.5933, lng: 77.2507, desc: 'UNESCO Mughal Garden Tomb', category: 'Monument' },
  'Jama Masjid (Old Delhi)': { lat: 28.6507, lng: 77.2334, desc: 'Grand 17th Century Historic Mosque', category: 'Spiritual' },

  // Key Transit Gateways
  'Connaught Place': { lat: 28.6315, lng: 77.2167, desc: 'Central Business District & Rajiv Chowk', category: 'City Centre' },
  'New Delhi Railway Station': { lat: 28.6429, lng: 77.2201, desc: 'Major Northern Transit Hub', category: 'Transit Hub' },
  'Old Delhi Railway Station': { lat: 28.6619, lng: 77.2280, desc: 'Historic Delhi Junction Station', category: 'Transit Hub' },
  'Hazrat Nizamuddin Railway Station': { lat: 28.5898, lng: 77.2530, desc: 'Major Southbound Rail Terminal', category: 'Transit Hub' },
  'Delhi Airport Terminal 3 (IGI)': { lat: 28.5562, lng: 77.1000, desc: 'International Air Gateway', category: 'Airport' },
  'Delhi Airport Terminal 1 (Domestic)': { lat: 28.5700, lng: 77.1120, desc: 'Domestic Flight Terminal', category: 'Airport' },
  'Aerocity Hospitality Hub': { lat: 28.5490, lng: 77.1215, desc: 'Airport Luxury Hotels & Dining', category: 'Hotels / Dining' },

  // Famous Bazaars & Markets
  'Chandni Chowk Heritage': { lat: 28.6562, lng: 77.2309, desc: 'Historic Market & Street Food', category: 'Historic Bazaar' },
  'Paharganj Main Bazaar': { lat: 28.6432, lng: 77.2135, desc: 'Backpacker & Budget Hub', category: 'Bazaar' },
  'Dilli Haat INA': { lat: 28.5744, lng: 77.2085, desc: 'Open-Air Craft & Culinary Bazaar', category: 'Craft / Food' },
  'Sarojini Nagar Market': { lat: 28.5762, lng: 77.1983, desc: 'Famous Apparel & Fashion Shopping', category: 'Shopping' },
  'Khan Market': { lat: 28.6003, lng: 77.2270, desc: 'Upscale Boutique Dining & Retail', category: 'Boutique' },
  'Lajpat Nagar Central Market': { lat: 28.5679, lng: 77.2433, desc: 'Bustling South Delhi Retail', category: 'Shopping' },
  'Karol Bagh Market': { lat: 28.6517, lng: 77.1906, desc: 'Western Delhi Shopping Hub', category: 'Shopping' },
  'Select CITYWALK (Saket)': { lat: 28.5284, lng: 77.2185, desc: 'Premier South Delhi Shopping Mall', category: 'Shopping' },
  'Hauz Khas Village': { lat: 28.5534, lng: 77.1945, desc: 'Urban Village, Cafes & Medieval Fort', category: 'Dining / Nightlife' },
  'Majnu Ka Tilla': { lat: 28.7001, lng: 77.2275, desc: 'Tibetan Colony & Himalayan Food', category: 'Cultural' },
  'Noida Sector 18 (Atta Market)': { lat: 28.5708, lng: 77.3218, desc: 'NCR Commercial & Shopping Center', category: 'Shopping' },

  // Healthcare & Universities
  'AIIMS New Delhi': { lat: 28.5672, lng: 77.2100, desc: 'Premier Medical Precinct', category: 'Healthcare' },
  'Safdarjung Hospital': { lat: 28.5701, lng: 77.2078, desc: 'Government General Hospital', category: 'Healthcare' },
  'Delhi University North Campus': { lat: 28.6892, lng: 77.2096, desc: 'Academic Corridor & Colleges', category: 'Education' },
  'Jawaharlal Nehru University (JNU)': { lat: 28.5398, lng: 77.1665, desc: 'South Delhi University Campus', category: 'Education' },
  'Lodhi Art District & Garden': { lat: 28.5916, lng: 77.2215, desc: 'Public Mural Art & Heritage Park', category: 'Culture & Park' },
};

// Deterministic coordinate generator for ANY arbitrary custom destination typed by the user
const resolveCoordinates = (name: string): { lat: number; lng: number } => {
  const normalized = name.trim();
  for (const [key, val] of Object.entries(COMPREHENSIVE_LANDMARKS)) {
    if (key.toLowerCase() === normalized.toLowerCase() || key.toLowerCase().includes(normalized.toLowerCase()) || normalized.toLowerCase().includes(key.toLowerCase())) {
      return { lat: val.lat, lng: val.lng };
    }
  }

  // Fallback: derive realistic Delhi-NCR bounds coordinate (Lat 28.50 - 28.70, Lng 77.10 - 77.30)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 200) - 100) / 1000;
  const lngOffset = ((Math.abs(hash >> 3) % 200) - 100) / 1000;
  return {
    lat: 28.6139 + latOffset,
    lng: 77.2090 + lngOffset,
  };
};

export const SafetyMapPage: React.FC<SafetyMapPageProps> = ({ onOpenReportModal, isActive = true }) => {
  const { t } = useLanguage();
  const {
    originName,
    originInput,
    originCoords,
    destName,
    destInput,
    destCoords,
    userLocation,
    activeHour,
    setOrigin,
    setOriginInput,
    setDestination,
    setDestInput,
    setUserLocation,
    setActiveRouteInfo,
    setActiveHour,
    swapWaypoints,
  } = useLocationState();

  const [hour, setHour] = useState<number>(activeHour);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const [locatingUser, setLocatingUser] = useState(false);
  const [geoResultsOrigin, setGeoResultsOrigin] = useState<GeocodedPlace[]>([]);
  const [geoResultsDest, setGeoResultsDest] = useState<GeocodedPlace[]>([]);

  const [heatPoints, setHeatPoints] = useState<SafetyHeatPoint[]>([]);
  const [routes, setRoutes] = useState<RouteAlternative[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-safest');
  const [loading, setLoading] = useState(false);

  const originBoxRef = useRef<HTMLDivElement>(null);
  const destBoxRef = useRef<HTMLDivElement>(null);

  // Live address search debouncing for custom entries
  useEffect(() => {
    const clean = originInput.trim().toLowerCase();
    if (clean.length < 2 || COMPREHENSIVE_LANDMARKS[originInput.trim()]) {
      setGeoResultsOrigin([]);
      return;
    }
    const tId = setTimeout(async () => {
      const res = await GeocodingService.searchAddresses(clean);
      setGeoResultsOrigin(res);
    }, 300);
    return () => clearTimeout(tId);
  }, [originInput]);

  useEffect(() => {
    const clean = destInput.trim().toLowerCase();
    if (clean.length < 2 || COMPREHENSIVE_LANDMARKS[destInput.trim()]) {
      setGeoResultsDest([]);
      return;
    }
    const tId = setTimeout(async () => {
      const res = await GeocodingService.searchAddresses(clean);
      setGeoResultsDest(res);
    }, 300);
    return () => clearTimeout(tId);
  }, [destInput]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originBoxRef.current && !originBoxRef.current.contains(e.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destBoxRef.current && !destBoxRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchHeatmap = async (targetHour: number) => {
    try {
      const res = await ApiClient.getHeatmap(targetHour);
      if (res.geoJson?.features) {
        const points: SafetyHeatPoint[] = res.geoJson.features.map((f: any) => ({
          name: f.properties.name,
          zoneType: f.properties.zoneType,
          hour: f.properties.hour,
          safetyScore: f.properties.safetyScore,
          level: f.properties.level,
          colorCode: f.properties.colorCode,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          breakdown: f.properties.breakdown,
          evidenceRationale: f.properties.evidenceRationale,
          disclaimer: f.properties.disclaimer,
        }));
        setHeatPoints(points);
      }
    } catch (err) {
      console.error('Heatmap load error:', err);
    }
  };

  const calculateRoutesWithCoords = async (
    oName: string,
    oCoords: { lat: number; lng: number },
    dName: string,
    dCoords: { lat: number; lng: number }
  ) => {
    setLoading(true);
    try {
      const res = await ApiClient.calculateRoutes(
        { name: oName, lat: oCoords.lat, lng: oCoords.lng },
        { name: dName, lat: dCoords.lat, lng: dCoords.lng },
        hour
      );
      if (res.routes && res.routes.length > 0) {
        setRoutes(res.routes);
        setSelectedRouteId('route-safest');
        const defaultRoute = res.routes.find((r: any) => r.id === 'route-safest') || res.routes[0];
        if (defaultRoute) {
          setActiveRouteInfo(defaultRoute.distanceKm, defaultRoute.durationMinutes, defaultRoute.name, defaultRoute.type);
        }
      }
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap(hour);
  }, [hour]);

  useEffect(() => {
    calculateRoutesWithCoords(originName, originCoords, destName, destCoords);
  }, [originCoords, destCoords, hour]);

  const [pinningMode, setPinningMode] = useState<'NONE' | 'ORIGIN' | 'DESTINATION'>('NONE');

  const handleSetOriginFromCoords = async (coords: { lat: number; lng: number }) => {
    try {
      const reverse = await GeocodingService.reverseGeocode(coords.lat, coords.lng);
      const displayName = reverse || `Departure Point (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
      setOrigin(displayName, coords, displayName);
      setOriginInput(displayName);
      setUserLocation({ lat: coords.lat, lng: coords.lng, label: displayName, accuracy: 10 });
      setShowOriginSuggestions(false);
      calculateRoutesWithCoords(displayName, coords, destName, destCoords);
    } catch (e) {
      console.error('Error reverse geocoding origin:', e);
    }
  };

  const handleSetDestFromCoords = async (coords: { lat: number; lng: number }) => {
    try {
      const reverse = await GeocodingService.reverseGeocode(coords.lat, coords.lng);
      const displayName = reverse || `Destination (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
      setDestination(displayName, coords, displayName);
      setDestInput(displayName);
      setShowDestSuggestions(false);
      calculateRoutesWithCoords(originName, originCoords, displayName, coords);
    } catch (e) {
      console.error('Error reverse geocoding destination:', e);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocatingUser(true);
    try {
      const pos = await GeocodingService.getCurrentPosition();
      const reverse = await GeocodingService.reverseGeocode(pos.lat, pos.lng);
      const displayName = reverse || `Current Position (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`;

      const coords = { lat: pos.lat, lng: pos.lng };
      setUserLocation({ lat: pos.lat, lng: pos.lng, label: displayName, accuracy: pos.accuracy });
      setOrigin(displayName, coords, displayName);
      setOriginInput(displayName);
      setShowOriginSuggestions(false);

      calculateRoutesWithCoords(displayName, coords, destName, destCoords);
    } catch (err: any) {
      alert(err.message || 'Unable to fetch your current GPS location.');
    } finally {
      setLocatingUser(false);
    }
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Dynamic suggestion filter helper
  const getSuggestions = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return Object.keys(COMPREHENSIVE_LANDMARKS).slice(0, 10);

    const matches = Object.entries(COMPREHENSIVE_LANDMARKS).filter(([name, info]) => {
      return (
        name.toLowerCase().includes(q) ||
        info.desc.toLowerCase().includes(q) ||
        (info.category && info.category.toLowerCase().includes(q))
      );
    });

    matches.sort(([a], [b]) => {
      const aStarts = a.toLowerCase().startsWith(q);
      const bStarts = b.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    return matches.map(([name]) => name);
  };

  const originSuggestions = getSuggestions(originInput);
  const destSuggestions = getSuggestions(destInput);

  const handleSelectOrigin = async (val: string, explicitCoords?: { lat: number; lng: number }) => {
    setShowOriginSuggestions(false);

    let coords = explicitCoords;
    if (!coords) {
      if (COMPREHENSIVE_LANDMARKS[val]) {
        coords = { lat: COMPREHENSIVE_LANDMARKS[val].lat, lng: COMPREHENSIVE_LANDMARKS[val].lng };
      } else {
        coords = await GeocodingService.geocodeAddress(val);
      }
    }
    setOrigin(val, coords);
    calculateRoutesWithCoords(val, coords, destName, destCoords);
  };

  const handleSelectDest = async (val: string, explicitCoords?: { lat: number; lng: number }) => {
    setShowDestSuggestions(false);

    let coords = explicitCoords;
    if (!coords) {
      if (COMPREHENSIVE_LANDMARKS[val]) {
        coords = { lat: COMPREHENSIVE_LANDMARKS[val].lat, lng: COMPREHENSIVE_LANDMARKS[val].lng };
      } else {
        coords = await GeocodingService.geocodeAddress(val);
      }
    }
    setDestination(val, coords);
    calculateRoutesWithCoords(originName, originCoords, val, coords);
  };

  const handleSwapWaypoints = () => {
    swapWaypoints();
  };

  // Quick preset pills for popular spots
  const popularPresets = [
    'India Gate',
    'DLF Cyber City (Gurugram)',
    'Red Fort (Lal Qila)',
    'Qutub Minar',
    'Lotus Temple (Baháʼí)',
    'AIIMS New Delhi',
    'Akshardham Temple',
    'DLF Mall of India (Noida Sector 18)',
    'Delhi Airport Terminal 3 (IGI)',
    'Chandni Chowk Heritage',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2.5">
            <ShieldAlert className="w-7 h-7 text-teal-600" />
            <span>{t('chronoSafetyPageTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('chronoSafetyPageDesc')}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          <span>{t('reportSafetyConcernBtn')}</span>
        </button>
      </div>

      {/* 24-Hour Time Slider Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{t('chronoTimeSliderLabel')}</span>
            <span className="text-teal-700 font-extrabold text-base bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
              {hour.toString().padStart(2, '0')}:00 ({((hour + 11) % 12) + 1}:00 {hour >= 12 ? 'PM' : 'AM'})
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {hour >= 23 || hour < 5
              ? `🌙 ${t('timeNightNote')}`
              : hour >= 19
              ? `🌆 ${t('timeEveningNote')}`
              : `☀️ ${t('timeDaylightNote')}`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={hour}
          onChange={(e) => setHour(parseInt(e.target.value, 10))}
          className="w-full accent-teal-600 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
          <span>{t('midnightLabel')}</span>
          <span>{t('dawnLabel')}</span>
          <span>{t('noonLabel')}</span>
          <span>{t('duskLabel')}</span>
          <span>{t('nightLabel')}</span>
        </div>
      </div>

      {/* Main Map & Route Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Map View (7 Cols) */}
        <div className="lg:col-span-7 h-[400px] sm:h-[450px] lg:h-[540px]">
          <MapView
            heatPoints={heatPoints}
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            userLocation={userLocation}
            isActive={isActive}
            onSetOriginFromCoords={handleSetOriginFromCoords}
            onSetDestFromCoords={handleSetDestFromCoords}
            pinningMode={pinningMode}
            onResetPinningMode={() => setPinningMode('NONE')}
          />
        </div>

        {/* Right Route Selection with Always-On Searchable Inputs & Live Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Waypoint Selectors */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
            
            {/* Departure Point (Origin) - ALWAYS SEARCHABLE WITH AUTOCOMPLETE */}
            <div className="relative" ref={originBoxRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  <span>{t('departurePointLabel')}</span>
                </label>
                
                <div className="flex items-center space-x-1.5">
                  {/* 🎯 Pin on Map Button */}
                  <button
                    type="button"
                    onClick={() => setPinningMode(pinningMode === 'ORIGIN' ? 'NONE' : 'ORIGIN')}
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                      pinningMode === 'ORIGIN'
                        ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Click anywhere on the map to set your exact departure pin"
                  >
                    <Crosshair className="w-3 h-3 text-emerald-600" />
                    <span>{pinningMode === 'ORIGIN' ? '🎯 Click Map...' : '🎯 Pin on Map'}</span>
                  </button>

                  {/* 📍 Use My Current Location Button */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locatingUser}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    title="Detect GPS location from device"
                  >
                    {locatingUser ? (
                      <>
                        <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>📍 Use My Location</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => {
                    setOriginInput(e.target.value);
                    setShowOriginSuggestions(true);
                  }}
                  onFocus={() => setShowOriginSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSelectOrigin(originInput);
                    }
                  }}
                  placeholder={t('typeOrSelectOrigin')}
                  className="w-full text-xs font-semibold pl-8 pr-20 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {originInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setOriginInput('');
                        setShowOriginSuggestions(true);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                      title="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelectOrigin(originInput)}
                    className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-[10px] font-bold hover:bg-teal-500 transition-colors shadow-xs"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* GPS Active / Accuracy Status */}
              {userLocation && (
                <div className="mt-1.5">
                  {userLocation.accuracy && userLocation.accuracy > 500 ? (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                        <span>
                          <strong>Network/IP Estimated (±{Math.round(userLocation.accuracy / 1000)} km):</strong> Laptop location may differ from actual position.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPinningMode('ORIGIN')}
                        className="font-extrabold text-teal-800 underline hover:text-teal-950 flex-shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        🎯 Click Map to Pin Exact Location
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>GPS Active: ({originCoords.lat.toFixed(4)}, {originCoords.lng.toFixed(4)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPinningMode('ORIGIN')}
                        className="text-teal-700 font-bold hover:underline cursor-pointer"
                      >
                        🎯 Adjust on Map
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions Dropdown for Origin */}
              {showOriginSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-fadeIn">
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Suggestions for "{originInput}"</span>
                    <span>{originSuggestions.length + geoResultsOrigin.length} found</span>
                  </div>

                  {originSuggestions.length > 0 && (
                    originSuggestions.map((loc) => {
                      const info = COMPREHENSIVE_LANDMARKS[loc];
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleSelectOrigin(loc)}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start space-x-2 ${
                            originName === loc ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{loc}</div>
                            {info && (
                              <div className="text-[10px] text-slate-400 truncate font-normal">
                                {info.category ? `[${info.category}] ` : ''}{info.desc}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}

                  {/* Geocoded Verified Addresses */}
                  {geoResultsOrigin.length > 0 && (
                    <div className="bg-teal-50/60 p-1 divide-y divide-teal-100/70 border-t border-slate-100">
                      <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-teal-800 tracking-wider flex items-center space-x-1">
                        <Compass className="w-3 h-3 text-teal-600" />
                        <span>Verified Addresses & Sectors (NCR & OpenStreetMap)</span>
                      </div>
                      {geoResultsOrigin.map((geo, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOrigin(geo.name, { lat: geo.lat, lng: geo.lng })}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-teal-100/80 text-slate-900 flex items-start space-x-2 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{geo.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{geo.displayName}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {originSuggestions.length === 0 && geoResultsOrigin.length === 0 && (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      No matching landmarks. Click below to use as custom location.
                    </div>
                  )}

                  {/* Custom location button */}
                  {originInput.trim() && !COMPREHENSIVE_LANDMARKS[originInput.trim()] && (
                    <button
                      type="button"
                      onClick={() => handleSelectOrigin(originInput.trim())}
                      className="w-full text-left px-3 py-2.5 text-xs bg-teal-50 hover:bg-teal-100 font-bold text-teal-900 flex items-center space-x-2 transition-colors border-t border-slate-100"
                    >
                      <Compass className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 animate-pulse" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">📍 Route from custom location: "{originInput.trim()}"</div>
                        <div className="text-[10px] font-normal text-teal-600">Resolves exact coordinates and recalculates route on map</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Swap Button Between Departure & Destination */}
            <div className="flex justify-center -my-1">
              <button
                type="button"
                onClick={handleSwapWaypoints}
                title="Swap Departure and Destination"
                className="py-1 px-3 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 border border-slate-200 shadow-xs transition-all active:scale-95 flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider"
              >
                <span>⇅</span>
                <span>Swap Route</span>
              </button>
            </div>

            {/* Destination Point - ALWAYS SEARCHABLE WITH AUTOCOMPLETE */}
            <div className="relative" ref={destBoxRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                  <span>{t('destinationPointLabel')}</span>
                </label>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setPinningMode(pinningMode === 'DESTINATION' ? 'NONE' : 'DESTINATION')}
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                      pinningMode === 'DESTINATION'
                        ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Click anywhere on the map to set your destination pin"
                  >
                    <Crosshair className="w-3 h-3 text-rose-600" />
                    <span>{pinningMode === 'DESTINATION' ? '🎯 Click Map...' : '🎯 Pin on Map'}</span>
                  </button>
                  <span className="text-[10px] text-teal-600 font-semibold hidden sm:inline">Autocomplete</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={destInput}
                  onChange={(e) => {
                    setDestInput(e.target.value);
                    setShowDestSuggestions(true);
                  }}
                  onFocus={() => setShowDestSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSelectDest(destInput);
                    }
                  }}
                  placeholder={t('typeOrSelectDestination')}
                  className="w-full text-xs font-semibold pl-8 pr-20 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {destInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setDestInput('');
                        setShowDestSuggestions(true);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                      title="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelectDest(destInput)}
                    className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-[10px] font-bold hover:bg-teal-500 transition-colors shadow-xs"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Suggestions Dropdown for Destination */}
              {showDestSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-fadeIn">
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Suggestions for "{destInput}"</span>
                    <span>{destSuggestions.length + geoResultsDest.length} found</span>
                  </div>

                  {destSuggestions.length > 0 && (
                    destSuggestions.map((loc) => {
                      const info = COMPREHENSIVE_LANDMARKS[loc];
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleSelectDest(loc)}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start space-x-2 ${
                            destName === loc ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{loc}</div>
                            {info && (
                              <div className="text-[10px] text-slate-400 truncate font-normal">
                                {info.category ? `[${info.category}] ` : ''}{info.desc}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}

                  {/* Geocoded Verified Addresses */}
                  {geoResultsDest.length > 0 && (
                    <div className="bg-teal-50/60 p-1 divide-y divide-teal-100/70 border-t border-slate-100">
                      <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-teal-800 tracking-wider flex items-center space-x-1">
                        <Compass className="w-3 h-3 text-teal-600" />
                        <span>Verified Addresses & Sectors (NCR & OpenStreetMap)</span>
                      </div>
                      {geoResultsDest.map((geo, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectDest(geo.name, { lat: geo.lat, lng: geo.lng })}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-teal-100/80 text-slate-900 flex items-start space-x-2 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{geo.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{geo.displayName}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {destSuggestions.length === 0 && geoResultsDest.length === 0 && (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      No matching landmarks. Click below to use as custom location.
                    </div>
                  )}

                  {/* Custom location button */}
                  {destInput.trim() && !COMPREHENSIVE_LANDMARKS[destInput.trim()] && (
                    <button
                      type="button"
                      onClick={() => handleSelectDest(destInput.trim())}
                      className="w-full text-left px-3 py-2.5 text-xs bg-teal-50 hover:bg-teal-100 font-bold text-teal-900 flex items-center space-x-2 transition-colors border-t border-slate-100"
                    >
                      <Compass className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 animate-pulse" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">📍 Route to custom location: "{destInput.trim()}"</div>
                        <div className="text-[10px] font-normal text-teal-600">Resolves exact coordinates and recalculates route on map</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick 1-Tap Popular Preset Chips */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                {t('popularDestinations')}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectDest(preset)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                      destName === preset
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {preset.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Route Alternative Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t('routeAlternativesHeading')}
            </h3>

            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      {route.type === 'SAFEST' ? (
                        <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      ) : route.type === 'FASTEST' ? (
                        <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                          <Zap className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                          <Scale className="w-4 h-4" />
                        </span>
                      )}
                      <div>
                        <div className="font-bold text-xs text-slate-900">{route.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {route.distanceKm} km • {route.durationMinutes} mins
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${
                          route.safetyScore >= 75
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        {route.safetyScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    <strong>{t('tradeOffLabel')}</strong> {route.tradeOffSummary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Route Detailed Rationale Card */}
          {selectedRoute && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">{t('safetyEvidenceTitle')}</div>
              <p className="text-slate-600 leading-relaxed">{selectedRoute.rationale}</p>
              <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>{t('lightingLabel')} <strong className="text-slate-800">{selectedRoute.lightingQuality}</strong></span>
                <span>{t('transitAccessLabel')} <strong className="text-slate-800">{selectedRoute.transitAccessibility}</strong></span>
                <span>{t('recommendedHoursLabel')} <strong className="text-slate-800">{selectedRoute.recommendedHours}</strong></span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Safety Heuristic Advisory */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>{t('safetyAdvisoryText')}</p>
      </div>

    </div>
  );
};
