import app from '../src/index.js';
import prisma from '../src/prisma.js';

let server;
const PORT = 4999;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

let testUserToken = '';
const testEmail = `explorer_${Date.now()}@example.com`;

const runTests = async () => {
  console.log('--- Starting GlobeTrotter Phase 1 API Verification ---\n');

  // Start temporary test server instance
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
    // 1. Health check
    console.log('1. Testing Health Endpoint:');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.success === true, 'GET /api/v1/health returns 200 and success: true');

    // 2. Signup with valid details
    console.log('\n2. Testing User Signup:');
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Khushi Patel',
        email: testEmail,
        password: 'Password123!'
      })
    });
    const signupData = await signupRes.json();
    assert(
      signupRes.status === 201 &&
      signupData.success === true &&
      signupData.data.token &&
      signupData.data.user.email === testEmail &&
      !signupData.data.user.password_hash,
      'POST /api/v1/auth/signup creates user and returns JWT + user without password_hash'
    );
    testUserToken = signupData.data?.token;

    // 3. Signup with duplicate email
    console.log('\n3. Testing Duplicate Signup:');
    const dupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Explorer',
        email: testEmail,
        password: 'Password123!'
      })
    });
    const dupData = await dupRes.json();
    assert(
      dupRes.status === 409 &&
      dupData.success === false &&
      dupData.error.code === 'EMAIL_EXISTS',
      'POST /api/v1/auth/signup with duplicate email returns 409 EMAIL_EXISTS in error format'
    );

    // 4. Login with correct credentials
    console.log('\n4. Testing User Login:');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    assert(
      loginRes.status === 200 &&
      loginData.success === true &&
      loginData.data.token,
      'POST /api/v1/auth/login succeeds with valid credentials and issues JWT'
    );

    // 5. Login with invalid password
    console.log('\n5. Testing Invalid Login:');
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999'
      })
    });
    const badLoginData = await badLoginRes.json();
    assert(
      badLoginRes.status === 401 &&
      badLoginData.success === false &&
      badLoginData.error.code === 'INVALID_CREDENTIALS',
      'POST /api/v1/auth/login with wrong password returns 401 INVALID_CREDENTIALS'
    );

    // 6. Access protected route without token
    console.log('\n6. Testing Protected Route Without Token:');
    const noAuthRes = await fetch(`${BASE_URL}/users/me`);
    const noAuthData = await noAuthRes.json();
    assert(
      noAuthRes.status === 401 &&
      noAuthData.success === false &&
      noAuthData.error.code === 'UNAUTHORIZED',
      'GET /api/v1/users/me without token returns 401 UNAUTHORIZED in error format'
    );

    // 7. Access protected route with invalid token
    console.log('\n7. Testing Protected Route With Malformed Token:');
    const badTokenRes = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: 'Bearer invalid.jwt.token' }
    });
    const badTokenData = await badTokenRes.json();
    assert(
      badTokenRes.status === 401 &&
      badTokenData.success === false &&
      badTokenData.error.code === 'INVALID_TOKEN',
      'GET /api/v1/users/me with malformed token returns 401 INVALID_TOKEN'
    );

    // 8. Access protected route with valid token
    console.log('\n8. Testing Protected Route With Valid Token:');
    const authRes = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    const authData = await authRes.json();
    assert(
      authRes.status === 200 &&
      authData.success === true &&
      authData.data.user.email === testEmail,
      'GET /api/v1/users/me with valid Bearer token returns 200 and user profile'
    );

    // 9. Update user profile
    console.log('\n9. Testing User Profile Update:');
    const updateRes = await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`
      },
      body: JSON.stringify({
        name: 'Khushi Patel (Updated)',
        language: 'hi'
      })
    });
    const updateData = await updateRes.json();
    assert(
      updateRes.status === 200 &&
      updateData.success === true &&
      updateData.data.user.name === 'Khushi Patel (Updated)' &&
      updateData.data.user.language === 'hi',
      'PUT /api/v1/users/me updates name and language successfully'
    );

    // 10. Forgot password mock stub
    console.log('\n10. Testing Forgot Password Stub:');
    const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotData = await forgotRes.json();
    assert(
      forgotRes.status === 200 &&
      forgotData.success === true &&
      forgotData.data.message,
      'POST /api/v1/auth/forgot-password returns 200 and success message'
    );

    // Summary
    console.log(`\n========================================`);
    console.log(`Tests Completed: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test run failed with unexpected error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
};

runTests();
