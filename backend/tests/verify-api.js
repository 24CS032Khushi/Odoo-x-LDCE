import app from '../src/index.js';
import prisma from '../src/prisma.js';

let server;
const PORT = 4998;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

let testUserToken = '';
let adminToken = '';
const testEmail = `explorer_phase4_${Date.now()}@example.com`;

const runTests = async () => {
  console.log('--- Starting GlobeTrotter Smart Complete API Verification (Phases 1-4) ---\n');

  server = app.listen(PORT);
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (details) console.error(`   Details:`, details);
      failed++;
    }
  };

  try {
    // 1. User Signup
    console.log('1. User Signup & JWT:');
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Explorer',
        email: testEmail,
        password: 'Password123!'
      })
    });
    const signupData = await signupRes.json();
    if (!signupData.data || !signupData.data.token) {
      console.error('Signup response debug:', signupRes.status, signupData);
    }
    assert(signupRes.status === 201 && signupData.data?.token, 'User signup returns JWT');
    testUserToken = signupData.data?.token;

    // 2. Admin Login
    console.log('\n2. Admin Authentication:');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@globetrotter.com',
        password: 'Password123!'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.data.user.role === 'admin', 'Admin login successful with admin role');
    adminToken = adminLoginData.data.token;

    // 3. City & Activity Fetch
    console.log('\n3. City & Activity Fetching:');
    const citiesRes = await fetch(`${BASE_URL}/cities?search=Paris`);
    const citiesData = await citiesRes.json();
    assert(citiesRes.status === 200 && citiesData.data.cities.length >= 1, 'GET /api/v1/cities returns seeded city');
    const parisCity = citiesData.data.cities[0];

    const activitiesRes = await fetch(`${BASE_URL}/activities?city_id=${parisCity.id}`);
    const activitiesData = await activitiesRes.json();
    assert(activitiesRes.status === 200 && activitiesData.data.activities.length >= 3, 'GET /api/v1/activities returns activities');
    const act1 = activitiesData.data.activities[0];
    const act2 = activitiesData.data.activities[1];

    // 4. Create Trip with Budget
    console.log('\n4. Create Trip:');
    const createTripRes = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        name: 'Paris Autumn Romance',
        description: 'Exploring romantic Paris landmarks and fine dining',
        start_date: '2026-10-10',
        end_date: '2026-10-14',
        total_budget: '50000.00',
        cover_photo_url: parisCity.image_url
      })
    });
    const createTripData = await createTripRes.json();
    assert(createTripRes.status === 201 && createTripData.data.trip.id, 'POST /api/v1/trips creates trip');
    const trip = createTripData.data.trip;

    // 5. Add Stop & Activities
    console.log('\n5. Add Stops & Itinerary Items:');
    const stopRes = await fetch(`${BASE_URL}/trips/${trip.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        city_id: parisCity.id,
        arrival_date: '2026-10-10',
        departure_date: '2026-10-14',
        order_index: 0
      })
    });
    const stopData = await stopRes.json();
    const stop = stopData.data.stop;

    const item1Res = await fetch(`${BASE_URL}/trips/${trip.id}/itinerary-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        trip_stop_id: stop.id,
        activity_id: act1.id,
        day_number: 1,
        start_time: '10:00',
        order_index: 0
      })
    });

    const item2Res = await fetch(`${BASE_URL}/trips/${trip.id}/itinerary-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        trip_stop_id: stop.id,
        activity_id: act2.id,
        day_number: 1,
        start_time: '14:00',
        order_index: 1
      })
    });
    assert(item1Res.status === 201 && item2Res.status === 201, 'POST /api/v1/trips/:id/itinerary-items adds items');

    // 6. Manual Expenses Logging
    console.log('\n6. Manual Expenses Logging:');
    const addExpenseRes = await fetch(`${BASE_URL}/trips/${trip.id}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        category: 'stay',
        amount: 32000.00,
        note: 'Boutique Hotel 4 Nights',
        trip_stop_id: stop.id
      })
    });
    const addExpenseData = await addExpenseRes.json();
    assert(addExpenseRes.status === 201 && addExpenseData.data.expense.id, 'POST /api/v1/trips/:id/expenses logs stay expense');

    // 7. Budget Breakdown & Suggestions
    console.log('\n7. Budget Analytics & Categorization:');
    const budgetRes = await fetch(`${BASE_URL}/trips/${trip.id}/budget`, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    const budgetData = await budgetRes.json();
    assert(
      budgetRes.status === 200 &&
      budgetData.data.categories.length === 5 &&
      budgetData.data.total_spent > 0,
      'GET /api/v1/trips/:id/budget returns categorized expenses with 5 standard buckets'
    );

    // 8. Trip Health Score
    console.log('\n8. Trip Health Score Engine:');
    const healthScoreRes = await fetch(`${BASE_URL}/trips/${trip.id}/health-score`, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    const healthScoreData = await healthScoreRes.json();
    assert(
      healthScoreRes.status === 200 &&
      healthScoreData.data.health_score.overall_score >= 0 &&
      healthScoreData.data.health_score.explanations.budget,
      'GET /api/v1/trips/:id/health-score returns overall score and 4 sub-scores with plain-language explanations'
    );

    // 9. Route / Day Sanity Checks
    console.log('\n9. Route & Day Sanity Checks:');
    const sanityRes = await fetch(`${BASE_URL}/trips/${trip.id}/sanity-checks`, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    const sanityData = await sanityRes.json();
    assert(sanityRes.status === 200 && Array.isArray(sanityData.data.flags), 'GET /api/v1/trips/:id/sanity-checks returns flags array');

    // 10. Public Share & Read-Only View
    console.log('\n10. Public Share Link & Visibility:');
    const publishRes = await fetch(`${BASE_URL}/trips/${trip.id}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({ is_public: true })
    });
    const publishData = await publishRes.json();
    assert(publishRes.status === 200 && publishData.data.is_public && publishData.data.share_slug, 'PUT /api/v1/trips/:id/publish enables public share');

    // Public fetch without token
    const publicRes = await fetch(`${BASE_URL}/share/${publishData.data.share_slug}`);
    const publicData = await publicRes.json();
    assert(
      publicRes.status === 200 &&
      publicData.data.trip.name === trip.name &&
      !publicData.data.trip.user?.email,
      'GET /api/v1/share/:share_slug returns read-only public itinerary without private owner email'
    );

    // 11. Copy Trip
    console.log('\n11. Copy / Clone Trip:');
    const copyRes = await fetch(`${BASE_URL}/trips/${trip.id}/copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      }
    });
    const copyData = await copyRes.json();
    assert(
      copyRes.status === 201 &&
      copyData.data.trip.name.startsWith('Copy of'),
      'POST /api/v1/trips/:id/copy duplicates trip with stops and itinerary items'
    );

    // 12. Admin Analytics
    console.log('\n12. Admin Dashboard & Analytics:');
    const adminAnalyticsRes = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminAnalyticsData = await adminAnalyticsRes.json();
    assert(
      adminAnalyticsRes.status === 200 &&
      adminAnalyticsData.data.summary.total_users >= 2 &&
      adminAnalyticsData.data.charts.popular_cities.length >= 1,
      'GET /api/v1/admin/analytics returns real platform statistics and charts data'
    );

    // Clean up
    await fetch(`${BASE_URL}/trips/${trip.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    await fetch(`${BASE_URL}/trips/${copyData.data.trip.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${testUserToken}` }
    });

    console.log(`\n========================================`);
    console.log(`Complete API Verification Suite: ${passed + failed} Tests`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
};

runTests();
