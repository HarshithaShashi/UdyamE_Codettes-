import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // SAP HANA Cloud Configuration
  sapHana: {
    host: process.env.SAP_HANA_HOST || '7c54bd3a-e727-4e9a-8ac1-fdc9b6fccd3b.hana.trial-us10.hanacloud.ondemand.com',
    port: parseInt(process.env.SAP_HANA_PORT || '443'),
    uid: process.env.SAP_HANA_USERNAME || 'DBADMIN', // Changed from SAP_HANA_UID
    pwd: process.env.SAP_HANA_PASSWORD || 'Codettes_udymai123!', // Changed from SAP_HANA_PWD
    databaseName: process.env.SAP_HANA_DATABASE || '', // Changed from SAP_HANA_DB
    schema: process.env.SAP_HANA_SCHEMA || 'UDYAMI_SCHEMA',
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  
  // Frontend API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
  }
};

// Validate required environment variables
export function validateConfig() {
  const required = ['SAP_HANA_HOST', 'SAP_HANA_USERNAME', 'SAP_HANA_PASSWORD']; // Updated variable names
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
    console.warn('📝 Please create a .env file with the following variables:');
    missing.forEach(key => {
      console.warn(`   ${key}=your-value`);
    });
  }
} 