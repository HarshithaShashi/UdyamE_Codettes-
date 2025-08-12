import { sapHanaService } from '../backend/sapHana';

async function testConnection() {
  try {
    console.log('🔄 Testing SAP HANA Cloud Connection...');
    
    // Connect to SAP HANA Cloud
    await sapHanaService.connect();
    console.log('✅ Successfully connected to SAP HANA Cloud');
    
    // Test a simple query
    const result = await sapHanaService.executeQuery('SELECT CURRENT_TIMESTAMP as "current_time" FROM DUMMY');
    console.log('✅ Query executed successfully');
    console.log('📅 Current timestamp:', result[0]?.current_time);
    
    // Test schema access
    const schemaResult = await sapHanaService.executeQuery(`
      SELECT SCHEMA_NAME 
      FROM SCHEMAS 
      WHERE SCHEMA_NAME = '${sapHanaService.getSchema()}'
    `);
    
    if (schemaResult.length > 0) {
      console.log('✅ Schema access verified');
    } else {
      console.log('⚠️  Schema not found, will be created during initialization');
    }
    
    console.log('🎉 Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your SAP HANA Cloud credentials in config/database.ts');
    console.log('2. Verify your host URL is correct');
    console.log('3. Ensure your IP is whitelisted in SAP HANA Cloud');
    console.log('4. Check if your database instance is running');
    process.exit(1);
  } finally {
    // Disconnect from database
    await sapHanaService.disconnect();
    console.log('🔌 Disconnected from SAP HANA Cloud');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testConnection();
}

export { testConnection }; 