/**
 * Script untuk test endpoint Wablas
 * 
 * Cara menggunakan:
 * 1. Pastikan .env sudah dikonfigurasi dengan benar
 * 2. Install dependencies: npm install axios dotenv
 * 3. Run: npx ts-node test-wablas-endpoint.ts
 * 
 * Atau gunakan curl/Postman dengan format di bawah
 */

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const WABLAS_API_URL = process.env.WABLAS_API_URL || 'https://bdg.wablas.com/api/';
const WABLAS_API_KEY = process.env.WABLAS_API_KEY || 'BWFhlSha';
const TEST_PHONE = '6281319225637'; // Ganti dengan nomor test Anda

async function testWablasEndpoint() {
  console.log('🧪 Testing Wablas Endpoint...\n');
  console.log('Configuration:');
  console.log(`  API URL: ${WABLAS_API_URL}`);
  console.log(`  API Key: ${WABLAS_API_KEY.substring(0, 10)}...`);
  console.log(`  Test Phone: ${TEST_PHONE}\n`);

  const WABLAS_SECRET_KEY = process.env.WABLAS_SECRET_KEY || '';

  // Test 1: Endpoint dengan path /send-message
  const endpoint1 = `${WABLAS_API_URL}/send-message`;
  console.log(`📤 Test 1: ${endpoint1}`);
  
  try {
    const headers: Record<string, string> = {
      Authorization: WABLAS_API_KEY,
      'Content-Type': 'application/json',
    };

    // Tambahkan secret key ke header jika ada
    if (WABLAS_SECRET_KEY) {
      headers['X-Secret-Key'] = WABLAS_SECRET_KEY;
      headers['Secret-Key'] = WABLAS_SECRET_KEY;
    }

    const requestBody: any = {
      phone: TEST_PHONE,
      message: 'Test message dari script verifikasi endpoint',
    };

    // Tambahkan secret key ke body jika diperlukan
    if (WABLAS_SECRET_KEY) {
      requestBody.secret_key = WABLAS_SECRET_KEY;
    }

    const response1 = await axios.post(
      endpoint1,
      requestBody,
      {
        headers,
        timeout: 10000,
      }
    );
    
    console.log('✅ SUCCESS - Endpoint 1 berhasil!');
    console.log('Response:', JSON.stringify(response1.data, null, 2));
    return true;
  } catch (error: any) {
    console.log('❌ FAILED - Endpoint 1 gagal');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 2: Endpoint dengan path /api/v2/send-message (jika base URL tanpa /api/v2)
  if (!WABLAS_API_URL.includes('/api/v2') && !WABLAS_API_URL.endsWith('/api')) {
    const endpoint2 = `${WABLAS_API_URL}/api/v2/send-message`;
    console.log(`\n📤 Test 2: ${endpoint2}`);
    
    try {
      const headers: Record<string, string> = {
        Authorization: WABLAS_API_KEY,
        'Content-Type': 'application/json',
      };

      if (WABLAS_SECRET_KEY) {
        headers['X-Secret-Key'] = WABLAS_SECRET_KEY;
        headers['Secret-Key'] = WABLAS_SECRET_KEY;
      }

      const requestBody: any = {
        phone: TEST_PHONE,
        message: 'Test message dari script verifikasi endpoint',
      };

      if (WABLAS_SECRET_KEY) {
        requestBody.secret_key = WABLAS_SECRET_KEY;
      }

      const response2 = await axios.post(
        endpoint2,
        requestBody,
        {
          headers,
          timeout: 10000,
        }
      );
      
      console.log('✅ SUCCESS - Endpoint 2 berhasil!');
      console.log('Response:', JSON.stringify(response2.data, null, 2));
      console.log('\n💡 Saran: Update WABLAS_API_URL ke:', endpoint2.replace('/send-message', ''));
      return true;
    } catch (error: any) {
      console.log('❌ FAILED - Endpoint 2 gagal');
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  // Test 3: Endpoint dengan path /v2/send-message (alternatif untuk base URL yang sudah ada /api)
  if (WABLAS_API_URL.endsWith('/api')) {
    const endpoint3 = `${WABLAS_API_URL}/v2/send-message`;
    console.log(`\n📤 Test 3: ${endpoint3}`);
    
    try {
      const headers: Record<string, string> = {
        Authorization: WABLAS_API_KEY,
        'Content-Type': 'application/json',
      };

      if (WABLAS_SECRET_KEY) {
        headers['X-Secret-Key'] = WABLAS_SECRET_KEY;
        headers['Secret-Key'] = WABLAS_SECRET_KEY;
      }

      const requestBody: any = {
        phone: TEST_PHONE,
        message: 'Test message dari script verifikasi endpoint',
      };

      if (WABLAS_SECRET_KEY) {
        requestBody.secret_key = WABLAS_SECRET_KEY;
      }

      const response3 = await axios.post(
        endpoint3,
        requestBody,
        {
          headers,
          timeout: 10000,
        }
      );
      
      console.log('✅ SUCCESS - Endpoint 3 berhasil!');
      console.log('Response:', JSON.stringify(response3.data, null, 2));
      console.log('\n💡 Saran: Update WABLAS_API_URL ke:', endpoint3.replace('/send-message', ''));
      return true;
    } catch (error: any) {
      console.log('❌ FAILED - Endpoint 3 gagal');
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  console.log('\n❌ Semua endpoint test gagal!');
  console.log('\n💡 Saran:');
  console.log('1. Cek dokumentasi Wablas untuk endpoint yang benar');
  console.log('2. Hubungi support Wablas untuk konfirmasi endpoint');
  console.log('3. Cek dashboard Wablas untuk informasi API endpoint');
  
  return false;
}

// Run test
testWablasEndpoint()
  .then((success) => {
    if (success) {
      console.log('\n✅ Endpoint Wablas sudah benar!');
      process.exit(0);
    } else {
      console.log('\n❌ Endpoint Wablas perlu diperbaiki!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

