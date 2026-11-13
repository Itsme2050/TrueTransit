import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Info,
  PlusCircle,
  ArrowUpRight,
  Route,
  RefreshCw,
  Train,
  Footprints,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Clock,
  MapPin,
  Utensils,
  Award,
  Flame,
  ExternalLink,
  ChevronRight,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { FairPriceEstimate, PriceSearchMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useLocationState } from '../context/LocationContext';
import { calculateMultimodalJourney, MultimodalTripEstimate } from '../data/dmrcMetro';
import { DELHI_FAMOUS_STREET_FOODS, StreetFoodItem, getLocalizedFood } from '../data/streetFoods';

interface PriceCheckPageProps {
  onOpenReportModal: () => void;
}

export const PriceCheckPage: React.FC<PriceCheckPageProps> = ({ onOpenReportModal }) => {
  const { t, language } = useLanguage();
  const { originName, originCoords, destName, destCoords, activeRouteDistanceKm, selectedRouteName, activeHour } = useLocationState();
  const [category, setCategory] = useState<'TRANSPORT' | 'FOOD' | 'COMMODITY' | 'SERVICE'>('TRANSPORT');
  const [itemName, setItemName] = useState('Delhi Auto-Rickshaw Ride');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('chole-bhature');
  const [distanceKm, setDistanceKm] = useState<number>(activeRouteDistanceKm || 4.5);
  const [timeOfDay, setTimeOfDay] = useState<'DAY' | 'NIGHT'>(activeHour >= 23 || activeHour < 5 ? 'NIGHT' : 'DAY');
  const [locality, setLocality] = useState(originName || 'Connaught Place');
  const [quotedPrice, setQuotedPrice] = useState<string>('180');
  const [quantity, setQuantity] = useState<number>(1);
  const [estimate, setEstimate] = useState<FairPriceEstimate | null>(null);
  const [meta, setMeta] = useState<PriceSearchMeta | null>(null);
  const [multimodalTrip, setMultimodalTrip] = useState<MultimodalTripEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Selected famous Delhi street food when Food category is active
  const selectedFood: StreetFoodItem | null =
    category === 'FOOD'
      ? DELHI_FAMOUS_STREET_FOODS.find((f) => f.id === selectedFoodId) ||
        DELHI_FAMOUS_STREET_FOODS.find((f) => {
          const names = Object.values(f.name);
          return names.some((n) => itemName.toLowerCase().includes(n.toLowerCase())) || itemName.toLowerCase().includes(f.id);
        }) ||
        DELHI_FAMOUS_STREET_FOODS[0]
      : null;

  // Localized street food strings in the user's selected language only
  const locFood = selectedFood ? getLocalizedFood(selectedFood, language) : null;

  // Keep itemName in sync when user switches language
  useEffect(() => {
    if (category === 'FOOD' && selectedFood) {
      const localized = getLocalizedFood(selectedFood, language);
      setItemName(localized.name);
    }
  }, [language, category, selectedFoodId]);

  // Synchronize locality and trip distance with user's active route
  useEffect(() => {
    if (originName) {
      setLocality(originName);
    }
  }, [originName]);

  useEffect(() => {
    if (activeRouteDistanceKm && activeRouteDistanceKm > 0) {
      setDistanceKm(activeRouteDistanceKm);
    }
  }, [activeRouteDistanceKm]);

  // Multimodal trip calculation for DMRC Metro + Local Feeder
  useEffect(() => {
    const isMultimodal = itemName.toLowerCase().includes('metro') || itemName.toLowerCase().includes('dmrc') || itemName.toLowerCase().includes('multimodal');
    if (isMultimodal) {
      const oCoords = originCoords && originCoords.lat ? originCoords : { lat: 28.6667, lng: 77.2285 }; // Default Kashmere Gate
      const dCoords = destCoords && destCoords.lat ? destCoords : { lat: 28.6328, lng: 77.2195 }; // Default Rajiv Chowk
      const trip = calculateMultimodalJourney(
        originName || 'Departure Point',
        oCoords,
        destName || 'Destination Point',
        dCoords
      );
      setMultimodalTrip(trip);
      if (trip.totalDirectDistanceKm && (!activeRouteDistanceKm || activeRouteDistanceKm <= 0)) {
        setDistanceKm(trip.totalDirectDistanceKm);
      }
    } else {
      setMultimodalTrip(null);
    }
  }, [itemName, originName, originCoords, destName, destCoords, activeRouteDistanceKm]);

  const calculateFairPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiClient.searchPrices({
        category,
        itemName,
        distanceKm: category === 'TRANSPORT' ? Number(distanceKm) : undefined,
        timeOfDay,
        quantity: Number(quantity) || 1,
        localityName: locality,
        quotedPrice: quotedPrice ? Number(quotedPrice) : undefined,
      });
      if (res.data) {
        setEstimate(res.data);
        setMeta(res.metadata ?? null);
      } else {
        setEstimate(null);
        setError('No estimate available for this item yet. Try another item or report a price to build local data.');
      }
    } catch (err: any) {
      setEstimate(null);
      setMeta(null);
      setError(
        err?.message?.includes('Failed to fetch') || err?.message?.includes('Network')
          ? 'Backend unreachable. Check that the API server is running, then press Recalculate.'
          : err?.message || 'Could not calculate a fair price. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateFairPrice();
  }, [category, itemName, distanceKm, timeOfDay, quantity]);

  // Translate breakdown field names
  const translateBreakdownKey = (key: string) => {
    const map: Record<string, string> = {
      distanceKm: t('breakdownDistanceKm'),
      baseFare: t('breakdownBaseFare'),
      baseKm: t('breakdownBaseKm'),
      distanceCharge: t('breakdownDistanceCharge'),
      nightSurcharge: t('breakdownNightSurcharge'),
      isNightTariff: t('breakdownIsNightTariff'),
      isNightTariffApplied: t('breakdownIsNightTariff'),
    };
    return map[key] || key.replace(/([A-Z])/g, ' $1');
  };

  // Translate verdict
  const getVerdictText = (verdict: string) => {
    if (verdict === 'FAIR') return t('verdictFair');
    if (verdict === 'SLIGHTLY_ABOVE') return t('verdictSlightlyAbove');
    if (verdict === 'SIGNIFICANTLY_ABOVE') return t('verdictSignificantlyAbove');
    return t('verdictBelowTypical');
  };

  const getVerdictAdvice = (verdict: string, defaultAdvice: string) => {
    if (verdict === 'SIGNIFICANTLY_ABOVE') return t('verdictAdviceQuotedHigher');
    if (verdict === 'FAIR') {
      if (language === 'hi') return 'मांगा गया मूल्य उचित सीमा के भीतर है। आप सुरक्षित रूप से आगे बढ़ सकते हैं।';
      if (language === 'fr') return 'Le prix proposé se situe dans la fourchette équitable. Vous pouvez accepter en confiance.';
      if (language === 'zh') return '卖家报价在合理区间内，属公道交易，可放心成交。';
      return defaultAdvice;
    }
    if (verdict === 'SLIGHTLY_ABOVE') {
      if (language === 'hi') return 'मांगा गया मूल्य सामान्य से थोड़ा अधिक है। ₹10-20 कम कराने का प्रयास कर सकते हैं।';
      if (language === 'fr') return 'Le prix est légèrement supérieur. Une négociation de 10 à 20 ₹ est envisageable.';
      if (language === 'zh') return '要价略高于基准，可尝试适当还价 10-20 卢比。';
      return defaultAdvice;
    }
    return defaultAdvice;
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2.5">
            <Tag className="w-7 h-7 text-teal-600" />
            <span>{t('antiScamPriceIndexHeading')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('priceCheckHeaderDesc')}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('reportPriceBtn')}</span>
        </button>
      </div>

      {/* Route Synchronization Banner */}
      {originName && destName && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs flex-shrink-0">
              <Route className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-teal-800">
                Connected to Active Journey
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {originName} ➔ {destName}
              </div>
              <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                Trip Distance: <span className="font-bold">{distanceKm} km</span> ({selectedRouteName})
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setCategory('TRANSPORT');
                setItemName('DMRC Metro + Local Feeder Transport');
                setLocality(originName);
                if (activeRouteDistanceKm) setDistanceKm(activeRouteDistanceKm);
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Train className="w-3.5 h-3.5 text-teal-200" />
              <span>DMRC Metro + Feeder</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('TRANSPORT');
                setItemName('Delhi Auto-Rickshaw Ride');
                setLocality(originName);
                if (activeRouteDistanceKm) setDistanceKm(activeRouteDistanceKm);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-teal-300 text-teal-800 text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
              <span>Sync Trip Distance ({activeRouteDistanceKm} km)</span>
            </button>
          </div>
        </div>
      )}

      {/* Calculator & Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>{t('serviceInputsTitle')}</span>
          </h2>

          {/* Category Tabs */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">{t('categoryLabel')}</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => {
                  setCategory('TRANSPORT');
                  setItemName('DMRC Metro + Local Feeder Transport');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  category === 'TRANSPORT' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('transportCategory')}
              </button>
              <button
                onClick={() => {
                  setCategory('FOOD');
                  const food = DELHI_FAMOUS_STREET_FOODS.find((f) => f.id === selectedFoodId) || DELHI_FAMOUS_STREET_FOODS[0];
                  const loc = getLocalizedFood(food, language);
                  setItemName(loc.name);
                  setQuotedPrice(String(food.priceRange.typical));
                  setLocality(food.famousSpots[0].locality);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  category === 'FOOD' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('foodCategory')}
              </button>
              <button
                onClick={() => {
                  setCategory('COMMODITY');
                  setItemName('Packaged Drinking Water (1L)');
                  setQuotedPrice('20');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  category === 'COMMODITY' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('commodityCategory')}
              </button>
              <button
                onClick={() => {
                  setCategory('SERVICE');
                  setItemName('Luggage Cloakroom (Railway/Metro 24h)');
                  setQuotedPrice('40');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  category === 'SERVICE' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('serviceCategory')}
              </button>
            </div>
          </div>

          {/* Famous Street Foods Showcase Grid */}
          {category === 'FOOD' && (
            <div className="space-y-2 pt-1 pb-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {language === 'hi'
                      ? 'दिल्ली के प्रसिद्ध स्ट्रीट फूड'
                      : language === 'fr'
                      ? 'Spécialités de rue de Delhi'
                      : language === 'zh'
                      ? '德里著名街头美食'
                      : "Delhi's Famous Street Foods"}
                  </span>
                </label>
                <span className="text-[10px] text-teal-700 font-extrabold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {DELHI_FAMOUS_STREET_FOODS.length} {language === 'hi' ? 'व्यंजन' : language === 'fr' ? 'plats' : language === 'zh' ? '道名吃' : 'Iconic Dishes'}
                </span>
              </div>

              {/* Clean text-based cards without emojis or bilingual mixing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {DELHI_FAMOUS_STREET_FOODS.map((food) => {
                  const isSelected = selectedFood?.id === food.id;
                  const itemLoc = getLocalizedFood(food, language);
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => {
                        setSelectedFoodId(food.id);
                        setItemName(itemLoc.name);
                        setQuotedPrice(String(food.priceRange.typical));
                        if (food.famousSpots && food.famousSpots[0]) {
                          setLocality(food.famousSpots[0].locality);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer relative ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-500 shadow-xs ring-1 ring-teal-500'
                          : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {itemLoc.name}
                          </span>
                          <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100/70 px-1.5 py-0.5 rounded flex-shrink-0">
                            ₹{food.priceRange.typical}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                          {itemLoc.tag}
                        </div>
                      </div>
                      <div className="text-[9px] text-teal-700 font-medium mt-1.5 truncate flex items-center space-x-1">
                        <MapPin className="w-2.5 h-2.5 text-teal-600 flex-shrink-0" />
                        <span className="truncate">{food.famousSpots[0].name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Item Selector */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">{t('itemNameLabel')}</label>
            <select
              value={itemName}
              onChange={(e) => {
                const val = e.target.value;
                setItemName(val);
                const foodMatch = DELHI_FAMOUS_STREET_FOODS.find((f) => {
                  const names = Object.values(f.name);
                  return names.some((n) => n === val) || f.id === val;
                });
                if (foodMatch) {
                  setSelectedFoodId(foodMatch.id);
                  setQuotedPrice(String(foodMatch.priceRange.typical));
                  if (foodMatch.famousSpots && foodMatch.famousSpots[0]) {
                    setLocality(foodMatch.famousSpots[0].locality);
                  }
                }
              }}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            >
              {category === 'TRANSPORT' && (
                <>
                  <option value="DMRC Metro + Local Feeder Transport">{t('optDmrcMetroFeeder')}</option>
                  <option value="Delhi Auto-Rickshaw Ride">{t('optDelhiAuto')}</option>
                  <option value="Delhi Standard AC Taxi">{t('optDelhiTaxi')}</option>
                </>
              )}
              {category === 'FOOD' && (
                <>
                  {DELHI_FAMOUS_STREET_FOODS.map((food) => {
                    const itemLoc = getLocalizedFood(food, language);
                    return (
                      <option key={food.id} value={itemLoc.name}>
                        {itemLoc.name} — Typical ₹{food.priceRange.typical}
                      </option>
                    );
                  })}
                  <option value="Tender Coconut Water">Tender Coconut Water — Typical ₹60</option>
                </>
              )}
              {category === 'COMMODITY' && (
                <>
                  <option value="Packaged Drinking Water (1L)">{t('optPackagedWater')}</option>
                  <option value="SIM Card Tourist Pack (30 days)">{t('optSimCard')}</option>
                </>
              )}
              {category === 'SERVICE' && (
                <>
                  <option value="Luggage Cloakroom (Railway/Metro 24h)">{t('optLuggageCloakroom')}</option>
                  <option value="Shoe Keeping at Monument">{t('optShoeKeeping')}</option>
                </>
              )}
            </select>
          </div>

          {/* Transport Specific: Distance */}
          {category === 'TRANSPORT' && (
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                <span>{t('tripDistanceLabel')}</span>
                <span className="font-bold text-teal-700">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{t('shortHop')}</span>
                <span>{t('cityAverage')}</span>
                <span>{t('airportCrossCity')}</span>
              </div>
            </div>
          )}

          {/* Locality */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">{t('localityLabel')}</label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder={t('localityPlaceholder')}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Quantity */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
              <span>{t('quantityLabel')}</span>
              <span className="font-bold text-teal-700">{quantity} {quantity === 1 ? t('unitSingular') : t('unitPlural')}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Time of Day */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">{t('timeOfDayLabel')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimeOfDay('DAY')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  timeOfDay === 'DAY'
                    ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('regularDayTime')}</span>
              </button>
              <button
                type="button"
                onClick={() => setTimeOfDay('NIGHT')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  timeOfDay === 'NIGHT'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t('nightFareTariff')}</span>
              </button>
            </div>
          </div>

          {/* Quoted Price Input for Anti-Scam Comparison */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block mb-1">
              {t('quotedPriceQuestion')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input
                type="number"
                placeholder={t('quotedPricePlaceholder')}
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {t('quotedPriceHint')}
            </p>
          </div>

          <button
            onClick={calculateFairPrice}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-colors active:scale-98"
          >
            {loading ? t('evaluatingIndex') : t('recalculatePriceBtn')}
          </button>
        </div>

        {/* Right Output Comparison Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading && !estimate && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4" aria-busy="true">
              <div className="h-28 w-full rounded-2xl bg-slate-100 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
            </div>
          )}

          {error && !loading && (
            <div
              className="bg-white p-6 rounded-3xl border border-amber-300 shadow-sm space-y-3"
              role="alert"
            >
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Unable to load estimate</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
              <button
                onClick={calculateFairPrice}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-colors"
              >
                Retry calculation
              </button>
            </div>
          )}

          {estimate && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              
              {/* If Multimodal DMRC + Feeder is Selected */}
              {multimodalTrip ? (
                <div className="space-y-5">
                  {/* Multimodal Banner & Overview */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 border border-teal-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-600 text-white text-[11px] font-extrabold tracking-wide uppercase mb-1.5">
                          <Train className="w-3.5 h-3.5" />
                          <span>DMRC Metro + Feeder Multimodal</span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-baseline space-x-2">
                          <span>₹{multimodalTrip.totalCombinedCost}</span>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Total Combined Fair Fare
                          </span>
                        </div>
                        <div className="text-xs font-medium text-teal-800 mt-1 flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>Est. Travel Time: <strong>~{multimodalTrip.totalCombinedMinutes} mins</strong> door-to-door</span>
                        </div>
                      </div>

                      <div className="sm:text-right bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-teal-200/80">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Savings vs Private Cab</div>
                        <div className="text-lg font-extrabold text-emerald-700 flex items-center sm:justify-end space-x-1">
                          <TrendingDown className="w-4 h-4 text-emerald-600" />
                          <span>Save ₹{multimodalTrip.savingsVsDirectCab}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          vs ₹{multimodalTrip.directCabCost} Direct Cab quote
                        </div>
                      </div>
                    </div>

                    {/* Mode Fare Comparison Bar */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-teal-200/60 text-center">
                      <div className="p-2 rounded-xl bg-teal-600 text-white">
                        <div className="text-[10px] font-semibold opacity-90">🚇 Metro + Feeder</div>
                        <div className="text-sm font-extrabold mt-0.5">₹{multimodalTrip.totalCombinedCost}</div>
                        <div className="text-[9px] opacity-80">Recommended</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800">
                        <div className="text-[10px] font-medium text-slate-500">🛺 Direct Auto</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">₹{multimodalTrip.directAutoCost}</div>
                        <div className="text-[9px] text-slate-400">Metered</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800">
                        <div className="text-[10px] font-medium text-slate-500">🚕 Direct Taxi / Cab</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">₹{multimodalTrip.directCabCost}</div>
                        <div className="text-[9px] text-rose-500 font-semibold">+Surge Risk</div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Leg Journey Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Route className="w-4 h-4 text-teal-600" />
                      <span>Itemized 3-Leg Multimodal Route & Cost Breakdown</span>
                    </h3>

                    {/* Leg 1: First-Mile */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`p-2 rounded-xl ${multimodalTrip.firstMile.isFreeWalk ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                            {multimodalTrip.firstMile.isFreeWalk ? <Footprints className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Step 1: First-Mile Leg</span>
                            <h4 className="text-xs font-bold text-slate-900">
                              {originName || 'Origin Address'} ➔ {multimodalTrip.originMetroStation.name}
                            </h4>
                          </div>
                        </div>

                        <div>
                          {multimodalTrip.firstMile.isFreeWalk ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              🚶 10-Min Walk Rule: ₹0 FREE
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 border border-teal-300">
                              🛺 {multimodalTrip.firstMile.mode === 'E_RICKSHAW' ? 'E-Rickshaw' : 'Metered Auto'}: ₹{multimodalTrip.firstMile.cost}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-medium">
                        <span>Distance: <strong>{multimodalTrip.firstMile.distanceKm} km</strong></span>
                        <span>•</span>
                        <span>Time: <strong>~{multimodalTrip.firstMile.durationMinutes} mins</strong></span>
                        <span>•</span>
                        <span className="text-slate-500 italic">{multimodalTrip.firstMile.advice}</span>
                      </div>
                    </div>

                    {/* Leg 2: DMRC Metro Leg */}
                    <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="p-2 rounded-xl bg-blue-600 text-white">
                            <Train className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-blue-600">Step 2: DMRC Rapid Transit</span>
                            <h4 className="text-xs font-bold text-slate-900">
                              {multimodalTrip.originMetroStation.name} ➔ {multimodalTrip.destMetroStation.name}
                            </h4>
                          </div>
                        </div>

                        <div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                            🚇 DMRC Ticket: ₹{multimodalTrip.metroFare}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-medium">
                        <span className="text-blue-800 font-bold bg-blue-100/80 px-2 py-0.5 rounded-md">
                          {multimodalTrip.metroLineRecommendation}
                        </span>
                        <span>Distance: <strong>{multimodalTrip.metroDistanceKm} km</strong></span>
                        <span>•</span>
                        <span>Transit Time: <strong>~{multimodalTrip.metroDurationMinutes} mins</strong></span>
                      </div>
                      <p className="text-[11px] text-blue-900/80">
                        Statutory DMRC fare slab. Zero traffic delay risk, air conditioned with dedicated women's coach.
                      </p>
                    </div>

                    {/* Leg 3: Last-Mile */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`p-2 rounded-xl ${multimodalTrip.lastMile.isFreeWalk ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                            {multimodalTrip.lastMile.isFreeWalk ? <Footprints className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Step 3: Last-Mile Leg</span>
                            <h4 className="text-xs font-bold text-slate-900">
                              {multimodalTrip.destMetroStation.name} ➔ {destName || 'Destination Address'}
                            </h4>
                          </div>
                        </div>

                        <div>
                          {multimodalTrip.lastMile.isFreeWalk ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              🚶 10-Min Walk Rule: ₹0 FREE
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 border border-teal-300">
                              🛺 {multimodalTrip.lastMile.mode === 'E_RICKSHAW' ? 'E-Rickshaw' : 'Metered Auto'}: ₹{multimodalTrip.lastMile.cost}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-medium">
                        <span>Distance: <strong>{multimodalTrip.lastMile.distanceKm} km</strong></span>
                        <span>•</span>
                        <span>Time: <strong>~{multimodalTrip.lastMile.durationMinutes} mins</strong></span>
                        <span>•</span>
                        <span className="text-slate-500 italic">{multimodalTrip.lastMile.advice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quoted Price Comparison Alert for Multimodal */}
                  {quotedPrice && Number(quotedPrice) > 0 && (
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 transition-all ${
                        Number(quotedPrice) <= multimodalTrip.totalCombinedCost
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : Number(quotedPrice) <= multimodalTrip.totalCombinedCost * 1.5
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center space-x-2 font-extrabold text-sm">
                        {Number(quotedPrice) <= multimodalTrip.totalCombinedCost ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse flex-shrink-0" />
                        )}
                        <span>
                          {Number(quotedPrice) <= multimodalTrip.totalCombinedCost
                            ? 'Quoted Price Matches Fair Public Transport'
                            : Number(quotedPrice) <= multimodalTrip.totalCombinedCost * 1.5
                            ? `Quoted Price is Moderately Higher (+₹${Number(quotedPrice) - multimodalTrip.totalCombinedCost})`
                            : `Overpriced Quote vs DMRC Multimodal (+₹${Number(quotedPrice) - multimodalTrip.totalCombinedCost})`}
                        </span>
                      </div>
                      <p className="font-medium">
                        {Number(quotedPrice) > multimodalTrip.totalCombinedCost
                          ? `The driver quoted ₹${quotedPrice}. Taking DMRC Metro + Local Feeder costs only ₹${multimodalTrip.totalCombinedCost}, saving you ₹${Number(quotedPrice) - multimodalTrip.totalCombinedCost} while avoiding Delhi road congestion.`
                          : 'The quoted rate is in line with standard public transport options.'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Fair Price Range Card */
                <>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 via-teal-100/40 to-slate-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
                        {t('fairPriceRange')}
                      </div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        ₹{estimate.minPrice} <span className="text-slate-400 text-xl font-normal">—</span> ₹{estimate.maxPrice}
                      </div>
                      <div className="text-xs font-medium text-teal-900 mt-1">
                        {t('typicalReportedRate')} <strong className="font-extrabold text-teal-700">₹{estimate.typicalPrice}</strong>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-500">{t('confidenceScore')}</div>
                      <div className="text-lg font-bold text-emerald-700 flex items-center sm:justify-end space-x-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{Math.round(estimate.confidence * 100)}% {t('verifiedLabel')}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{t('verifiedTariffNotice')}</div>
                    </div>
                  </div>

                  {/* Quotation Comparison Alert */}
                  {estimate.comparison && (
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 transition-all ${
                        estimate.comparison.verdict === 'FAIR'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : estimate.comparison.verdict === 'SLIGHTLY_ABOVE'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center space-x-2 font-extrabold text-sm">
                        {estimate.comparison.verdict === 'FAIR' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse flex-shrink-0" />
                        )}
                        <span>{getVerdictText(estimate.comparison.verdict)}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 border border-current">
                          {estimate.comparison.differencePercentage > 0 ? `+${estimate.comparison.differencePercentage}%` : `${estimate.comparison.differencePercentage}%`}
                        </span>
                      </div>
                      <p className="font-medium">{getVerdictAdvice(estimate.comparison.verdict, estimate.comparison.advice)}</p>
                    </div>
                  )}
                </>
              )}

              {/* Newcomer Street Food Guide & Legendary Hotspots */}
              {category === 'FOOD' && selectedFood && locFood && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/20 to-white border border-slate-200/90 shadow-xs space-y-4">
                  {/* Dish Title & Meta Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex-shrink-0">
                        <Utensils className="w-5 h-5 text-teal-700" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-base sm:text-lg font-extrabold text-slate-900">
                            {locFood.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            selectedFood.isVegetarian
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {selectedFood.isVegetarian
                              ? (language === 'hi' ? 'शुद्ध शाकाहारी' : language === 'fr' ? '100% Végétarien' : language === 'zh' ? '纯素' : '100% Pure Vegetarian')
                              : (language === 'hi' ? 'मांसाहारी' : language === 'fr' ? 'Non-végétarien' : language === 'zh' ? '非素食' : 'Non-Vegetarian')}
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 flex items-center space-x-1">
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>{locFood.tag}</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span>{locFood.flavorProfile}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex-shrink-0">
                      <div className="text-[10px] uppercase font-bold text-slate-500">{t('benchmarkRateTitle') || 'Benchmark Rate'}</div>
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{selectedFood.priceRange.typical} <span className="text-[10px] font-medium text-slate-500">/ {locFood.unit}</span>
                      </div>
                      <div className="text-[10px] text-teal-700 font-semibold">
                        {language === 'hi' ? 'उचित सीमा' : language === 'fr' ? 'Fourchette équitable' : language === 'zh' ? '合理区间' : 'Safe Range'}: ₹{selectedFood.priceRange.min} – ₹{selectedFood.priceRange.max}
                      </div>
                    </div>
                  </div>

                  {/* What is this dish? */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1.5">
                      <Utensils className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        {language === 'hi'
                          ? 'व्यंजन परिचय'
                          : language === 'fr'
                          ? 'Présentation du plat'
                          : language === 'zh'
                          ? '美食介绍'
                          : 'What is this dish?'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                      {locFood.description}
                    </p>
                  </div>

                  {/* Legendary Authentic Stalls & Nearest Metro */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {language === 'hi'
                            ? 'प्रसिद्ध प्रामाणिक दुकानें व निकटतम मेट्रो'
                            : language === 'fr'
                            ? 'Échoppes authentiques & Métro'
                            : language === 'zh'
                            ? '传奇地道老店与最近地铁站'
                            : 'Authentic Stalls & Metro Directions'}
                        </span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {language === 'hi' ? 'स्थान चुनने के लिए Use दबाएं' : language === 'fr' ? 'Cliquez pour définir' : language === 'zh' ? '点击选择该地标' : 'Click Use to set locality'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {selectedFood.famousSpots.map((spot, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all space-y-1 group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 leading-snug group-hover:text-teal-700">
                              {spot.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setLocality(spot.locality)}
                              title="Set as locality"
                              className="text-[9px] text-teal-700 font-bold bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded border border-teal-200 cursor-pointer flex-shrink-0"
                            >
                              Use
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{spot.locality}</span>
                          </div>
                          <div className="text-[10px] text-blue-700 font-semibold bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-100 flex items-center space-x-1">
                            <Train className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="truncate">{spot.nearestMetro}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Newcomer Hygiene & Tourist Tip */}
                  <div className="p-3 rounded-xl bg-teal-50/90 border border-teal-200 flex items-start space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-bold text-teal-950">
                        {language === 'hi'
                          ? 'स्वच्छता और उचित मूल्य परामर्श'
                          : language === 'fr'
                          ? 'Conseils d\'hygiène & Anti-surfacturation'
                          : language === 'zh'
                          ? '卫生与合理消费提醒'
                          : 'Hygiene & Anti-Overcharge Advice'}
                      </div>
                      <p className="text-[11px] text-teal-900 leading-relaxed font-medium">
                        {locFood.touristTip}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown Details */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t('fareFormulaTitle')}
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
                  {Object.entries(estimate.breakdown).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                      <span>{translateBreakdownKey(key)}:</span>
                      <span className="font-bold text-slate-900">
                        {typeof val === 'boolean' ? (val ? t('yesLabel') : t('noLabel')) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source & Transparency Disclaimers */}
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3 space-y-1">
                <div>
                  <strong className="text-slate-700">{t('dataSourceLabel')}</strong>{' '}
                  {multimodalTrip
                    ? 'DMRC Statutory Fare Schedule (Notification 2024-2026) & Delhi Transport Department Feeder Guidelines'
                    : t('dataSourceText')}
                </div>
                <div>
                  <strong className="text-slate-700">{t('fairTradingNoticeLabel')}</strong>{' '}
                  {multimodalTrip
                    ? 'First/last-mile walk is ₹0 if distance is ≤ 0.8 km (approx. 10 minutes walk). Otherwise, standard E-Rickshaw (₹10-20) or metered auto tariff applies.'
                    : t('fairTradingNoticeText')}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
