/**
 * TrueTransit End-to-End API Smoke Test
 *
 * Exercises the principal user journeys against a RUNNING backend instance:
 *   A. Auto-rickshaw fair-price check (price search + quotation verdict)
 *   B. Evening route comparison (safety heatmap + 3 route alternatives)
 *   C. Budget-constrained itinerary generation + deterministic validation
 *   D. Offline emergency bootstrap (cached pack served by API)
 *   E. Community report submission + idempotent offline sync (duplicate prevention)
 *   F. Authentication & role-based authorization (admin moderation gate)
 *
 * Usage:
 *   1. start the backend (npm run dev / npm start) on PORT
 *   2. npx ts-node src/tests/apiSmoke.ts
 *
 * Exits with code 0 when every assertion passes, 1 otherwise.
 */

const BASE = process.env.API_BASE || 'http://127.0.0.1:5000/api/v1';

type Result = { name: string; ok: boolean; detail: string };
const results: Result[] = [];

function check(name: string, ok: boolean, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '  ✅ PASS' : '  ❌ FAIL'}: ${name}${detail ? ` — ${detail}` : ''}`);
}

async function call(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<{ status: number; json: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, json };
}

async function main() {
  console.log(`\n🧪 TrueTransit API smoke tests → ${BASE}\n`);

  // ── Health ────────────────────────────────────────────────────────────────
  const health = await call('GET', '/health');
  check('Journey 0: backend health endpoint responds', health.status === 200 && health.json?.status === 'ONLINE', `status=${health.status}`);

  // ── Journey A: Auto-rickshaw fare check ──────────────────────────────────
  const fare = await call(
    'GET',
    '/prices/search?category=TRANSPORT&itemName=Delhi%20Auto-Rickshaw%20Ride&distanceKm=4.5&timeOfDay=DAY&' +
      'quotedPrice=180'
  );
  const est = fare.json?.data;
  const expectedTypical = Math.round(30 + (4.5 - 1.5) * 11); // ₹63
  check(
    'Journey A: fair auto fare uses official tariff (₹63 for 4.5 km)',
    fare.status === 200 && est?.typicalPrice === expectedTypical,
    `typical=${est?.typicalPrice} expected=${expectedTypical}`
  );
  check(
    'Journey A: ₹180 quote flagged above estimated range',
    est?.comparison?.verdict === 'SIGNIFICANTLY_ABOVE',
    `verdict=${est?.comparison?.verdict}`
  );
  check(
    'Journey A: estimate carries a source and disclaimer',
    Boolean(est?.source && est?.disclaimer)
  );

  const nightFare = await call(
    'GET',
    '/prices/search?category=TRANSPORT&itemName=Delhi%20Auto-Rickshaw%20Ride&distanceKm=4.5&timeOfDay=NIGHT'
  );
  check(
    'Journey A: night tariff applies +25% surcharge',
    (nightFare.json?.data?.typicalPrice ?? 0) > (est?.typicalPrice ?? 0),
    `day=${est?.typicalPrice} night=${nightFare.json?.data?.typicalPrice}`
  );

  const water = await call(
    'GET',
    '/prices/search?category=COMMODITY&itemName=Packaged%20Drinking%20Water%20(1L)&quantity=2&' +
      'quotedPrice=100'
  );
  check(
    'Journey A: water benchmark respects statutory MRP + quantity',
    water.json?.data?.typicalPrice === 40 && water.json?.data?.comparison?.verdict === 'SIGNIFICANTLY_ABOVE',
    `typical=${water.json?.data?.typicalPrice}`
  );

  // Demo/verified labelling: heuristic fallback must be marked demo, official tariff must not
  const heuristic = await call(
    'GET',
    '/prices/search?category=SERVICE&itemName=Some%20Unlisted%20Service%20Item&quantity=1'
  );
  check(
    'Journey A: heuristic fallback estimate is labelled as demo data',
    heuristic.json?.data?.pricingModel === 'ESTIMATED_RANGE' && heuristic.json?.metadata?.isDemoData === true,
    `pricingModel=${heuristic.json?.data?.pricingModel} isDemoData=${heuristic.json?.metadata?.isDemoData}`
  );
  check(
    'Journey A: official-tariff estimate is labelled as verified (not demo)',
    est?.pricingModel === 'PER_KM_OFFICIAL_METER' && fare.json?.metadata?.isDemoData === false,
    `isDemoData=${fare.json?.metadata?.isDemoData}`
  );

  // ── Journey B: evening route comparison ──────────────────────────────────
  const heat = await call('GET', '/safety/heatmap?hour=21');
  const features = heat.json?.geoJson?.features ?? [];
  check('Journey B: heatmap returns GeoJSON zone features', heat.status === 200 && features.length >= 10, `${features.length} features`);
  check(
    'Journey B: every heat zone exposes score + evidence + disclaimer',
    features.every((f: any) => typeof f.properties.safetyScore === 'number' && f.properties.evidenceRationale && f.properties.disclaimer)
  );
  const nightZone = features.find((f: any) => f.properties.name.includes('Hauz Khas'));
  const dayHeat = await call('GET', '/safety/heatmap?hour=12');
  const dayZone = (dayHeat.json?.geoJson?.features ?? []).find((f: any) => f.properties.name.includes('Hauz Khas'));
  check(
    'Journey B: 21:00 scores differ from 12:00 scores (time slider is live)',
    nightZone && dayZone && nightZone.properties.safetyScore !== dayZone.properties.safetyScore,
    `21:00=${nightZone?.properties.safetyScore} 12:00=${dayZone?.properties.safetyScore}`
  );

  const routes = await call('POST', '/safety/routes', {
    originName: 'Connaught Place',
    originLat: 28.6315,
    originLng: 77.2167,
    destName: 'AIIMS New Delhi',
    destLat: 28.5672,
    destLng: 77.21,
    hour: 21,
  });
  const routeList = routes.json?.routes ?? [];
  const types = routeList.map((r: any) => r.type);
  check(
    'Journey B: three alternatives (FASTEST / SAFEST / BALANCED) returned',
    routeList.length === 3 && ['FASTEST', 'SAFEST', 'BALANCED'].every(t => types.includes(t)),
    `types=${types.join(',')}`
  );
  check(
    'Journey B: every route has distance, duration, waypoints and rationale',
    routeList.every((r: any) => r.distanceKm > 0 && r.durationMinutes > 0 && Array.isArray(r.waypoints) && r.waypoints.length >= 2 && r.rationale)
  );
  const safest = routeList.find((r: any) => r.type === 'SAFEST');
  const fastest = routeList.find((r: any) => r.type === 'FASTEST');
  check(
    'Journey B: safest route outranks fastest on safety score at 21:00',
    safest && fastest && safest.safetyScore > fastest.safetyScore,
    `safest=${safest?.safetyScore} fastest=${fastest?.safetyScore}`
  );

  // ── Journey C: budget-constrained itinerary ──────────────────────────────
  const itin = await call('POST', '/itineraries/generate', {
    startingPoint: 'New Delhi Railway Station',
    destination: 'AIIMS New Delhi',
    freeHours: 4,
    totalBudget: 1500,
    purpose: 'Medical Appointment & Lunch',
    transportPreference: 'BALANCED',
  });
  const data = itin.json?.data;
  const itemized = (data?.stops ?? []).reduce(
    (sum: number, s: any) => sum + Number(s.transportCost || 0) + Number(s.activityCost || 0),
    0
  );
  check('Journey C: itinerary generation succeeds (201)', itin.status === 201 && Boolean(data), `status=${itin.status}`);
  check('Journey C: itinerary has 3–5 structured stops', (data?.stops?.length ?? 0) >= 3 && (data?.stops?.length ?? 0) <= 5, `stops=${data?.stops?.length}`);
  check(
    'Journey C: displayed estimated cost equals the sum of itemized stops',
    data && itemized === data.estimatedCost,
    `itemized=${itemized} estimated=${data?.estimatedCost}`
  );
  check(
    'Journey C: deterministic validator agrees with displayed total',
    data?.validation?.totalCalculatedCost === itemized,
    `validation=${data?.validation?.totalCalculatedCost}`
  );
  check(
    'Journey C: plan fits inside ₹1500 budget',
    Boolean(data) && (data.estimatedCost <= 1500) === Boolean(data.validation.isValid),
    `cost=${data?.estimatedCost} isValid=${data?.validation?.isValid}`
  );

  // Over-budget plan must be flagged invalid by the deterministic validator
  const validate = await call('POST', '/itineraries/validate', {
    totalBudget: 300,
    freeHours: 4,
    stops: [
      { orderIndex: 1, placeName: 'A', category: 'TRANSIT', arrivalTime: '10:00 AM', departureTime: '10:30 AM', activityCost: 0, transportCost: 250, travelMethod: 'Metro' },
      { orderIndex: 2, placeName: 'B', category: 'ATTRACTION', arrivalTime: '11:00 AM', departureTime: '12:00 PM', activityCost: 300, transportCost: 0, travelMethod: 'Walk' },
    ],
  });
  check(
    'Journey C: over-budget plan is reported invalid (₹550 vs ₹300)',
    validate.json?.validation?.isOverBudget === true && validate.json?.validation?.isValid === false,
    `isOverBudget=${validate.json?.validation?.isOverBudget}`
  );

  // ── Journey D: offline emergency bootstrap ───────────────────────────────
  const pack = await call('GET', '/emergency/bootstrap?city=Delhi');
  const d = pack.json?.data;
  check(
    'Journey D: offline bootstrap pack includes hotlines, facilities and fare rules',
    pack.status === 200 && d?.emergencyNumbers?.police === '112' && (d?.emergencyFacilities?.length ?? 0) > 0 && d?.offlineFareRules?.autoRickshaw?.perKm === 11
  );
  const sos = await call('POST', '/emergency/sos', { lat: 28.6315, lng: 77.2167, message: 'test' });
  check(
    'Journey D: SOS returns dial-able content without claiming delivery',
    sos.status === 200 && typeof sos.json?.smsContent === 'string' && Array.isArray(sos.json?.directDialNumbers) && !/delivered|sent to/i.test(sos.json?.notice ?? '')
  );

  // ── Journey E: report submission + idempotent sync ───────────────────────
  const priceReport = await call('POST', '/prices/reports', {
    category: 'TRANSPORT',
    itemName: 'Delhi Auto-Rickshaw Ride',
    localityName: 'Connaught Place',
    quotedPrice: 500,
    clientUuid: `smoke-price-${Date.now()}`,
  });
  check('Journey E: price report accepted with moderation status', priceReport.status === 201, `status=${priceReport.status}`);
  check(
    'Journey E: extreme price report is flagged for moderation (not labelled a scam)',
    priceReport.json?.report?.status === 'PENDING' && priceReport.json?.report?.isOutlier === true,
    `status=${priceReport.json?.report?.status}`
  );

  const safetyReport = await call('POST', '/safety/reports', {
    latitude: 28.6432,
    longitude: 77.2135,
    category: 'POOR_LIGHTING',
    severity: 'MEDIUM',
    description: 'Lamp post out near the station back lane.',
    clientUuid: `smoke-safety-${Date.now()}`,
  });
  check('Journey E: safety report accepted', safetyReport.status === 201, `status=${safetyReport.status}`);

  const uuid = `smoke-sync-${Date.now()}`;
  const syncBody = {
    priceReports: [{ clientUuid: uuid, category: 'FOOD', itemName: 'Chole Bhature', localityName: 'Chandni Chowk', quotedPrice: 95 }],
    safetyReports: [{ clientUuid: `${uuid}-s`, latitude: 28.6315, longitude: 77.2167, category: 'ISOLATED_AREA', description: 'Dark stretch near parking block.' }],
  };
  const sync1 = await call('POST', '/sync', syncBody);
  const sync2 = await call('POST', '/sync', syncBody);
  check(
    'Journey E: first sync persists queued reports',
    (sync1.json?.syncSummary?.priceReportsSynced === 1 && sync1.json?.syncSummary?.safetyReportsSynced === 1),
    JSON.stringify(sync1.json?.syncSummary)
  );
  check(
    'Journey E: replaying the same sync is idempotent (duplicates skipped)',
    sync2.json?.syncSummary?.skippedDuplicates === 2 && sync2.json?.syncSummary?.priceReportsSynced === 0,
    JSON.stringify(sync2.json?.syncSummary)
  );

  // Malformed sync payloads must be rejected/skipped without crashing the server
  const malformedSync = await call('POST', '/sync', { priceReports: 'not-an-array', safetyReports: [{ clientUuid: '', latitude: 'x', longitude: 'y' }] });
  check(
    'Journey E: malformed sync payload is rejected gracefully (no crash)',
    malformedSync.status === 200 && malformedSync.json?.syncSummary?.errors?.length > 0,
    `errors=${JSON.stringify(malformedSync.json?.syncSummary?.errors)}`
  );
  const nanSync = await call('POST', '/sync', { priceReports: [{ clientUuid: `nan-${Date.now()}`, itemName: 'Chole Bhature', quotedPrice: 'abc' }] });
  check(
    'Journey E: sync rejects NaN quoted price instead of persisting garbage',
    nanSync.status === 200 && nanSync.json?.syncSummary?.priceReportsSynced === 0 && nanSync.json?.syncSummary?.errors?.length > 0,
    JSON.stringify(nanSync.json?.syncSummary)
  );

  // ── F: auth + role based authorization ───────────────────────────────────
  const login = await call('POST', '/auth/login', { email: 'admin@truetransit.com', password: 'admin123' });
  check('F: demo admin login succeeds', login.status === 200 && Boolean(login.json?.token));

  const traveler = await call('POST', '/auth/login', { email: 'traveler@truetransit.com', password: 'traveler123' });
  const travelerToken = traveler.json?.token;

  const anonAdmin = await call('GET', '/admin/overview');
  check('F: admin endpoints reject anonymous callers (401)', anonAdmin.status === 401, `status=${anonAdmin.status}`);

  const travelerAdmin = await call('GET', '/admin/overview', undefined, travelerToken);
  check('F: admin endpoints reject non-admin users (403)', travelerAdmin.status === 403, `status=${travelerAdmin.status}`);

  const adminOverview = await call('GET', '/admin/overview', undefined, login.json?.token);
  check('F: admin overview returns metrics for admins', adminOverview.status === 200 && Boolean(adminOverview.json?.data?.overview));

  const mod = await call('PATCH', '/admin/reports/price/does-not-exist', { action: 'APPROVED' }, login.json?.token);
  check('F: moderating a missing report returns 404 rather than 500', mod.status === 404, `status=${mod.status}`);

  const guest = await call('POST', '/auth/guest');
  const guestProfile = await call('GET', '/auth/me', undefined, guest.json?.token);
  check('F: guest session works and exposes no private data', guest.status === 200 && guestProfile.status === 200 && guestProfile.json?.user?.isGuest === true);

  const badLogin = await call('POST', '/auth/login', { email: 'nobody@example.com', password: 'wrong' });
  check('F: invalid credentials return 401', badLogin.status === 401);

  const invalidBody = await call('POST', '/itineraries/generate', { destination: '', startingPoint: '', freeHours: 'abc' });
  check('F: malformed input is rejected with 400', invalidBody.status === 400, `status=${invalidBody.status}`);

  // ── Report ───────────────────────────────────────────────────────────────
  const failed = results.filter(r => !r.ok);
  console.log(`\n=============================================`);
  console.log(`🏁 API Smoke Summary: ${results.length - failed.length} Passed, ${failed.length} Failed`);
  console.log(`=============================================\n`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('❌ Smoke test run crashed:', err);
  process.exit(1);
});
