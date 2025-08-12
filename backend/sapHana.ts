import hana from '@sap/hana-client';
import { config, validateConfig } from './config';

interface HanaConfig {
  host: string;
  port: number;
  uid: string;
  pwd: string;
  databaseName: string;
  schema: string;
}

class SapHanaService {
  private connection: any = null;
  private config: HanaConfig;

  constructor() {
    // Validate configuration on startup
    validateConfig();
    
    this.config = {
      host: config.sapHana.host,
      port: config.sapHana.port,
      uid: config.sapHana.uid,
      pwd: config.sapHana.pwd,
      databaseName: config.sapHana.databaseName,
      schema: config.sapHana.schema,
    };
  }

async connect(): Promise<void> {
  try {
    // Check if host is configured
    if (!this.config.host || this.config.host === 'localhost') {
      throw new Error('SAP HANA host not configured. Please set SAP_HANA_HOST in your .env file');
    }

    const connParams = {
      serverNode: `${this.config.host}:${this.config.port}`,
      uid: this.config.uid,
      pwd: this.config.pwd,
      encrypt: true,
      sslValidateCertificate: false,
      sslTrustStore: '',
    };

    console.log('🔗 Connecting to SAP HANA Cloud...');
    console.log('📍 Host:', this.config.host);
    console.log('🔢 Port:', this.config.port);
    console.log('👤 User:', this.config.uid);

    this.connection = hana.createConnection();
    await new Promise((resolve, reject) => {
      this.connection.connect(connParams, (err: any) => {
        if (err) {
          console.error('❌ SAP HANA Connection Error:', err);
          reject(err);
        } else {
          console.log('✅ Successfully connected to SAP HANA Cloud');
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('❌ Failed to connect to SAP HANA:', error);
    throw error;
  }
}


  async disconnect(): Promise<void> {
    if (this.connection) {
      await new Promise((resolve) => {
        this.connection.disconnect(() => {
          console.log('🔌 Disconnected from SAP HANA Cloud');
          resolve(true);
        });
      });
    }
  }

  async executeQuery(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.connection) {
      throw new Error('Not connected to SAP HANA');
    }

    return new Promise((resolve, reject) => {
      this.connection.exec(sql, params, (err: any, result: any) => {
        if (err) {
          console.error('❌ Query execution error:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async initializeTables(): Promise<void> {
    const createSchemaSQL = `CREATE SCHEMA "${this.config.schema}"`;
    
    const createTableStatements = [
      // Users table
      `CREATE TABLE "${this.config.schema}"."USERS" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "PHONE_NUMBER" VARCHAR(15) NOT NULL UNIQUE,
        "NAME" VARCHAR(100),
        "EMAIL" VARCHAR(100),
        "ROLE" VARCHAR(10),
        "LANGUAGE" VARCHAR(5) DEFAULT 'en',
        "LOCATION" VARCHAR(100),
        "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Sellers table
      `CREATE TABLE "${this.config.schema}"."SELLERS" (
        "USER_ID" VARCHAR(36) PRIMARY KEY,
        "SKILLS" VARCHAR(1000),
        "RATING" DECIMAL(3,2) DEFAULT 0.0,
        "TOTAL_RATINGS" INTEGER DEFAULT 0,
        "FOLLOWERS" INTEGER DEFAULT 0,
        "BIO" VARCHAR(500),
        "VERIFIED" BOOLEAN DEFAULT FALSE,
        "PORTFOLIO_COUNT" INTEGER DEFAULT 0
      )`,

      // Buyers table
      `CREATE TABLE "${this.config.schema}"."BUYERS" (
        "USER_ID" VARCHAR(36) PRIMARY KEY,
        "INTERESTS" VARCHAR(1000),
        "FOLLOWING" VARCHAR(1000)
      )`,

      // Jobs table
      `CREATE TABLE "${this.config.schema}"."JOBS" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "TITLE" VARCHAR(200) NOT NULL,
        "DESCRIPTION" VARCHAR(2000),
        "SKILL" VARCHAR(50) NOT NULL,
        "BUDGET_MIN" DECIMAL(10,2),
        "BUDGET_MAX" DECIMAL(10,2),
        "TIMELINE" VARCHAR(100),
        "LOCATION" VARCHAR(100),
        "BUYER_ID" VARCHAR(36),
        "POSTED_BY" VARCHAR(100),
        "POSTED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "STATUS" VARCHAR(20) DEFAULT 'open',
        "APPLICANTS" INTEGER DEFAULT 0,
        "ACCEPTED_BY" VARCHAR(36)
      )`,

      // Services table
      `CREATE TABLE "${this.config.schema}"."SERVICES" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "TITLE" VARCHAR(200) NOT NULL,
        "DESCRIPTION" VARCHAR(1000),
        "PRICE" VARCHAR(100),
        "CATEGORY" VARCHAR(50),
        "SELLER_ID" VARCHAR(36),
        "IMAGES" VARCHAR(1000),
        "ACTIVE" BOOLEAN DEFAULT TRUE,
        "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Portfolio table
      `CREATE TABLE "${this.config.schema}"."PORTFOLIO" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "TITLE" VARCHAR(200),
        "DESCRIPTION" VARCHAR(1000),
        "TYPE" VARCHAR(10),
        "URL" VARCHAR(500),
        "CATEGORY" VARCHAR(50),
        "SELLER_ID" VARCHAR(36),
        "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Ratings table
      `CREATE TABLE "${this.config.schema}"."RATINGS" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "SELLER_ID" VARCHAR(36),
        "BUYER_ID" VARCHAR(36),
        "JOB_ID" VARCHAR(36),
        "RATING" INTEGER,
        "REVIEW" VARCHAR(1000),
        "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Follows table
      `CREATE TABLE "${this.config.schema}"."FOLLOWS" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "FOLLOWER_ID" VARCHAR(36),
        "FOLLOWING_ID" VARCHAR(36),
        "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Notifications table
      `CREATE TABLE "${this.config.schema}"."NOTIFICATIONS" (
        "ID" VARCHAR(36) PRIMARY KEY,
        "USER_ID" VARCHAR(36),
        "TITLE" VARCHAR(200),
        "MESSAGE" VARCHAR(1000),
        "TYPE" VARCHAR(50),
        "READ" BOOLEAN DEFAULT FALSE,
        "DATA" VARCHAR(2000),
        "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    try {
      try {
        await this.executeQuery(createSchemaSQL);
        console.log('✅ Schema created successfully');
      } catch (error: any) {
        if (error.message && error.message.includes('already exists')) {
          console.log('ℹ️ Schema already exists, skipping...');
        } else {
          console.log('⚠️ Schema creation error:', error.message);
          // Continue anyway as schema might already exist
        }
      }

      for (const sql of createTableStatements) {
        try {
          await this.executeQuery(sql);
          console.log('✅ Table created successfully');
        } catch (error: any) {
          if (error.message && error.message.includes('already exists')) {
            console.log('ℹ️ Table already exists, skipping...');
          } else {
            console.log('⚠️ Table creation error:', error.message);
            // Continue anyway as table might already exist
          }
        }
      }

      console.log('✅ Database tables initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize tables:', error);
      throw error;
    }
  }

  async createUser(userData: any): Promise<string> {
    const userId = this.generateUUID();
    const sql = `
      INSERT INTO "${this.config.schema}"."USERS" 
      ("ID", "PHONE_NUMBER", "NAME", "EMAIL", "ROLE", "LANGUAGE", "LOCATION")
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await this.executeQuery(sql, [
      userId,
      userData.phoneNumber,
      userData.name,
      userData.email,
      userData.role,
      userData.language || 'en',
      userData.location,
    ]);

    return userId;
  }

  async getUser(userId: string): Promise<any> {
    const sql = `
      SELECT * FROM "${this.config.schema}"."USERS" WHERE "ID" = ?
    `;
    const result = await this.executeQuery(sql, [userId]);
    return result[0];
  }

  async getUserByPhone(phoneNumber: string): Promise<any> {
    const sql = `
      SELECT * FROM "${this.config.schema}"."USERS" WHERE "PHONE_NUMBER" = ?
    `;
    const result = await this.executeQuery(sql, [phoneNumber]);
    return result[0];
  }

  async createJob(jobData: any): Promise<string> {
    const jobId = this.generateUUID();
    const sql = `
      INSERT INTO "${this.config.schema}"."JOBS" 
      ("ID", "TITLE", "DESCRIPTION", "SKILL", "BUDGET_MIN", "BUDGET_MAX", 
       "TIMELINE", "LOCATION", "BUYER_ID", "POSTED_BY")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.executeQuery(sql, [
      jobId,
      jobData.title,
      jobData.description,
      jobData.skill,
      jobData.budgetMin,
      jobData.budgetMax,
      jobData.timeline,
      jobData.location,
      jobData.buyerId,
      jobData.postedBy,
    ]);

    return jobId;
  }

  async getJobs(filters: any = {}): Promise<any[]> {
    let sql = `
      SELECT j.*, u."NAME" as "BUYER_NAME" 
      FROM "${this.config.schema}"."JOBS" j
      LEFT JOIN "${this.config.schema}"."USERS" u ON j."BUYER_ID" = u."ID"
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.skill) {
      sql += ` AND j."SKILL" = ?`;
      params.push(filters.skill);
    }

    if (filters.status) {
      sql += ` AND j."STATUS" = ?`;
      params.push(filters.status);
    }

    if (filters.location) {
      sql += ` AND j."LOCATION" LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    sql += ` ORDER BY j."POSTED_AT" DESC`;

    return await this.executeQuery(sql, params);
  }

  async createSeller(sellerData: any): Promise<void> {
    const sql = `
      INSERT INTO "${this.config.schema}"."SELLERS" 
      ("USER_ID", "SKILLS", "BIO", "VERIFIED")
      VALUES (?, ?, ?, ?)
    `;

    await this.executeQuery(sql, [
      sellerData.userId,
      JSON.stringify(sellerData.skills),
      sellerData.bio,
      sellerData.verified || false,
    ]);
  }

  async getSellers(filters: any = {}): Promise<any[]> {
    let sql = `
      SELECT u.*, s."SKILLS", s."RATING", s."TOTAL_RATINGS", s."FOLLOWERS", s."BIO", s."VERIFIED"
      FROM "${this.config.schema}"."USERS" u
      LEFT JOIN "${this.config.schema}"."SELLERS" s ON u."ID" = s."USER_ID"
      WHERE u."ROLE" = 'seller'
    `;
    const params: any[] = [];

    if (filters.skills) {
      sql += ` AND s."SKILLS" LIKE ?`;
      params.push(`%${filters.skills}%`);
    }

    if (filters.location) {
      sql += ` AND u."LOCATION" LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    sql += ` ORDER BY s."RATING" DESC, s."FOLLOWERS" DESC`;

    return await this.executeQuery(sql, params);
  }

  getSchema(): string {
    return this.config.schema;
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export const sapHanaService = new SapHanaService();