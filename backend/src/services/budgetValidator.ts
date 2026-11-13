/**
 * Deterministic Budget & Schedule Validator for TrueTransit Itinerary Planner
 * Enforces programmatic mathematical validation on all AI and user-generated itineraries.
 */

export interface ItineraryStopInput {
  orderIndex: number;
  placeName: string;
  category: string;
  arrivalTime: string;
  departureTime: string;
  activityCost: number;
  transportCost: number;
  travelMethod: string;
  safetyNote?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface ItineraryValidationInput {
  totalBudget: number;
  freeHours: number;
  stops: ItineraryStopInput[];
}

export interface BudgetValidationReport {
  isValid: boolean;
  totalBudget: number;
  totalCalculatedCost: number;
  remainingBudget: number;
  varianceAmount: number;
  isOverBudget: boolean;
  totalDurationMinutes: number;
  availableMinutes: number;
  isOverTime: boolean;
  itemizedCosts: {
    transportTotal: number;
    activityTotal: number;
  };
  reconciledStops: ItineraryStopInput[];
  warnings: string[];
  adjustmentsMade: string[];
}

export class BudgetValidator {
  /**
   * Strictly validates itemized stop costs against user's max budget and free time.
   * Deterministically corrects rounding drift or flags budget breaches.
   */
  public static validate(input: ItineraryValidationInput): BudgetValidationReport {
    const warnings: string[] = [];
    const adjustmentsMade: string[] = [];
    const maxBudget = Math.max(0, input.totalBudget);
    const availableMinutes = Math.max(30, Math.round(input.freeHours * 60));

    let transportTotal = 0;
    let activityTotal = 0;
    const reconciledStops: ItineraryStopInput[] = [];

    // 1. Sanitize stop itemizations and compute true sum
    for (const stop of input.stops) {
      const sanitizedTransport = Math.max(0, Math.round(Number(stop.transportCost) || 0));
      const sanitizedActivity = Math.max(0, Math.round(Number(stop.activityCost) || 0));

      transportTotal += sanitizedTransport;
      activityTotal += sanitizedActivity;

      reconciledStops.push({
        ...stop,
        transportCost: sanitizedTransport,
        activityCost: sanitizedActivity,
      });
    }

    const totalCalculatedCost = transportTotal + activityTotal;
    const remainingBudget = maxBudget - totalCalculatedCost;
    const isOverBudget = totalCalculatedCost > maxBudget;
    const varianceAmount = isOverBudget ? totalCalculatedCost - maxBudget : 0;

    if (isOverBudget) {
      warnings.push(
        `Calculated expenses (₹${totalCalculatedCost}) exceed specified budget (₹${maxBudget}) by ₹${varianceAmount}. Recommended to switch transport to Delhi Metro or reduce paid activity stops.`
      );
    }

    // 2. Schedule validation from the actual stop timeline (arrival of first stop
    // to departure of last stop). Falls back to a 50 min/stop estimate when the
    // times are missing or unparseable.
    const timelineMinutes = this.computeTimelineMinutes(reconciledStops);
    const estimatedMinutes = timelineMinutes ?? reconciledStops.length * 50;
    const isOverTime = estimatedMinutes > availableMinutes;
    if (isOverTime) {
      warnings.push(
        `Itinerary pace is tight: the plan runs ${Math.round(estimatedMinutes / 60)}h (${estimatedMinutes} min) against an allocated ${input.freeHours}h free window.`
      );
    }

    // 3. Reconcile if minor rounding drift occurred (within 5% over budget)
    if (isOverBudget && totalCalculatedCost <= maxBudget * 1.05) {
      // Scale down non-essential activity margins slightly to fit exact budget
      const trimAmount = totalCalculatedCost - maxBudget;
      for (const stop of reconciledStops) {
        if (stop.activityCost > trimAmount) {
          stop.activityCost -= trimAmount;
          adjustmentsMade.push(`Adjusted discretionary allocation at "${stop.placeName}" by ₹${trimAmount} to fit strict budget cap.`);
          break;
        }
      }
    }

    const finalTransport = reconciledStops.reduce((sum, s) => sum + s.transportCost, 0);
    const finalActivity = reconciledStops.reduce((sum, s) => sum + s.activityCost, 0);
    const recomputedTotal = finalTransport + finalActivity;

    return {
      isValid: recomputedTotal <= maxBudget && !isOverTime,
      totalBudget: maxBudget,
      totalCalculatedCost: recomputedTotal,
      remainingBudget: Math.max(0, maxBudget - recomputedTotal),
      varianceAmount: recomputedTotal > maxBudget ? recomputedTotal - maxBudget : 0,
      isOverBudget: recomputedTotal > maxBudget,
      totalDurationMinutes: estimatedMinutes,
      availableMinutes,
      isOverTime,
      itemizedCosts: {
        transportTotal: finalTransport,
        activityTotal: finalActivity,
      },
      reconciledStops,
      warnings,
      adjustmentsMade,
    };
  }

  /**
   * Total span, in minutes, between the first stop's arrival and the last stop's
   * departure. Returns null when any timestamp cannot be parsed so callers can fall
   * back to a heuristic. Handles both "10:00 AM" and 24h "10:00" formats.
   */
  private static computeTimelineMinutes(stops: ItineraryStopInput[]): number | null {
    if (stops.length === 0) return 0;
    const start = this.parseClock(stops[0].arrivalTime);
    const end = this.parseClock(stops[stops.length - 1].departureTime);
    if (start === null || end === null) return null;
    let span = end - start;
    if (span <= 0) span += 24 * 60; // itinerary crosses midnight
    return span;
  }

  private static parseClock(value?: string): number | null {
    if (!value) return null;
    const match = String(value).trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
    if (!match) return null;
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toLowerCase();
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }
}
