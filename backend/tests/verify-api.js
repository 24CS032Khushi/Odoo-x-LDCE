import app from '../src/index.js';
import prisma from '../src/prisma.js';

let server;
const PORT = 4998;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

let testUserToken = '';
const testEmail = `explorer_phase2_${Date.now()}@example.com`;

const runTests = async () => {
  console.log('--- Starting GlobeTrotter Phase 2 API Verification ---\n');

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
    // 1. Signup & Auth
    console.log('1. User Signup for Phase 2:');
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
    assert(signupRes.status === 201 && signupData.data.token, 'User signup returns JWT');
    testUserToken = signupData.data.token;

    // 2. City Search & Filters
    console.log('\n2. City Search & Filters:');
    const citiesRes = await fetch(`${BASE_URL}/cities?search=Japan`);
    const citiesData = await citiesRes.json();
    assert(
      citiesRes.status === 200 &&
      citiesData.success &&
      citiesData.data.cities.length >= 2,
      'GET /api/v1/cities?search=Japan returns seeded Japanese cities (Kyoto, Tokyo)'
    );

    const kyotoCity = citiesData.data.cities.find((c) => c.name === 'Kyoto') || citiesData.data.cities[0];
    const tokyoCity = citiesData.data.cities.find((c) => c.name === 'Tokyo') || citiesData.data.cities[1];

    // 3. Activity Filtering
    console.log('\n3. Activity Filtering:');
    const activitiesRes = await fetch(`${BASE_URL}/activities?city_id=${kyotoCity.id}&category=culture`);
    const activitiesData = await activitiesRes.json();
    assert(
      activitiesRes.status === 200 &&
      activitiesData.success &&
      activitiesData.data.activities.length >= 1,
      'GET /api/v1/activities?city_id=X&category=culture returns filtered activities'
    );
    const sampleActivity = activitiesData.data.activities[0];

    // 4. Create Trip
    console.log('\n4. Create Trip:');
    const createTripRes = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        name: 'Japan Autumn Discovery',
        description: 'Exploring ancient temples and modern skylines',
        start_date: '2026-10-10',
        end_date: '2026-10-20',
        total_budget: '150000.00',
        cover_photo_url: kyotoCity.image_url
      })
    });
    const createTripData = await createTripRes.json();
    assert(
      createTripRes.status === 201 &&
      createTripData.success &&
      createTripData.data.trip.name === 'Japan Autumn Discovery' &&
      createTripData.data.trip.share_slug,
      'POST /api/v1/trips creates trip with auto-generated share_slug and owner collaborator'
    );
    const createdTrip = createTripData.data.trip;

    // 5. Add Stops to Trip
    console.log('\n5. Add Trip Stops:');
    const stop1Res = await fetch(`${BASE_URL}/trips/${createdTrip.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        city_id: kyotoCity.id,
        arrival_date: '2026-10-10',
        departure_date: '2026-10-15',
        order_index: 0
      })
    });
    const stop1Data = await stop1Res.json();

    const stop2Res = await fetch(`${BASE_URL}/trips/${createdTrip.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        city_id: tokyoCity.id,
        arrival_date: '2026-10-15',
        departure_date: '2026-10-20',
        order_index: 1
      })
    });
    const stop2Data = await stop2Res.json();

    assert(
      stop1Res.status === 201 && stop2Res.status === 201 &&
      stop1Data.data.stop.city.name === kyotoCity.name,
      'POST /api/v1/trips/:id/stops adds Kyoto and Tokyo stops to the trip'
    );
    const kyotoStop = stop1Data.data.stop;
    const tokyoStop = stop2Data.data.stop;

    // 6. Reorder Stops
    console.log('\n6. Reorder Trip Stops:');
    const reorderRes = await fetch(`${BASE_URL}/trips/${createdTrip.id}/stops/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        stops: [
          { id: tokyoStop.id, order_index: 0 },
          { id: kyotoStop.id, order_index: 1 }
        ]
      })
    });
    const reorderData = await reorderRes.json();
    assert(
      reorderRes.status === 200 &&
      reorderData.success &&
      reorderData.data.stops[0].id === tokyoStop.id,
      'PUT /api/v1/trips/:id/stops/reorder updates stop sequencing'
    );

    // 7. Add Itinerary Items to Stop
    console.log('\n7. Add Itinerary Items:');
    const addItemRes = await fetch(`${BASE_URL}/trips/${createdTrip.id}/itinerary-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        trip_stop_id: kyotoStop.id,
        activity_id: sampleActivity.id,
        day_number: 1,
        start_time: '09:30',
        order_index: 0,
        custom_cost: '3000.00'
      })
    });
    const addItemData = await addItemRes.json();
    assert(
      addItemRes.status === 201 &&
      addItemData.success &&
      addItemData.data.item.activity.name === sampleActivity.name,
      'POST /api/v1/trips/:id/itinerary-items schedules activity on Day 1'
    );
    const createdItem = addItemData.data.item;

    // 8. Get Day-Wise Structured Itinerary
    console.log('\n8. Get Structured Day-wise Itinerary:');
    const itineraryRes = await fetch(`${BASE_URL}/trips/${createdTrip.id}/itinerary`, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    const itineraryData = await itineraryRes.json();
    assert(
      itineraryRes.status === 200 &&
      itineraryData.success &&
      itineraryData.data.days['1'] &&
      itineraryData.data.activities_count === 1,
      'GET /api/v1/trips/:id/itinerary returns day-grouped schedule with effective activity costs'
    );

    // 9. Saved Destinations
    console.log('\n9. Saved Destinations:');
    const saveRes = await fetch(`${BASE_URL}/saved-destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({ city_id: kyotoCity.id })
    });
    const saveData = await saveRes.json();

    const getSavedRes = await fetch(`${BASE_URL}/saved-destinations`, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    const getSavedData = await getSavedRes.json();

    const delSavedRes = await fetch(`${BASE_URL}/saved-destinations/${kyotoCity.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${testUserToken}` }
    });

    assert(
      saveRes.status === 201 &&
      getSavedData.data.saved.length >= 1 &&
      delSavedRes.status === 200,
      'POST/GET/DELETE /api/v1/saved-destinations allows saving and unsaving favorite cities'
    );

    // 10. Clean up trip
    console.log('\n10. Delete Trip:');
    const delTripRes = await fetch(`${BASE_URL}/trips/${createdTrip.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    assert(delTripRes.status === 200, 'DELETE /api/v1/trips/:id deletes trip and cascades stops');

    console.log(`\n========================================`);
    console.log(`Phase 2 API Tests Completed: ${passed + failed}`);
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
