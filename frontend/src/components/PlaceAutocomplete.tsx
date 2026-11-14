import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Sparkles, CornerDownLeft, Star, Compass } from 'lucide-react';
import {
  LandmarkInfo,
  CATEGORY_ICONS,
  getPlaceSuggestions,
} from '../data/landmarks';
import { GeocodingService, GeocodedPlace } from '../services/geocodingService';

interface PlaceAutocompleteProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor?: 'indigo' | 'teal';
  showCurrentLocationOption?: boolean;
  className?: string;
  inputClassName?: string;
}

export const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Type or select a landmark or address...',
  accentColor = 'indigo',
  showCurrentLocationOption = false,
  className = '',
  inputClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [categoryFilter, setCategoryFilter] = useState<LandmarkInfo['category'] | 'ALL'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [locatingUser, setLocatingUser] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [geoResults, setGeoResults] = useState<GeocodedPlace[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Retrieve matching suggestions and best guess from landmark data
  const { suggestions, bestGuess } = getPlaceSuggestions(inputValue, categoryFilter, 8);

  // Live address search for custom queries
  useEffect(() => {
    const clean = inputValue.trim().toLowerCase();
    if (clean.length < 2) {
      setGeoResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await GeocodingService.searchAddresses(clean);
        setGeoResults(results);
      } catch (err) {
        console.error('Autocomplete search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (placeName: string) => {
    setInputValue(placeName);
    onChange(placeName);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleUseCurrentLocation = async () => {
    setLocatingUser(true);
    try {
      const pos = await GeocodingService.getCurrentPosition();
      const reverse = await GeocodingService.reverseGeocode(pos.lat, pos.lng);
      const displayName = reverse || 'My Current Location';
      handleSelect(displayName);
    } catch (err: any) {
      alert(err.message || 'Unable to fetch your current location.');
    } finally {
      setLocatingUser(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = suggestions.length + geoResults.length;
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Tab') {
      if (bestGuess && inputValue.trim().length > 0 && inputValue.toLowerCase() !== bestGuess.name.toLowerCase()) {
        e.preventDefault();
        handleSelect(bestGuess.name);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex].landmark.name);
      } else if (selectedIndex >= suggestions.length && selectedIndex < totalItems) {
        const geoIdx = selectedIndex - suggestions.length;
        handleSelect(geoResults[geoIdx].name);
      } else if (bestGuess && inputValue.trim().length >= 2) {
        handleSelect(bestGuess.name);
      } else if (inputValue.trim()) {
        handleSelect(inputValue.trim());
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const ghostSuffix =
    bestGuess &&
    inputValue.trim().length >= 1 &&
    bestGuess.name.toLowerCase().startsWith(inputValue.toLowerCase())
      ? bestGuess.name.slice(inputValue.length)
      : '';

  const focusRing =
    accentColor === 'teal'
      ? 'focus:ring-teal-500 focus:border-teal-500'
      : 'focus:ring-indigo-500 focus:border-indigo-500';

  const highlightColor =
    accentColor === 'teal' ? 'bg-teal-50 text-teal-900 font-bold' : 'bg-indigo-50 text-indigo-900 font-bold';

  const renderHighlightedName = (name: string, query: string) => {
    if (!query.trim()) return name;
    const q = query.trim().toLowerCase();
    const idx = name.toLowerCase().indexOf(q);
    if (idx === -1) return name;

    const before = name.slice(0, idx);
    const match = name.slice(idx, idx + q.length);
    const after = name.slice(idx + q.length);

    return (
      <>
        {before}
        <span className="font-extrabold underline text-indigo-600 dark:text-indigo-400 bg-amber-100/70 px-0.5 rounded">
          {match}
        </span>
        {after}
      </>
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={id} className="text-xs font-medium text-slate-600 block">
            {label}
          </label>
          <div className="flex items-center space-x-1.5">
            {showCurrentLocationOption && (
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locatingUser}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors inline-flex items-center space-x-1"
                title="Detect and use current GPS location"
              >
                {locatingUser ? (
                  <>
                    <span className="w-2.5 h-2.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 text-indigo-600" />
                    <span>📍 Use My Location</span>
                  </>
                )}
              </button>
            )}
            <span className="text-[10px] text-slate-400 font-medium">Click for suggestions</span>
          </div>
        </div>
      )}

      {/* Input container with predictive ghost text overlay */}
      <div className="relative">
        {ghostSuffix && isOpen && (
          <div
            aria-hidden="true"
            className="absolute inset-0 px-3 py-2.5 text-xs font-semibold pointer-events-none flex items-center select-none text-transparent"
          >
            <span>{inputValue}</span>
            <span className="text-slate-300 font-normal">{ghostSuffix}</span>
          </div>
        )}

        <input
          id={id}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${focusRing} ${inputClassName}`}
        />

        {/* Clear and Status icons */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                onChange('');
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-slate-600"
            title="Toggle suggestions"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dropdown Suggestions Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-fadeIn min-w-[280px]">
          
          {/* Header & Quick Category Pills */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center space-x-1">
                {inputValue.trim() ? (
                  <>
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>Suggestions for "{inputValue}"</span>
                  </>
                ) : (
                  <>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Famous Places & Landmarks</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {suggestions.length + geoResults.length} options
              </span>
            </div>

            {/* Category filter pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {(['ALL', 'Transit', 'Monument', 'Shopping', 'Healthcare', 'Corporate', 'Dining'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors font-medium ${
                    categoryFilter === cat
                      ? 'bg-slate-800 text-white shadow-xs font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? '⭐ All' : `${CATEGORY_ICONS[cat as LandmarkInfo['category']] || '📍'} ${cat}`}
                </button>
              ))}
            </div>
          </div>

          {/* 1-Tap Current Location Option if enabled */}
          {showCurrentLocationOption && !inputValue.trim() && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locatingUser}
              className="w-full text-left px-3.5 py-2.5 bg-indigo-50/70 hover:bg-indigo-100/80 transition-colors flex items-center space-x-2 text-xs font-bold text-indigo-900 border-b border-indigo-100"
            >
              <div className="p-1 rounded-lg bg-indigo-600 text-white">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div>📍 Use My Current Location</div>
                <div className="text-[10px] text-indigo-600 font-normal">
                  {locatingUser ? 'Acquiring GPS coordinates...' : 'Automatically detects your GPS location'}
                </div>
              </div>
            </button>
          )}

          {/* Predictive Best Guess Banner (when typing) */}
          {bestGuess && inputValue.trim().length >= 2 && (
            <div
              onClick={() => handleSelect(bestGuess.name)}
              className="p-2.5 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border-b border-indigo-100 cursor-pointer hover:bg-indigo-100/60 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="p-1 rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 flex items-center space-x-1">
                    <span>Predicted / Best Guess</span>
                  </div>
                  <div className="text-xs font-extrabold text-indigo-950 truncate">
                    {bestGuess.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 pl-2 text-[10px] font-semibold text-indigo-500">
                <span>Tab / Enter</span>
                <CornerDownLeft className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* List of Suggestions */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {suggestions.length > 0 && (
              suggestions.map((item, idx) => {
                const { landmark, matchType } = item;
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={landmark.name}
                    type="button"
                    onClick={() => handleSelect(landmark.name)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-start space-x-2.5 ${
                      isSelected ? highlightColor : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="text-base select-none mt-0.5" role="img" aria-label={landmark.category}>
                      {CATEGORY_ICONS[landmark.category] || '📍'}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold truncate">
                          {renderHighlightedName(landmark.name, inputValue)}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-600 ml-2 flex-shrink-0">
                          {landmark.category}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {landmark.desc}
                      </div>

                      {matchType === 'alias' && landmark.aliases && (
                        <div className="text-[9px] text-indigo-500 mt-0.5 truncate">
                          Matched keyword: {landmark.aliases.find((a) => a.toLowerCase().includes(inputValue.toLowerCase()))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}

            {/* Google Maps & Geocoded Verified Addresses */}
            {geoResults.length > 0 && (
              <div className="bg-slate-50/70 p-1 divide-y divide-slate-200/60 border-t border-slate-200">
                <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                  <Compass className="w-3 h-3 text-indigo-500" />
                  <span>Google Maps & Live Locations</span>
                </div>
                {geoResults.map((geo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(geo.displayName || geo.name)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 text-slate-800 flex items-start space-x-2 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate text-slate-900">{geo.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 ml-2 flex-shrink-0">
                          {geo.category || 'Google Maps'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{geo.displayName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isSearching && suggestions.length === 0 && geoResults.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Searching Google Maps for "{inputValue}"...</span>
              </div>
            )}

            {!isSearching && suggestions.length === 0 && geoResults.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                <p>No predefined landmarks match "{inputValue}"</p>
                <button
                  type="button"
                  onClick={() => handleSelect(inputValue)}
                  className="mt-2 text-indigo-600 font-bold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Use custom place "{inputValue}"</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-1.5 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Click or press Enter to choose</span>
            {inputValue && !suggestions.some((s) => s.landmark.name.toLowerCase() === inputValue.toLowerCase()) && (
              <button
                type="button"
                onClick={() => handleSelect(inputValue)}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Use custom text
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
