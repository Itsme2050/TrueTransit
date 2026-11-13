"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting TrueTransit Database Seeding...');
    // 1. Seed Users (Admin & Demo Traveler)
    const salt = await bcryptjs_1.default.genSalt(10);
    const adminPassword = await bcryptjs_1.default.hash('admin123', salt);
    const travelerPassword = await bcryptjs_1.default.hash('traveler123', salt);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@truetransit.com' },
        update: {},
        create: {
            email: 'admin@truetransit.com',
            passwordHash: adminPassword,
            fullName: 'TrueTransit Lead Moderator',
            role: 'ADMIN',
            preferredLanguage: 'en',
        },
    });
    const traveler = await prisma.user.upsert({
        where: { email: 'traveler@truetransit.com' },
        update: {},
        create: {
            email: 'traveler@truetransit.com',
            passwordHash: travelerPassword,
            fullName: 'Aarav Sharma',
            role: 'USER',
            preferredLanguage: 'en',
            bloodGroup: 'O+',
            emergencyNote: 'Mild peanut allergy. Contact family emergency contact immediately.',
            emergencyContacts: {
                create: [
                    { contactName: 'Rohan Sharma', phoneNumber: '+91 98110 12345', relationship: 'Brother', priority: 1 },
                    { contactName: 'Ananya Sharma', phoneNumber: '+91 98110 54321', relationship: 'Spouse', priority: 2 },
                ],
            },
        },
    });
    console.log('✅ Users seeded: Admin and Traveler');
    // 2. Seed Delhi Localities
    const localities = [
        { name: 'Connaught Place', city: 'Delhi', lat: 28.6315, lng: 77.2167, zoneType: 'COMMERCIAL_HIGH_SECURITY' },
        { name: 'Paharganj', city: 'Delhi', lat: 28.6432, lng: 77.2135, zoneType: 'HIGH_DENSITY_TOURIST' },
        { name: 'Chandni Chowk', city: 'Delhi', lat: 28.6562, lng: 77.2309, zoneType: 'HISTORIC_MARKET' },
        { name: 'Karol Bagh', city: 'Delhi', lat: 28.6517, lng: 77.1906, zoneType: 'RETAIL_CORRIDOR' },
        { name: 'Hauz Khas Village', city: 'Delhi', lat: 28.5534, lng: 77.1945, zoneType: 'NIGHTLIFE_CORRIDOR' },
        { name: 'Saket City Centre', city: 'Delhi', lat: 28.5284, lng: 77.2185, zoneType: 'COMMERCIAL_MALLS' },
        { name: 'New Delhi Railway Station', city: 'Delhi', lat: 28.6429, lng: 77.2201, zoneType: 'TRANSIT_HUB' },
    ];
    const localityMap = new Map();
    for (const loc of localities) {
        const record = await prisma.locality.upsert({
            where: { id: `loc-${loc.name.toLowerCase().replace(/\s+/g, '-')}` },
            update: {},
            create: {
                id: `loc-${loc.name.toLowerCase().replace(/\s+/g, '-')}`,
                name: loc.name,
                city: loc.city,
                latitude: loc.lat,
                longitude: loc.lng,
                zoneType: loc.zoneType,
            },
        });
        localityMap.set(loc.name, record.id);
    }
    console.log(`✅ ${localities.length} Localities seeded`);
    // 3. Seed Verified Price References
    const cpLocId = localityMap.get('Connaught Place');
    const priceRefs = [
        {
            localityId: cpLocId,
            category: 'TRANSPORT',
            itemName: 'Delhi Auto-Rickshaw Ride',
            minPrice: 30,
            maxPrice: 300,
            typicalPrice: 95,
            pricingModel: 'PER_KM_OFFICIAL_METER',
            source: 'Delhi Government Transport Department Notification',
            confidence: 0.98,
            formulaParams: JSON.stringify({ baseFare: 30, baseKm: 1.5, perKm: 11, nightPct: 25 }),
        },
        {
            localityId: cpLocId,
            category: 'COMMODITY',
            itemName: 'Packaged Drinking Water (1L)',
            minPrice: 20,
            maxPrice: 20,
            typicalPrice: 20,
            pricingModel: 'FIXED',
            source: 'Legal Metrology (Packaged Commodities) Act',
            confidence: 1.0,
        },
        {
            localityId: cpLocId,
            category: 'FOOD',
            itemName: 'Chole Bhature (Standard Serving)',
            minPrice: 70,
            maxPrice: 140,
            typicalPrice: 90,
            pricingModel: 'FIXED',
            source: 'Local Food Stall Guild Survey 2025',
            confidence: 0.92,
        },
        {
            localityId: cpLocId,
            category: 'SERVICE',
            itemName: 'Luggage Cloakroom (Railway/Metro 24h)',
            minPrice: 30,
            maxPrice: 60,
            typicalPrice: 40,
            pricingModel: 'FIXED',
            source: 'IRCTC / DMRC Cloakroom Tariff',
            confidence: 0.95,
        },
    ];
    for (const ref of priceRefs) {
        await prisma.priceReference.create({ data: ref });
    }
    console.log('✅ Price References seeded');
    // 4. Seed Verified Emergency Facilities
    const emergencyFacilities = [
        {
            name: 'AIIMS New Delhi (Apex Trauma & Emergency)',
            type: 'HOSPITAL',
            address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
            phone: '011-26588500',
            latitude: 28.5672,
            longitude: 77.2100,
            is24Hours: true,
        },
        {
            name: 'Safdarjung Hospital Emergency Wing',
            type: 'HOSPITAL',
            address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
            phone: '011-26165060',
            latitude: 28.5705,
            longitude: 77.2072,
            is24Hours: true,
        },
        {
            name: 'Delhi Police Station - Connaught Place',
            type: 'POLICE_STATION',
            address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
            phone: '112',
            latitude: 28.6295,
            longitude: 77.2140,
            is24Hours: true,
        },
        {
            name: 'Tourist Police Assistance Unit (HQ)',
            type: 'POLICE_STATION',
            address: 'Janpath Toll Booth, Connaught Place, New Delhi',
            phone: '8750871111',
            latitude: 28.6270,
            longitude: 77.2185,
            is24Hours: true,
        },
        {
            name: 'Apollo 24/7 Pharmacy - Connaught Place',
            type: 'PHARMACY',
            address: 'Block E, Radial Road 3, Connaught Place, New Delhi',
            phone: '1860-500-0101',
            latitude: 28.6330,
            longitude: 77.2190,
            is24Hours: true,
        },
    ];
    for (const fac of emergencyFacilities) {
        await prisma.emergencyFacility.create({ data: fac });
    }
    console.log('✅ Emergency Facilities seeded');
    // 5. Seed Demonstration Safety Reports
    const sampleSafetyReports = [
        {
            latitude: 28.6432,
            longitude: 28.6432 > 0 ? 77.2135 : 77.2135,
            localityName: 'Paharganj Main Bazaar',
            category: 'POOR_LIGHTING',
            severity: 'MEDIUM',
            description: 'Street light out on lane connecting Main Bazaar to Chuna Mandi. Uneven pavement.',
            status: 'ACTIVE',
            clientUuid: 'seed-safety-1',
        },
        {
            latitude: 28.6429,
            longitude: 77.2201,
            localityName: 'New Delhi Railway Station Outer Road',
            category: 'SCAM_HOTSPOT',
            severity: 'HIGH',
            description: 'Unauthorized touts falsely telling travelers that Delhi tourism office is closed and redirecting to private agencies.',
            status: 'ACTIVE',
            clientUuid: 'seed-safety-2',
        },
        {
            latitude: 28.6315,
            longitude: 77.2167,
            localityName: 'Connaught Place Radial 2',
            category: 'INFRASTRUCTURE_HAZARD',
            severity: 'LOW',
            description: 'Temporary municipal sidewalk repair near Block B corridor.',
            status: 'ACTIVE',
            clientUuid: 'seed-safety-3',
        },
    ];
    for (const sr of sampleSafetyReports) {
        await prisma.safetyReport.create({ data: sr });
    }
    // 6. Seed Demonstration Price Reports
    const samplePriceReports = [
        {
            localityId: cpLocId,
            category: 'TRANSPORT',
            itemName: 'Auto Rickshaw to India Gate (3.5 km)',
            quotedPrice: 150,
            paidPrice: 70,
            vendorName: 'Auto DL 1R 8832',
            notes: 'Driver initially demanded ₹150; agreed to meter fare of ₹70 after seeing TrueTransit price estimate.',
            status: 'APPROVED',
            isOutlier: false,
            confidenceScore: 0.95,
            clientUuid: 'seed-price-1',
        },
        {
            localityId: cpLocId,
            category: 'COMMODITY',
            itemName: 'Packaged Drinking Water (1L)',
            quotedPrice: 35,
            paidPrice: 20,
            vendorName: 'Corner Stall',
            notes: 'Stall charged ₹35 "cooling charge"; pointed out MRP ₹20 law and paid MRP.',
            status: 'APPROVED',
            isOutlier: false,
            confidenceScore: 0.9,
            clientUuid: 'seed-price-2',
        },
        {
            localityId: cpLocId,
            category: 'FOOD',
            itemName: 'Chole Bhature with Lassi',
            quotedPrice: 110,
            paidPrice: 110,
            vendorName: 'Kwality Corner',
            notes: 'Freshly prepared, clean seating and verified hygienic preparation.',
            status: 'APPROVED',
            isOutlier: false,
            confidenceScore: 0.92,
            clientUuid: 'seed-price-3',
        },
    ];
    for (const pr of samplePriceReports) {
        await prisma.priceReport.create({ data: pr });
    }
    console.log('✅ Demonstration Price & Safety Reports seeded');
    console.log('🎉 TrueTransit Database Seeding Completed Successfully!');
}
main()
    .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
