import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Wallet,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Compass,
  Edit3,
  Calendar,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { GeneratedItinerary } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { PlaceAutocomplete } from '../components/PlaceAutocomplete';
import { PurposeAutocomplete } from '../components/PurposeAutocomplete';
import { useLocationState } from '../context/LocationContext';
import { formatMinutesToTime, parseTimeToMinutes } from '../services/localItineraryEngine';

export const ItineraryPlannerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { originName, destName, setOrigin, setDestination } = useLocationState();
  const [startingPoint, setStartingPointState] = useState(originName || 'New Delhi Railway Station');
  const [destination, setDestinationState] = useState(destName || 'AIIMS New Delhi');
  const [freeHours, setFreeHours] = useState<number>(4);
  const [totalBudget, setTotalBudget] = useState<number>(1500);
  const [startTime, setStartTime] = useState<string>('11:00 AM');
  const [purpose, setPurpose] = useState('Medical Appointment & Lunch');
  const [transportPreference, setTransportPreference] = useState<'METRO' | 'AUTO' | 'CAB' | 'WALKING' | 'BALANCED'>('BALANCED');
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);

  // Stop inline timing editor state
  const [editingStopIdx, setEditingStopIdx] = useState<number | null>(null);
  const [customArrTime, setCustomArrTime] = useState<string>('');
  const [customDepTime, setCustomDepTime] = useState<string>('');

  // Keep aligned with global location state
  useEffect(() => {
    if (originName) setStartingPointState(originName);
  }, [originName]);

  useEffect(() => {
    if (destName) setDestinationState(destName);
  }, [destName]);

  const handleStartingPointChange = (val: string) => {
    setStartingPointState(val);
    setOrigin(val, { lat: 28.6315, lng: 77.2167 }, val);
  };

  const handleDestinationChange = (val: string) => {
    setDestinationState(val);
    setDestination(val, { lat: 28.6129, lng: 77.2295 }, val);
  };

  const handleGenerate = async (customParams?: any) => {
    setLoading(true);
    setError(null);
    try {
      const payload = customParams || {
        startingPoint,
        destination,
        freeHours: Number(freeHours),
        totalBudget: Number(totalBudget),
        startTime,
        purpose,
        transportPreference,
      };

      const res = await ApiClient.generateItinerary(payload);
      if (res.data) {
        setItinerary(res.data);
        setIsOfflineFallback(Boolean(res.offlineFallback));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  // Helper to shift all stop times forward or backward
  const shiftAllStops = (offsetMinutes: number) => {
    if (!itinerary) return;
    const updatedStops = itinerary.stops.map((stop) => {
      const arrMins = parseTimeToMinutes(stop.arrivalTime) + offsetMinutes;
      const depMins = parseTimeToMinutes(stop.departureTime) + offsetMinutes;
      return {
        ...stop,
        arrivalTime: formatMinutesToTime(arrMins),
        departureTime: formatMinutesToTime(depMins),
      };
    });

    if (updatedStops.length > 0) {
      setStartTime(updatedStops[0].arrivalTime);
    }

    setItinerary({
      ...itinerary,
      stops: updatedStops,
    });
  };

  // Save custom timing for an individual stop
  const handleSaveStopTiming = (stopIndex: number) => {
    if (!itinerary) return;
    const updatedStops = [...itinerary.stops];
    updatedStops[stopIndex] = {
      ...updatedStops[stopIndex],
      arrivalTime: customArrTime.trim() || updatedStops[stopIndex].arrivalTime,
      departureTime: customDepTime.trim() || updatedStops[stopIndex].departureTime,
    };
    setItinerary({
      ...itinerary,
      stops: updatedStops,
    });
    setEditingStopIdx(null);
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const roundedMins = Math.round(minutes / 5) * 5;
    const safeMins = roundedMins >= 60 ? 0 : roundedMins;
    return `${hours.toString().padStart(2, '0')}:${safeMins.toString().padStart(2, '0')} ${period}`;
  };

  const handlePresetScenario = () => {
    handleStartingPointChange('New Delhi Railway Station');
    handleDestinationChange('AIIMS New Delhi');
    setFreeHours(4);
    setTotalBudget(1500);
    setStartTime('10:00 AM');
    setPurpose(language === 'hi' ? 'चिकित्सा परामर्श और दोपहर का भोजन' : 'Medical Appointment & Lunch');
    setTransportPreference('BALANCED');
    handleGenerate({
      startingPoint: 'New Delhi Railway Station',
      destination: 'AIIMS New Delhi',
      freeHours: 4,
      totalBudget: 1500,
      startTime: '10:00 AM',
      purpose: 'Medical Appointment & Lunch',
      transportPreference: 'BALANCED',
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2.5">
            <Sparkles className="w-7 h-7 text-indigo-600" />
            <span>{t('itineraryPlannerHeading')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('itinerarySubtitle')}
          </p>
        </div>

        <button
          onClick={handlePresetScenario}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors self-start sm:self-auto shadow-sm"
        >
          <HeartHandshake className="w-4 h-4 text-indigo-600" />
          <span>{t('loadMedicalPresetBtn')}</span>
        </button>
      </div>

      {/* Input Configuration Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <PlaceAutocomplete
            id="itinerary-starting-point"
            label={t('startingPointInputLabel')}
            value={startingPoint}
            onChange={(val) => handleStartingPointChange(val)}
            placeholder="Search starting place (e.g. Connaught Place)..."
            accentColor="indigo"
            showCurrentLocationOption={true}
          />

          <PlaceAutocomplete
            id="itinerary-destination"
            label={t('destinationInputLabel')}
            value={destination}
            onChange={(val) => handleDestinationChange(val)}
            placeholder="Search destination (e.g. AIIMS, India Gate)..."
            accentColor="indigo"
          />

          {/* Trip Start / Departure Time */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              {t('tripStartTimeLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="11:00 AM"
                className="w-full text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            {/* Quick time selection pills */}
            <div className="flex items-center space-x-1 mt-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[9px] font-bold">
              <button
                type="button"
                onClick={() => setStartTime(getCurrentTimeString())}
                className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 whitespace-nowrap border border-indigo-200 cursor-pointer"
              >
                Now
              </button>
              {['09:00 AM', '11:00 AM', '02:00 PM', '06:00 PM'].map((tm) => (
                <button
                  key={tm}
                  type="button"
                  onClick={() => setStartTime(tm)}
                  className={`px-1.5 py-0.5 rounded whitespace-nowrap transition-all cursor-pointer ${
                    startTime === tm
                      ? 'bg-indigo-600 text-white font-extrabold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tm.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              {t('availableFreeTimeLabel')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="24"
                value={freeHours}
                onChange={(e) => setFreeHours(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {t('hoursUnit')}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              {t('totalMaxBudgetLabel')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="100"
                step="50"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full text-xs font-semibold pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

        </div>

        {/* Quick Famous Destination Chips */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-400 font-semibold flex items-center space-x-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Quick Presets:</span>
          </span>
          {[
            'AIIMS New Delhi',
            'India Gate',
            'Connaught Place',
            'Red Fort (Lal Qila)',
            'Chandni Chowk Heritage',
            'DLF Cyber Hub (Gurugram)',
            'Delhi Airport Terminal 3 (IGI)',
            'Lotus Temple (Baháʼí)',
          ].map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => handleDestinationChange(place)}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap font-medium ${
                destination === place
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border-slate-200'
              }`}
            >
              {place.split(' (')[0]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <PurposeAutocomplete
              id="itinerary-travel-purpose"
              label={t('travelPurposeLabel')}
              value={purpose}
              onChange={(val) => setPurpose(val)}
              placeholder="e.g. Medical, Sightseeing, Street Food Walk..."
            />

            {/* Quick Purpose Preset Chips */}
            <div className="flex items-center space-x-1.5 pt-2 overflow-x-auto pb-1 text-[10px] scrollbar-none">
              <span className="text-slate-400 font-semibold whitespace-nowrap">Presets:</span>
              {[
                { label: '🏥 Medical & Lunch', val: 'Medical Appointment & Lunch' },
                { label: '🏛️ Heritage & Monuments', val: 'Historic Monuments & Heritage Sightseeing' },
                { label: '🍲 Street Food Walk', val: 'Street Food Walk & Culinary Tasting' },
                { label: '🛍️ Bazaar Shopping', val: 'Bazaar Shopping & Handicrafts Hunt' },
                { label: '💼 Business Meeting', val: 'Business Meetings & Corporate Hub Visit' },
                { label: '🛕 Temple Tour', val: 'Spiritual Pilgrimage & Peaceful Shrines' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPurpose(p.val)}
                  className={`px-2 py-0.5 rounded-lg border transition-all whitespace-nowrap font-medium ${
                    purpose === p.val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              {t('preferredTransportLabel')}
            </label>
            <select
              value={transportPreference}
              onChange={(e) => setTransportPreference(e.target.value as any)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="BALANCED">{t('transOptBalanced')}</option>
              <option value="METRO">{t('transOptMetro')}</option>
              <option value="AUTO">{t('transOptAuto')}</option>
              <option value="CAB">{t('transOptCab')}</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-98 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('synthesizingContext')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('generateValidatedItineraryBtn')}</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Generated Itinerary Timeline Output */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          {isOfflineFallback && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Offline-Resilient Plan:</strong> Generated using TrueTransit&apos;s local deterministic engine because the backend API (port 5000) was not reached. Start the backend server for cloud database persistence and Gemini AI.
              </span>
            </div>
          )}
          
          {/* Summary Dashboard Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                  {itinerary.modelUsed}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">{itinerary.title}</h2>
              </div>

              {/* Deterministic Validation Badge */}
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto border ${
                  itinerary.validation?.isValid
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                }`}
              >
                {itinerary.validation?.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {itinerary.validation?.isValid
                    ? t('deterministicBudgetGuardPassed')
                    : t('deterministicBudgetGuardFailed')}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {itinerary.summaryNote}
            </p>

            {/* Financial Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('totalBudgetCard')}</div>
                <div className="text-lg font-black text-white">₹{itinerary.totalBudget}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('calculatedCostCard')}</div>
                <div className="text-lg font-black text-teal-400">₹{itinerary.estimatedCost}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('remainingBufferCard')}</div>
                <div className="text-lg font-black text-emerald-400">₹{itinerary.remainingBudget}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('allocatedTimeCard')}</div>
                <div className="text-lg font-black text-amber-400">{itinerary.durationHours} {t('hoursUnit')}</div>
              </div>
            </div>
          </div>

          {/* Interactive Timeline Stops with Custom Timing Controls */}
          <div className="space-y-4">
            
            {/* Timeline Header & Global Shift Schedule Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    {t('interactiveScheduleTimeline')}
                  </h3>
                  <div className="text-[11px] text-indigo-900 font-medium">
                    Trip departs at <strong className="font-extrabold text-indigo-700">{itinerary.stops[0]?.arrivalTime || startTime}</strong> • Customize any stop or shift schedule below
                  </div>
                </div>
              </div>

              {/* Schedule Quick Shift Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-white/80 backdrop-blur-xs p-1.5 rounded-xl border border-indigo-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  {t('shiftScheduleLabel')}:
                </span>
                <button
                  type="button"
                  onClick={() => shiftAllStops(-60)}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Shift entire schedule 1 hour earlier"
                >
                  -1h
                </button>
                <button
                  type="button"
                  onClick={() => shiftAllStops(-30)}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Shift entire schedule 30 minutes earlier"
                >
                  -30m
                </button>
                <button
                  type="button"
                  onClick={() => shiftAllStops(30)}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Shift entire schedule 30 minutes later"
                >
                  +30m
                </button>
                <button
                  type="button"
                  onClick={() => shiftAllStops(60)}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Shift entire schedule 1 hour later"
                >
                  +1h
                </button>
              </div>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:z-0">
              {itinerary.stops.map((stop, idx) => (
                <div
                  key={stop.orderIndex || idx}
                  className="relative z-10 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm ml-2.5 sm:ml-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                      {stop.orderIndex}
                    </div>
                    <div className="flex-1 min-w-0">
                      
                      {/* Stop Timing Bar with Custom Timing Trigger */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-md flex items-center space-x-1 shadow-2xs">
                          <Clock className="w-3 h-3 text-indigo-500 mr-1" />
                          <span>{stop.arrivalTime} — {stop.departureTime}</span>
                        </span>
                        
                        <span className="text-[10px] font-semibold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {stop.category}
                        </span>

                        {/* Custom Timing Toggle Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (editingStopIdx === idx) {
                              setEditingStopIdx(null);
                            } else {
                              setEditingStopIdx(idx);
                              setCustomArrTime(stop.arrivalTime);
                              setCustomDepTime(stop.departureTime);
                            }
                          }}
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            editingStopIdx === idx
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-slate-200'
                          }`}
                          title="Set custom arrival and departure time for this stop"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{editingStopIdx === idx ? 'Close' : t('editTimingBtn')}</span>
                        </button>
                      </div>

                      {/* Inline Custom Timing Editor */}
                      {editingStopIdx === idx && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-wrap items-center gap-3 animate-fadeIn shadow-xs">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-indigo-900 block mb-1">
                              Arrival Time
                            </label>
                            <input
                              type="text"
                              value={customArrTime}
                              onChange={(e) => setCustomArrTime(e.target.value)}
                              placeholder="e.g. 11:00 AM"
                              className="w-28 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-indigo-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-indigo-900 block mb-1">
                              Departure Time
                            </label>
                            <input
                              type="text"
                              value={customDepTime}
                              onChange={(e) => setCustomDepTime(e.target.value)}
                              placeholder="e.g. 11:35 AM"
                              className="w-28 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-indigo-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                            />
                          </div>

                          <div className="flex items-center space-x-2 self-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveStopTiming(idx)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              {t('saveTimingBtn')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStopIdx(null)}
                              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      <h4 className="text-base font-bold text-slate-900 mt-2">{stop.placeName}</h4>
                      
                      {/* Transit Mode */}
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600 mt-1">
                        <Navigation className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t('transitViaLabel')} <strong>{stop.travelMethod}</strong></span>
                      </div>

                      {/* Safety Observation */}
                      {stop.safetyNote && (
                        <div className="flex items-start space-x-1.5 text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-xl mt-2 border border-emerald-200/60">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{stop.safetyNote}</span>
                        </div>
                      )}

                      {stop.address && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1.5">
                          <MapPin className="w-3 h-3" />
                          <span>{stop.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stop Itemized Costs */}
                  <div className="sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200/80 min-w-[130px] self-start flex-shrink-0">
                    <div className="text-[10px] uppercase font-bold text-slate-500">{t('stopExpensesTitle')}</div>
                    {stop.transportCost > 0 && (
                      <div className="text-xs text-slate-700">{t('transitCostLabel')} <strong>₹{stop.transportCost}</strong></div>
                    )}
                    {stop.activityCost > 0 && (
                      <div className="text-xs text-slate-700">{t('activityCostLabel')} <strong>₹{stop.activityCost}</strong></div>
                    )}
                    <div className="text-sm font-extrabold text-slate-900 border-t border-slate-200 mt-1 pt-1">
                      ₹{stop.transportCost + stop.activityCost}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Validation Notice & Transparency */}
          <div
            className={`p-4 rounded-2xl text-xs border ${
              itinerary.validation?.isValid
                ? 'bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {itinerary.validation?.isValid ? (
              <p>
                <strong>{t('budgetInvariantGuaranteeLabel')}</strong> {t('budgetInvariantGuaranteeText')} (Sum = ₹{itinerary.estimatedCost} ≤ ₹{itinerary.totalBudget})
              </p>
            ) : (
              <p>
                <strong>Constraints not satisfied:</strong> the itemized plan totals ₹{itinerary.estimatedCost} against a ₹{itinerary.totalBudget} budget{itinerary.validation?.isOverTime ? `, and the schedule exceeds your ${itinerary.durationHours}h window` : ''}.
              </p>
            )}
            {(itinerary.validation?.warnings?.length ?? 0) > 0 && (
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {itinerary.validation.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
