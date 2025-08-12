import { localDB } from '@/utils/localDatabase';

// Database service that uses local storage for development
export class DatabaseService {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Initialize the database with sample data
  async initialize(): Promise<void> {
    await localDB.initializeSampleData();
  }

  // User operations
  async createUser(userData: any): Promise<string> {
    return await localDB.createUser(userData);
  }

  async getUserById(id: string): Promise<any | null> {
    return await localDB.getUserById(id);
  }

  async getUserByPhone(phoneNumber: string): Promise<any | null> {
    return await localDB.getUserByPhone(phoneNumber);
  }

  async getUsers(): Promise<any[]> {
    return await localDB.getUsers();
  }

  // Job operations
  async createJob(jobData: any): Promise<string> {
    return await localDB.createJob(jobData);
  }

  async getJobs(): Promise<any[]> {
    return await localDB.getJobs();
  }

  async getJobsByUser(userId: string): Promise<any[]> {
    return await localDB.getJobsByUser(userId);
  }

  async updateJobStatus(jobId: string, status: string): Promise<void> {
    await localDB.updateJobStatus(jobId, status);
  }

  // Seller operations
  async createSeller(sellerData: any): Promise<void> {
    await localDB.createSeller(sellerData);
  }

  async getSellers(): Promise<any[]> {
    return await localDB.getSellers();
  }

  async getSellerById(id: string): Promise<any | null> {
    return await localDB.getSellerById(id);
  }

  // Service operations
  async createService(serviceData: any): Promise<string> {
    return await localDB.createService(serviceData);
  }

  async getServices(): Promise<any[]> {
    return await localDB.getServices();
  }

  async getServicesBySeller(sellerId: string): Promise<any[]> {
    return await localDB.getServicesBySeller(sellerId);
  }

  // Follow operations
  async followSeller(followerId: string, followingId: string): Promise<void> {
    await localDB.followSeller(followerId, followingId);
  }

  async unfollowSeller(followerId: string, followingId: string): Promise<void> {
    await localDB.unfollowSeller(followerId, followingId);
  }

  async getFollowedSellers(userId: string): Promise<any[]> {
    return await localDB.getFollowedSellers(userId);
  }

  // Notification operations
  async createNotification(notificationData: any): Promise<string> {
    return await localDB.createNotification(notificationData);
  }

  async getNotificationsByUser(userId: string): Promise<any[]> {
    return await localDB.getNotificationsByUser(userId);
  }

  // Utility operations
  async clearAllData(): Promise<void> {
    await localDB.clearAllData();
  }

  // Get all data for debugging
  async getAllData(): Promise<any> {
    const users = await localDB.getUsers();
    const jobs = await localDB.getJobs();
    const sellers = await localDB.getSellers();
    const services = await localDB.getServices();
    const follows = await localDB.getFollows();
    const notifications = await localDB.getNotifications();

    return {
      users,
      jobs,
      sellers,
      services,
      follows,
      notifications,
    };
  }
}

export const dbService = DatabaseService.getInstance(); 