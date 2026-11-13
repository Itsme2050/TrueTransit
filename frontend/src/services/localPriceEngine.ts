import { FairPriceEstimate } from '../types';
import { DELHI_FAMOUS_STREET_FOODS } from '../data/streetFoods';

export interface LocalPriceParams {
  category?: string;
  itemName: string;
  distanceKm?: number;
  timeOfDay?: string;
  quantity?: number;
  localityName?: string;
  quotedPrice?: number;
}

export class LocalPriceEngine {
  public static calculate(params: LocalPriceParams): { data: FairPriceEstimate; metadata: any } {
    const itemName = params.itemName || 'Delhi Auto-Rickshaw Ride';
    const isAuto = itemName.toLowerCase().includes('auto') || itemName.toLowerCase().includes('rickshaw');
    const isMetro = itemName.toLowerCase().includes('metro') || itemName.toLowerCase().includes('dmrc') || itemName.toLowerCase().includes('multimodal');
    const isNight = params.timeOfDay === 'NIGHT';
    const distance = Math.max(0.5, Number(params.distanceKm) || 4.5);
    const qty = Math.max(1, Number(params.quantity) || 1);

    let baseFare = 30;
    let baseKm = 1.5;
    let perKm = 11;
    let nightMultiplier = 0.25;
    let nightSurcharge = 0;

    let computedFare = baseFare;
    let typicalPrice = 0;
    let minPrice = 0;
    let maxPrice = 0;
    let unitType = 'trip';
    let source = 'Delhi Transport Department (Statutory Tariff Schedule)';
    let pricingModel = isAuto ? 'PER_KM' : 'FIXED';

    // Check street food match
    const foodMatch = DELHI_FAMOUS_STREET_FOODS.find((f) => {
      const names = Object.values(f.name);
      return names.some((n) => itemName.toLowerCase().includes(n.toLowerCase())) || itemName.toLowerCase().includes(f.id);
    });

    if (foodMatch) {
      typicalPrice = foodMatch.priceRange.typical * qty;
      minPrice = foodMatch.priceRange.min * qty;
      maxPrice = foodMatch.priceRange.max * qty;
      unitType = foodMatch.unit.en;
      source = 'Local Market Survey (Delhi Street Food Baseline)';
      pricingModel = 'FIXED_BENCHMARK';
    } else if (params.category === 'COMMODITY' || itemName.toLowerCase().includes('water')) {
      typicalPrice = 20 * qty;
      minPrice = 20 * qty;
      maxPrice = 20 * qty;
      unitType = 'bottle';
      source = 'Statutory MRP (Packaged Commodities Rules)';
      pricingModel = 'FIXED_BENCHMARK';
    } else if (params.category === 'SERVICE' || itemName.toLowerCase().includes('cloakroom')) {
      typicalPrice = 40 * qty;
      minPrice = 30 * qty;
      maxPrice = 60 * qty;
      unitType = 'bag/24hr';
      source = 'IRCTC / DMRC Cloakroom Tariff 24h';
      pricingModel = 'FIXED_BENCHMARK';
    } else if (isMetro) {
      // Multimodal: First-Mile + DMRC Metro + Last-Mile
      const firstMile = distance > 3 ? 15 : 0;
      let metroFare = 20;
      if (distance <= 2) metroFare = 10;
      else if (distance <= 5) metroFare = 20;
      else if (distance <= 12) metroFare = 30;
      else if (distance <= 21) metroFare = 40;
      else if (distance <= 32) metroFare = 50;
      else metroFare = 60;
      const lastMile = distance > 6 ? 15 : 0;
      computedFare = firstMile + metroFare + lastMile;
      typicalPrice = computedFare * qty;
      minPrice = Math.round(typicalPrice * 0.95);
      maxPrice = Math.round(typicalPrice * 1.15);
      source = 'DMRC Statutory Tariff & Feeder Regulations';
    } else {
      if (distance > baseKm) {
        computedFare += (distance - baseKm) * perKm;
      }
      nightSurcharge = isNight ? computedFare * nightMultiplier : 0;
      typicalPrice = Math.round((computedFare + nightSurcharge) * qty);
      minPrice = Math.round(typicalPrice * 0.95);
      maxPrice = Math.round(typicalPrice * 1.15);
    }

    let comparison: any = undefined;
    if (params.quotedPrice !== undefined && params.quotedPrice > 0) {
      const quoted = Number(params.quotedPrice);
      const diff = quoted - typicalPrice;
      const pct = Math.round((diff / typicalPrice) * 100);

      let verdict: 'FAIR' | 'SLIGHTLY_ABOVE' | 'SIGNIFICANTLY_ABOVE' | 'BELOW_TYPICAL' = 'FAIR';
      let verdictLabel = 'Fair Statutory Rate';
      let advice = 'The quoted rate matches statutory Delhi Transport Department meter tariffs.';

      if (pct > 50) {
        verdict = 'SIGNIFICANTLY_ABOVE';
        verdictLabel = `Significantly Above Estimated Range (+${pct}%)`;
        advice = 'Driver is quoting significantly above statutory meter fare. Insist on using the meter or use official Delhi Police pre-paid booth.';
      } else if (pct > 15) {
        verdict = 'SLIGHTLY_ABOVE';
        verdictLabel = `Slightly Above Estimated Range (+${pct}%)`;
        advice = 'Slightly above standard tariff, often requested for heavy traffic or return empty trip.';
      } else if (pct < -15) {
        verdict = 'BELOW_TYPICAL';
        verdictLabel = `Below Typical Tariff (${pct}%)`;
        advice = 'Unusually low rate; ensure drop location and route are confirmed upfront.';
      }

      comparison = {
        quotedPrice: quoted,
        differenceAmount: diff,
        differencePercentage: pct,
        verdict,
        verdictLabel,
        advice,
      };
    }

    const estimate: FairPriceEstimate = {
      category: params.category || 'TRANSPORT',
      itemName,
      minPrice,
      maxPrice,
      typicalPrice,
      currency: 'INR',
      pricingModel,
      breakdown: isAuto
        ? {
            distanceKm: distance,
            baseFare,
            baseKm,
            distanceCharge: Math.round(distance > baseKm ? (distance - baseKm) * perKm : 0),
            nightSurcharge: Math.round(nightSurcharge),
            isNightTariff: isNight,
          }
        : { quantity: qty, unitType },
      confidence: 0.95,
      freshness: 'Verified via statutory tariff benchmark',
      source,
      disclaimer: 'Calculated using TrueTransit statutory fare benchmarks and market surveys.',
      comparison,
    };

    return {
      data: estimate,
      metadata: {
        isDemoData: true,
        isCommunityReport: false,
        city: 'Delhi',
        demoMode: true,
        queriedAt: new Date().toISOString(),
      },
    };
  }
}
