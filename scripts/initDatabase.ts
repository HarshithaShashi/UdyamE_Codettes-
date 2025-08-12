import { sapHanaService } from '../backend/sapHana';

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing SAP HANA Cloud Database...');
    
    // Connect to SAP HANA Cloud
    await sapHanaService.connect();
    console.log('✅ Connected to SAP HANA Cloud');
    
    // Initialize database tables
    await sapHanaService.initializeTables();
    console.log('✅ Database tables initialized successfully');
    
    // Insert sample data (optional)
    await insertSampleData();
    console.log('✅ Sample data inserted successfully');
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await sapHanaService.disconnect();
    console.log('🔌 Disconnected from SAP HANA Cloud');
  }
}

async function insertSampleData() {
  try {
    // Insert sample users
    const sampleUsers = [
      {
        phoneNumber: '+919876543210',
        name: 'Ravi Kumar',
        email: 'ravi@example.com',
        role: 'seller',
        language: 'en',
        location: 'Bangalore'
      },
      {
        phoneNumber: '+919876543211',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        role: 'seller',
        language: 'en',
        location: 'Delhi'
      },
      {
        phoneNumber: '+919876543212',
        name: 'Amit Singh',
        email: 'amit@example.com',
        role: 'buyer',
        language: 'en',
        location: 'Mumbai'
      }
    ];

    for (const userData of sampleUsers) {
      const userId = await sapHanaService.createUser(userData);
      console.log(`Created user: ${userData.name} (${userId})`);
      
      // Create seller profile for sellers
      if (userData.role === 'seller') {
        await sapHanaService.createSeller({
          userId,
          skills: JSON.stringify(['painting', 'carpentry']),
          bio: 'Experienced craftsman with 5+ years of experience',
          verified: true
        });
        console.log(`Created seller profile for: ${userData.name}`);
      }
    }

    // Insert sample jobs
    const sampleJobs = [
      {
        title: 'Living Room Paint Job',
        description: 'Need to paint living room and bedroom walls with quality paint.',
        skill: 'painting',
        budgetMin: 15000,
        budgetMax: 25000,
        timeline: '3 days',
        location: 'Koramangala, Bangalore',
        buyerId: 'sample-buyer-id',
        postedBy: 'Amit Singh'
      },
      {
        title: 'Kitchen Cabinet Installation',
        description: 'Install new kitchen cabinets and countertops.',
        skill: 'carpentry',
        budgetMin: 20000,
        budgetMax: 35000,
        timeline: '1 week',
        location: 'Whitefield, Bangalore',
        buyerId: 'sample-buyer-id',
        postedBy: 'Amit Singh'
      }
    ];

    for (const jobData of sampleJobs) {
      const jobId = await sapHanaService.createJob(jobData);
      console.log(`Created job: ${jobData.title} (${jobId})`);
    }

  } catch (error) {
    console.error('Failed to insert sample data:', error);
    throw error;
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase }; 