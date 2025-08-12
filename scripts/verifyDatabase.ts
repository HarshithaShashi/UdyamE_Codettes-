import { sapHanaService } from '../backend/sapHana';

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying SAP HANA Cloud Database...');
    
    // Connect to SAP HANA Cloud
    await sapHanaService.connect();
    console.log('✅ Connected to SAP HANA Cloud');
    
    // Check if schema exists
    const schemaResult = await sapHanaService.executeQuery(`
      SELECT SCHEMA_NAME 
      FROM SCHEMAS 
      WHERE SCHEMA_NAME = 'UDYAMI_SCHEMA'
    `);
    
    if (schemaResult.length === 0) {
      console.log('❌ UDYAMI_SCHEMA does not exist');
      return;
    }
    
    console.log('✅ UDYAMI_SCHEMA exists');
    
    // Check if tables exist
    const tables = [
      'USERS',
      'SELLERS', 
      'BUYERS',
      'JOBS',
      'SERVICES',
      'PORTFOLIO',
      'RATINGS',
      'FOLLOWS',
      'NOTIFICATIONS'
    ];
    
    for (const table of tables) {
      try {
        const result = await sapHanaService.executeQuery(`
          SELECT COUNT(*) as count 
          FROM "UDYAMI_SCHEMA"."${table}"
        `);
        console.log(`✅ Table ${table} exists with ${result[0].count} records`);
      } catch (error) {
        console.log(`❌ Table ${table} does not exist or is not accessible`);
      }
    }
    
    // Test inserting a sample user
    console.log('\n🧪 Testing user creation...');
    const testUser = {
      name: 'Test User',
      phoneNumber: '+919876543210',
      role: 'buyer',
      language: 'en',
      location: 'Bangalore'
    };
    
    try {
      const userId = await sapHanaService.createUser(testUser);
      console.log(`✅ Test user created with ID: ${userId}`);
      
      // Clean up test user
      await sapHanaService.executeQuery(`
        DELETE FROM "UDYAMI_SCHEMA"."USERS" 
        WHERE "ID" = ?
      `, [userId]);
      console.log('✅ Test user cleaned up');
      
    } catch (error) {
      console.error('❌ Failed to create test user:', (error as Error).message);
    }
    
    console.log('\n🎉 Database verification completed!');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  } finally {
    await sapHanaService.disconnect();
    console.log('🔌 Disconnected from SAP HANA Cloud');
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyDatabase();
}

export { verifyDatabase }; 