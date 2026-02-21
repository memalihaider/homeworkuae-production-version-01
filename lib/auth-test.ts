// Test file to verify auth credentials
import { validateCredentials, DEMO_CREDENTIALS } from '@/lib/auth';

export async function testCredentials() {
  console.log('=== DEMO CREDENTIALS TEST ===');
  console.log('Available credentials:', Object.keys(DEMO_CREDENTIALS));
  
  const portals = ['admin', 'employee'] as const;
  
  for (const portal of portals) {
    const creds = DEMO_CREDENTIALS[portal];
    console.log(`\n${portal}:`);
    console.log(`  Email: ${creds.email}`);
    console.log(`  Password: ${creds.password}`);
    
    try {
      const result = await validateCredentials(portal, creds.email, creds.password);
      console.log(`  Result: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      if (!result.success) {
        console.log(`  Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`  Error: ${error}`);
    }
  }
}

// Run test if in browser
if (typeof window !== 'undefined') {
  (window as any).testCredentials = testCredentials;
}
