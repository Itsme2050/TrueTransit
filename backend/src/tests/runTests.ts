import { PriceEngine } from '../services/priceEngine';
import { BudgetValidator } from '../services/budgetValidator';
import { SafetyEngine } from '../services/safetyEngine';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` (${detail})` : ''}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('\n=============================================');
  console.log('🧪 TrueTransit Automated Engine Test Suite');
  console.log('=============================================\n');

  // TEST SUITE 1: ANTI-SCAM PRICE INDEX ENGINE
  console.log('--- Suite 1: Anti-Scam Price Index Engine ---');
  {
    // Auto-Rickshaw calculation
    const autoDay = PriceEngine.calculateEstimate({
      category: 'TRANSPORT',
      itemName: 'Delhi Auto-Rickshaw Ride',
      distanceKm: 5.0,
      timeOfDay: 'DAY',
    });
    // Expected: 30 for first 1.5km + 3.5 * 11 = 30 + 38.5 = 68.5 -> ~69
    assert(autoDay.typicalPrice >= 65 && autoDay.typicalPrice <= 75, 'Auto Rickshaw 5km Day Fare matches tariff (~₹69)', `Got ₹${autoDay.typicalPrice}`);
    assert(autoDay.minPrice < autoDay.typicalPrice && autoDay.maxPrice > autoDay.typicalPrice, 'Price range encompasses fair bounds');

    // Auto-Rickshaw Night Fare (25% surcharge)
    const autoNight = PriceEngine.calculateEstimate({
      category: 'TRANSPORT',
      itemName: 'Delhi Auto-Rickshaw Ride',
      distanceKm: 5.0,
      timeOfDay: 'NIGHT',
    });
    assert(autoNight.typicalPrice > autoDay.typicalPrice, 'Night surcharge increases fare', `Night: ₹${autoNight.typicalPrice} vs Day: ₹${autoDay.typicalPrice}`);

    // Outlier detection
    const isOutlierNormal = PriceEngine.detectOutlier(80, 70);
    const isOutlierGouged = PriceEngine.detectOutlier(450, 70);
    const isOutlierTooLow = PriceEngine.detectOutlier(2, 70);
    assert(!isOutlierNormal, 'Normal reasonable fare is not flagged as outlier');
    assert(isOutlierGouged, 'Extreme fare (450 vs 70 typical) is correctly flagged as outlier');
    assert(isOutlierTooLow, 'Extremely low fare (2 vs 70 typical) is correctly flagged as outlier');

    // Quoted comparison
    const evalFair = PriceEngine.evaluateQuotation(70, 70, 80);
    assert(evalFair?.verdict === 'FAIR', 'Exact typical quote returns FAIR verdict');
    const evalScam = PriceEngine.evaluateQuotation(300, 70, 80);
    assert(evalScam?.verdict === 'SIGNIFICANTLY_ABOVE', 'Overcharged quote returns SIGNIFICANTLY_ABOVE');
  }

  // TEST SUITE 2: DETERMINISTIC BUDGET VALIDATOR
  console.log('\n--- Suite 2: Deterministic Budget Validator ---');
  {
    // Test within budget
    const validPlan = BudgetValidator.validate({
      totalBudget: 1500,
      freeHours: 4,
      stops: [
        { orderIndex: 1, placeName: 'Metro Stop', category: 'TRANSIT', arrivalTime: '10:00 AM', departureTime: '10:30 AM', transportCost: 40, activityCost: 0, travelMethod: 'Metro' },
        { orderIndex: 2, placeName: 'Heritage Monument', category: 'ATTRACTION', arrivalTime: '10:45 AM', departureTime: '12:00 PM', transportCost: 0, activityCost: 250, travelMethod: 'Walking' },
        { orderIndex: 3, placeName: 'Authentic Lunch', category: 'FOOD', arrivalTime: '12:15 PM', departureTime: '01:15 PM', transportCost: 50, activityCost: 200, travelMethod: 'Auto' },
      ],
    });
    assert(validPlan.isValid === true, 'Strict budget verification passes when total <= budget');
    assert(validPlan.totalCalculatedCost === 540, `Itemized total computed accurately (₹540)`, `Got ₹${validPlan.totalCalculatedCost}`);
    assert(validPlan.remainingBudget === 960, `Remaining budget computed accurately (₹960)`, `Got ₹${validPlan.remainingBudget}`);

    // Test over budget
    const overPlan = BudgetValidator.validate({
      totalBudget: 500,
      freeHours: 3,
      stops: [
        { orderIndex: 1, placeName: 'Expensive Cab', category: 'TRANSIT', arrivalTime: '10:00 AM', departureTime: '10:30 AM', transportCost: 400, activityCost: 0, travelMethod: 'Cab' },
        { orderIndex: 2, placeName: 'Luxury Lunch', category: 'FOOD', arrivalTime: '11:00 AM', departureTime: '12:00 PM', transportCost: 0, activityCost: 500, travelMethod: 'Walking' },
      ],
    });
    assert(overPlan.isValid === false, 'Over budget plan correctly invalidates');
    assert(overPlan.isOverBudget === true, 'isOverBudget flag is set true');
    assert(overPlan.warnings.length > 0, 'Clear explanatory warning provided for budget excess');
  }

  // TEST SUITE 3: CHRONO-SAFETY SCORING & ROUTING
  console.log('\n--- Suite 3: Chrono-Safety Heatmap & Routing ---');
  {
    const dayScore = SafetyEngine.calculateChronoScore(28.6315, 77.2167, 14, 0, 'COMMERCIAL');
    const nightScore = SafetyEngine.calculateChronoScore(28.6315, 77.2167, 2, 0, 'COMMERCIAL');

    assert(dayScore.score > nightScore.score, 'Daytime safety score is higher than 2 AM score due to daylight vitality');
    assert(dayScore.score >= 0 && dayScore.score <= 100, 'Score is strictly bounded in 0-100 range');

    // Route alternatives
    const routes = SafetyEngine.generateRouteAlternatives(
      { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
      { name: 'AIIMS New Delhi', lat: 28.5672, lng: 77.2100 },
      21
    );
    assert(routes.length === 3, 'Generates 3 alternatives (Fastest, Safest, Balanced)');
    const fastest = routes.find(r => r.type === 'FASTEST');
    const safest = routes.find(r => r.type === 'SAFEST');
    assert(Boolean(fastest && safest), 'Both Fastest and Safest routes generated');
    if (fastest && safest) {
      assert(safest.safetyScore >= fastest.safetyScore, 'Safest route has equal or superior safety score to shortest bypass');
      assert(safest.distanceKm >= fastest.distanceKm, 'Safest route trades minor extra distance for well-lit arterial coverage');
    }
  }

  console.log('\n=============================================');
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
