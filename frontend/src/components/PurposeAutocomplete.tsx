import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, CornerDownLeft, Star } from 'lucide-react';
import {
  TravelPurposeInfo,
  TRAVEL_PURPOSES,
  getPurposeSuggestions,
} from '../data/purposes';

interface PurposeAutocompleteProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const PurposeAutocomplete: React.FC<PurposeAutocompleteProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'e.g. Medical Consultation, Food Walk, Sightseeing...',
  className = '',
  inputClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [categoryFilter, setCategoryFilter] = useState<TravelPurposeInfo['category'] | 'ALL'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const { suggestions, bestGuess } = getPurposeSuggestions(inputValue, categoryFilter, 6);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (purposeName: string) => {
    setInputValue(purposeName);
    onChange(purposeName);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Tab') {
      if (bestGuess && inputValue.trim().length > 0 && inputValue.toLowerCase() !== bestGuess.name.toLowerCase()) {
        e.preventDefault();
        handleSelect(bestGuess.name);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex].purpose.name);
      } else if (bestGuess && inputValue.trim().length >= 2) {
        handleSelect(bestGuess.name);
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
          <span className="text-[10px] text-slate-400 font-medium">Click for common purposes</span>
        </div>
      )}

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
          className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputClassName}`}
        />

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
              title="Clear"
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

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-fadeIn min-w-[280px]">
          
          {/* Header & Filter Pills */}
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
                    <span>Popular Travel Purposes</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {suggestions.length} options
              </span>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {(['ALL', 'Healthcare', 'Tourism', 'Food', 'Shopping', 'Business', 'Spiritual'] as const).map((cat) => (
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
                  {cat === 'ALL' ? '⭐ All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Predictive Best Guess Banner */}
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
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">
                    Predicted Purpose
                  </div>
                  <div className="text-xs font-extrabold text-indigo-950 truncate">
                    {bestGuess.icon} {bestGuess.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 pl-2 text-[10px] font-semibold text-indigo-500">
                <span>Tab / Enter</span>
                <CornerDownLeft className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* Suggestion list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const { purpose, matchType } = item;
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={purpose.name}
                    type="button"
                    onClick={() => handleSelect(purpose.name)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-start space-x-2.5 ${
                      isSelected ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="text-base select-none mt-0.5" role="img" aria-label={purpose.category}>
                      {purpose.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold truncate">
                          {renderHighlightedName(purpose.name, inputValue)}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-600 ml-2 flex-shrink-0">
                          {purpose.category}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {purpose.desc}
                      </div>

                      {matchType === 'alias' && (
                        <div className="text-[9px] text-indigo-500 mt-0.5 truncate">
                          Matched keyword: {purpose.aliases.find((a) => a.toLowerCase().includes(inputValue.toLowerCase()))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                <p>No standard purpose matches "{inputValue}"</p>
                <button
                  type="button"
                  onClick={() => handleSelect(inputValue)}
                  className="mt-2 text-indigo-600 font-bold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Use custom purpose "{inputValue}"</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="px-3 py-1.5 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Click or press Enter to choose</span>
            {inputValue && (
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
