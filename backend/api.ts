import { sapHanaService } from './sapHana';

interface User {
  id?: string;
  name: string;
  phoneNumber: string;
  email?: string;
  location?: string;
  role?: string;
  language?: string;
}

interface Job {
  title: string;
  category: string;
  salary: number;
  location: string;
  userId: string;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export class UdyamiApi {
  private isConnected = false;

  private async ensureConnection(): Promise<void> {
    try {
      if (!this.isConnected) {
        await sapHanaService.connect();
        await sapHanaService.initializeTables();
        this.isConnected = true;
        console.log('SAP HANA connected.');
      }
    } catch (error) {
      console.warn('Failed to connect to SAP HANA:', error);
      // Don't throw error, just log it
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await sapHanaService.disconnect();
        this.isConnected = false;
      }
    } catch (error) {
      console.warn('Failed to disconnect from SAP HANA:', error);
    }
  }

  // ----------------------- USERS -----------------------
  async createUser(userData: User): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const userId = await sapHanaService.createUser(userData);
      return { data: { id: userId, ...userData }, status: 'success' };
    } catch (error) {
      console.warn('Create user error:', error);
      return { data: null, status: 'error', message: 'Failed to create user' };
    }
  }

  async getUser(userId: string): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const user = await sapHanaService.getUser(userId);
      return { data: user, status: 'success' };
    } catch (error) {
      console.warn('Get user error:', error);
      return { data: null, status: 'error', message: 'Failed to get user' };
    }
  }

  async getUserByPhone(phoneNumber: string): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const user = await sapHanaService.getUserByPhone(phoneNumber);
      return { data: user, status: 'success' };
    } catch (error) {
      console.warn('Get user by phone error:', error);
      return { data: null, status: 'error', message: 'Failed to get user by phone' };
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        UPDATE "UDYAMI_SCHEMA"."USERS"
        SET "NAME" = ?, "EMAIL" = ?, "LOCATION" = ?, "UPDATED_AT" = CURRENT_TIMESTAMP
        WHERE "ID" = ?
      `;
      await sapHanaService.executeQuery(sql, [
        userData.name,
        userData.email,
        userData.location,
        userId
      ]);
      return { data: { id: userId, ...userData }, status: 'success' };
    } catch (error) {
      console.warn('Update user error:', error);
      return { data: null, status: 'error', message: 'Failed to update user' };
    }
  }

  // ----------------------- JOBS -----------------------
  async createJob(jobData: Job): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const jobId = await sapHanaService.createJob(jobData);
      return { data: { id: jobId, ...jobData }, status: 'success' };
    } catch (error) {
      console.warn('Create job error:', error);
      return { data: null, status: 'error', message: 'Failed to create job' };
    }
  }

  async getJobs(filters?: any): Promise<ApiResponse<any[]>> {
    try {
      await this.ensureConnection();
      const jobs = await sapHanaService.getJobs(filters);
      return { data: jobs, status: 'success' };
    } catch (error) {
      console.warn('Get jobs error:', error);
      return { data: [], status: 'error', message: 'Failed to get jobs' };
    }
  }

  async updateJobStatus(jobId: string, status: string): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        UPDATE "UDYAMI_SCHEMA"."JOBS"
        SET "STATUS" = ?, "UPDATED_AT" = CURRENT_TIMESTAMP
        WHERE "ID" = ?
      `;
      await sapHanaService.executeQuery(sql, [status, jobId]);
      return { data: { id: jobId, status }, status: 'success' };
    } catch (error) {
      console.warn('Update job status error:', error);
      return { data: null, status: 'error', message: 'Failed to update job status' };
    }
  }

  // ----------------------- SERVICES -----------------------
  async getServices(sellerId?: string): Promise<ApiResponse<any[]>> {
    try {
      await this.ensureConnection();
      const sql = sellerId 
        ? `SELECT * FROM "UDYAMI_SCHEMA"."SERVICES" WHERE "SELLER_ID" = ?`
        : `SELECT * FROM "UDYAMI_SCHEMA"."SERVICES"`;
      const params = sellerId ? [sellerId] : [];
      const services = await sapHanaService.executeQuery(sql, params);
      return { data: services, status: 'success' };
    } catch (error) {
      console.warn('Get services error:', error);
      return { data: [], status: 'error', message: 'Failed to get services' };
    }
  }

  async createService(serviceData: any): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        INSERT INTO "UDYAMI_SCHEMA"."SERVICES"
        ("TITLE", "DESCRIPTION", "PRICE", "CATEGORY", "SELLER_ID", "IMAGES", "ACTIVE")
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await sapHanaService.executeQuery(sql, [
        serviceData.title,
        serviceData.description,
        serviceData.price,
        serviceData.category,
        serviceData.sellerId,
        serviceData.images,
        serviceData.active || 1
      ]);
      return { data: serviceData, status: 'success' };
    } catch (error) {
      console.warn('Create service error:', error);
      return { data: null, status: 'error', message: 'Failed to create service' };
    }
  }

  // ----------------------- SELLERS -----------------------
  async getSellers(filters?: any): Promise<ApiResponse<any[]>> {
    try {
      await this.ensureConnection();
      const sellers = await sapHanaService.getSellers(filters);
      return { data: sellers, status: 'success' };
    } catch (error) {
      console.warn('Get sellers error:', error);
      return { data: [], status: 'error', message: 'Failed to get sellers' };
    }
  }

  async createSeller(sellerData: any): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      await sapHanaService.createSeller(sellerData);
      return { data: sellerData, status: 'success' };
    } catch (error) {
      console.warn('Create seller error:', error);
      return { data: null, status: 'error', message: 'Failed to create seller' };
    }
  }

  // ----------------------- FOLLOWS -----------------------
  async followSeller(sellerId: string, followerId: string): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        INSERT INTO "UDYAMI_SCHEMA"."FOLLOWS" ("FOLLOWER_ID", "FOLLOWING_ID")
        VALUES (?, ?)
      `;
      await sapHanaService.executeQuery(sql, [followerId, sellerId]);
      return { data: { sellerId, followerId }, status: 'success' };
    } catch (error) {
      console.warn('Follow seller error:', error);
      return { data: null, status: 'error', message: 'Failed to follow seller' };
    }
  }

  async unfollowSeller(sellerId: string, followerId: string): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        DELETE FROM "UDYAMI_SCHEMA"."FOLLOWS"
        WHERE "FOLLOWER_ID" = ? AND "FOLLOWING_ID" = ?
      `;
      await sapHanaService.executeQuery(sql, [followerId, sellerId]);
      return { data: { sellerId, followerId }, status: 'success' };
    } catch (error) {
      console.warn('Unfollow seller error:', error);
      return { data: null, status: 'error', message: 'Failed to unfollow seller' };
    }
  }

  // ----------------------- RATINGS -----------------------
  async rateSeller(sellerId: string, buyerId: string, jobId: string, rating: number, review?: string): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        INSERT INTO "UDYAMI_SCHEMA"."RATINGS"
        ("SELLER_ID", "BUYER_ID", "JOB_ID", "RATING", "REVIEW")
        VALUES (?, ?, ?, ?, ?)
      `;
      await sapHanaService.executeQuery(sql, [sellerId, buyerId, jobId, rating, review || '']);
      return { data: { sellerId, buyerId, jobId, rating, review }, status: 'success' };
    } catch (error) {
      console.warn('Rate seller error:', error);
      return { data: null, status: 'error', message: 'Failed to rate seller' };
    }
  }

  // ----------------------- NOTIFICATIONS -----------------------
  async createNotification(notificationData: any): Promise<ApiResponse<any>> {
    try {
      await this.ensureConnection();
      const sql = `
        INSERT INTO "UDYAMI_SCHEMA"."NOTIFICATIONS"
        ("USER_ID", "TITLE", "MESSAGE", "TYPE", "READ", "DATA")
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await sapHanaService.executeQuery(sql, [
        notificationData.userId,
        notificationData.title,
        notificationData.message,
        notificationData.type,
        notificationData.read || 0,
        notificationData.data || '{}'
      ]);
      return { data: notificationData, status: 'success' };
    } catch (error) {
      console.warn('Create notification error:', error);
      return { data: null, status: 'error', message: 'Failed to create notification' };
    }
  }

  async getNotifications(userId: string): Promise<ApiResponse<any[]>> {
    try {
      await this.ensureConnection();
      const sql = `
        SELECT * FROM "UDYAMI_SCHEMA"."NOTIFICATIONS"
        WHERE "USER_ID" = ?
        ORDER BY "CREATED_AT" DESC
      `;
      const notifications = await sapHanaService.executeQuery(sql, [userId]);
      return { data: notifications, status: 'success' };
    } catch (error) {
      console.warn('Get notifications error:', error);
      return { data: [], status: 'error', message: 'Failed to get notifications' };
    }
  }
}


