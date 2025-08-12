const hana = require('@sap/hana-client');
require('dotenv').config();

const connParams = {
  serverNode: `${process.env.SAP_HANA_HOST}:${process.env.SAP_HANA_PORT}`,
  uid: process.env.SAP_HANA_USERNAME,
  pwd: process.env.SAP_HANA_PASSWORD
};

const connection = hana.createConnection();

// Promisify exec
function execAsync(sql) {
  return new Promise((resolve, reject) => {
    connection.exec(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function seedData() {
  try {
    connection.connect(connParams);
    console.log('✅ Connected to SAP HANA successfully.');

    // USERS - Only add Ravi Kumar and Priya
    const users = [
      [113, '9876543223', 'ravi.kumar@example.com', 'seller', 'en', 'Jaipur'],
      [114, '9876543224', 'priya.sharma@example.com', 'buyer', 'en', 'Mumbai']
    ];

    for (const user of users) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."USERS"
          ("ID", "PHONE_NUMBER", "EMAIL", "ROLE", "LANGUAGE", "LOCATION", "CREATED_AT", "UPDATED_AT")
          VALUES
          (${user[0]}, '${user[1]}', '${user[2]}', '${user[3]}', '${user[4]}', '${user[5]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        console.log(`✅ User ${user[2]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ User ${user[2]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting user ${user[2]}:`, error.message);
        }
      }
    }

    // SELLERS - Only add Ravi Kumar
    const sellers = [
      [113, 'Weaving,Tailoring', 4.4, 45, 15, 'Expert in traditional weaving and modern tailoring', true, 6]
    ];

    for (const seller of sellers) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."SELLERS"
          ("USER_ID", "SKILLS", "RATING", "TOTAL_RATINGS", "FOLLOWERS", "BIO", "VERIFIED", "PORTFOLIO_COUNT")
          VALUES
          (${seller[0]}, '${seller[1]}', ${seller[2]}, ${seller[3]}, ${seller[4]}, '${seller[5]}', ${seller[6]}, ${seller[7]})
        `);
        console.log(`✅ Seller ${seller[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Seller ${seller[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting seller ${seller[0]}:`, error.message);
        }
      }
    }

    // BUYERS - Only add Priya
    const buyers = [
      [114, 'Weaving,Tailoring', 2]
    ];

    for (const buyer of buyers) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."BUYERS"
          ("USER_ID", "INTERESTS", "FOLLOWING")
          VALUES
          (${buyer[0]}, '${buyer[1]}', ${buyer[2]})
        `);
        console.log(`✅ Buyer ${buyer[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Buyer ${buyer[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting buyer ${buyer[0]}:`, error.message);
        }
      }
    }

    // PORTFOLIO - Add portfolio items for Ravi Kumar
    const portfolioItems = [
      [512, 'Traditional Saree Weaving', 'Handwoven silk saree with intricate patterns', 'image', 'http://example.com/saree.jpg', 'Weaving', 113],
      [513, 'Custom Suit Tailoring', 'Bespoke mens suit with perfect fit', 'image', 'http://example.com/suit.jpg', 'Tailoring', 113],
      [514, 'Kurta Design', 'Traditional kurta with modern styling', 'image', 'http://example.com/kurta.jpg', 'Tailoring', 113],
      [515, 'Carpet Weaving', 'Hand-knotted wool carpet', 'image', 'http://example.com/carpet.jpg', 'Weaving', 113]
    ];

    for (const item of portfolioItems) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."PORTFOLIO"
          ("ID", "TITLE", "DESCRIPTION", "TYPE", "URL", "CATEGORY", "SELLER_ID")
          VALUES
          (${item[0]}, '${item[1]}', '${item[2]}', '${item[3]}', '${item[4]}', '${item[5]}', ${item[6]})
        `);
        console.log(`✅ Portfolio item ${item[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Portfolio item ${item[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting portfolio item ${item[0]}:`, error.message);
        }
      }
    }

    // JOBS - Add jobs related to weaving and tailoring
    const jobs = [
      [412, 'Design Wedding Saree', 'Custom wedding saree with embroidery', 'Weaving', 5000, 15000, '7 days', 'Jaipur', 114, 'open', 1, null],
      [413, 'Tailor Business Suit', 'Bespoke business suit for interview', 'Tailoring', 3000, 8000, '5 days', 'Mumbai', 114, 'open', 1, null],
      [414, 'Weave Traditional Carpet', 'Hand-knotted wool carpet', 'Weaving', 8000, 20000, '10 days', 'Jaipur', 114, 'open', 1, null]
    ];

    for (const job of jobs) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."JOBS"
          ("ID", "TITLE", "DESCRIPTION", "SKILL", "BUDGET_MIN", "BUDGET_MAX", "TIMELINE", "LOCATION", "BUYER_ID", "STATUS", "APPLICANTS", "ACCEPTED_BY")
          VALUES
          (${job[0]}, '${job[1]}', '${job[2]}', '${job[3]}', ${job[4]}, ${job[5]}, '${job[6]}', '${job[7]}', ${job[8]}, '${job[9]}', ${job[10]}, ${job[11]})
        `);
        console.log(`✅ Job ${job[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Job ${job[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting job ${job[0]}:`, error.message);
        }
      }
    }
    
    // SERVICES - Add weaving and tailoring services for Ravi Kumar
    const services = [
      [716, 'Custom Saree Weaving', 'Handwoven silk saree with traditional patterns', 8000, 'Weaving', 113, 'http://example.com/saree-service.jpg', true],
      [717, 'Bespoke Suit Tailoring', 'Custom-fitted business suit', 5000, 'Tailoring', 113, 'http://example.com/suit-service.jpg', true],
      [718, 'Traditional Kurta', 'Handcrafted kurta with embroidery', 3000, 'Tailoring', 113, 'http://example.com/kurta-service.jpg', true],
      [719, 'Carpet Weaving', 'Hand-knotted wool carpet design', 12000, 'Weaving', 113, 'http://example.com/carpet-service.jpg', true]
    ];

    for (const service of services) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."SERVICES"
          ("ID", "TITLE", "DESCRIPTION", "PRICE", "CATEGORY", "SELLER_ID", "IMAGES", "ACTIVE")
          VALUES
          (${service[0]}, '${service[1]}', '${service[2]}', ${service[3]}, '${service[4]}', ${service[5]}, '${service[6]}', ${service[7]})
        `);
        console.log(`✅ Service ${service[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Service ${service[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting service ${service[0]}:`, error.message);
        }
      }
    }
  
    // FOLLOWS - Add follows between Ravi Kumar and Priya
    const follows = [
      [817, 114, 113], // Priya follows Ravi Kumar
      [818, 113, 114]  // Ravi Kumar follows Priya
    ];

    for (const follow of follows) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."FOLLOWS"
          ("ID", "FOLLOWER_ID", "FOLLOWING_ID")
          VALUES
          (${follow[0]}, ${follow[1]}, ${follow[2]})
        `);
        console.log(`✅ Follow ${follow[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Follow ${follow[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting follow ${follow[0]}:`, error.message);
        }
      }
    }

    // RATINGS - Add rating for Ravi Kumar
    const ratings = [
      [312, 113, 114, 412, 5, 'Excellent weaving work!']
    ];

    for (const rating of ratings) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."RATINGS"
          ("ID", "SELLER_ID", "BUYER_ID", "JOB_ID", "RATING", "REVIEW")
          VALUES
          (${rating[0]}, ${rating[1]}, ${rating[2]}, ${rating[3]}, ${rating[4]}, '${rating[5]}')
        `);
        console.log(`✅ Rating ${rating[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Rating ${rating[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting rating ${rating[0]}:`, error.message);
        }
      }
    }

    // NOTIFICATIONS - Add notifications for new users
    const notifications = [
      [612, 113, 'Welcome Ravi!', 'Welcome to Udyami platform', 'info', false, '{}'],
      [613, 114, 'Welcome Priya!', 'Welcome to Udyami platform', 'info', false, '{}']
    ];

    for (const notification of notifications) {
      try {
        await execAsync(`
          INSERT INTO "${process.env.SAP_HANA_SCHEMA}"."NOTIFICATIONS"
          ("ID", "USER_ID", "TITLE", "MESSAGE", "TYPE", "READ", "DATA")
          VALUES
          (${notification[0]}, ${notification[1]}, '${notification[2]}', '${notification[3]}', '${notification[4]}', ${notification[5]}, '${notification[6]}')
        `);
        console.log(`✅ Notification ${notification[0]} inserted successfully`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Notification ${notification[0]} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting notification ${notification[0]}:`, error.message);
        }
      }
    }

    console.log('✅ Ravi Kumar and Priya data inserted successfully!');
    console.log('📊 Summary:');
    console.log('   - Added Ravi Kumar (Seller) with weaving and tailoring skills');
    console.log('   - Added Priya (Buyer) with weaving and tailoring interests');
    console.log('   - Added portfolio items for Ravi Kumar');
    console.log('   - Added weaving and tailoring jobs and services');
    console.log('   - Added proper error handling to prevent API errors');
  } catch (err) {
    console.error('❌ Error inserting data:', err);
  } finally {
    connection.disconnect();
  }
}

seedData();
