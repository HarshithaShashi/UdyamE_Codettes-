import { localDB } from '@/utils/localDatabase';
import { apiClient } from '@/services/ApiClient';

// Hybrid database service that prioritizes SAP HANA Cloud
export class HybridDatabaseService {
  private static instance: HybridDatabaseService;
  private useCloudDB: boolean = false;

  static getInstance(): HybridDatabaseService {
    if (!HybridDatabaseService.instance) {
      HybridDatabaseService.instance = new HybridDatabaseService();
    }
    return HybridDatabaseService.instance;
  }

  // Initialize and test cloud connection
  async initialize(): Promise<void> {
    try {
      // Try to connect to backend API
      await apiClient.healthCheck();
      this.useCloudDB = true;
      console.log('✅ Connected to backend API - using cloud database');
      
      // Initialize sample data in cloud
      await this.initializeSampleData();
    } catch (error) {
      console.log('⚠️ Backend API not available, using local database');
      this.useCloudDB = false;
      
      // Initialize local database
      await localDB.initializeSampleData();
    }
  }

  // Force initialize local database (for testing)
  async forceInitializeLocal(): Promise<void> {
    this.useCloudDB = false;
    await localDB.initializeSampleData();
    console.log('✅ Local database initialized with sample data');
  }

  // User operations
  async createUser(userData: any): Promise<string> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.createUser(userData);
        return result.data?.id || result.id;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.createUser(userData);
      }
    } else {
      return await localDB.createUser(userData);
    }
  }

  async getUserById(id: string): Promise<any | null> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getUser(id);
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getUserById(id);
      }
    } else {
      return await localDB.getUserById(id);
    }
  }

  async getUserByPhone(phoneNumber: string): Promise<any | null> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getUserByPhone(phoneNumber);
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getUserByPhone(phoneNumber);
      }
    } else {
      return await localDB.getUserByPhone(phoneNumber);
    }
  }

  async getUsers(): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getUsers();
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getUsers();
      }
    } else {
      return await localDB.getUsers();
    }
  }

  // Job operations
  async createJob(jobData: any): Promise<string> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.createJob(jobData);
        return result.data?.id || result.id;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.createJob(jobData);
      }
    } else {
      return await localDB.createJob(jobData);
    }
  }

  async getJobs(): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getJobs();
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getJobs();
      }
    } else {
      return await localDB.getJobs();
    }
  }

  async getJobsByUser(userId: string): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getJobs({ userId });
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getJobsByUser(userId);
      }
    } else {
      return await localDB.getJobsByUser(userId);
    }
  }

  async updateJobStatus(jobId: string, status: string): Promise<void> {
    if (this.useCloudDB) {
      try {
        await apiClient.updateJobStatus(jobId, status);
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        await localDB.updateJobStatus(jobId, status);
      }
    } else {
      await localDB.updateJobStatus(jobId, status);
    }
  }

  // Seller operations
  async createSeller(sellerData: any): Promise<void> {
    if (this.useCloudDB) {
      try {
        await apiClient.createSeller(sellerData);
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        await localDB.createSeller(sellerData);
      }
    } else {
      await localDB.createSeller(sellerData);
    }
  }

  async getSellers(): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getSellers();
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getSellers();
      }
    } else {
      return await localDB.getSellers();
    }
  }

  async getSellerById(id: string): Promise<any | null> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getSeller(id);
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getSellerById(id);
      }
    } else {
      return await localDB.getSellerById(id);
    }
  }

  // Service operations
  async createService(serviceData: any): Promise<string> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.createService(serviceData);
        return result.data?.id || result.id;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.createService(serviceData);
      }
    } else {
      return await localDB.createService(serviceData);
    }
  }

  async getServices(): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getServices();
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getServices();
      }
    } else {
      return await localDB.getServices();
    }
  }

  async getServicesBySeller(sellerId: string): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getServices(sellerId);
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getServicesBySeller(sellerId);
      }
    } else {
      return await localDB.getServicesBySeller(sellerId);
    }
  }

  // Follow operations
  async followSeller(followerId: string, followingId: string): Promise<void> {
    if (this.useCloudDB) {
      try {
        await apiClient.followSeller(followingId, followerId);
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        await localDB.followSeller(followerId, followingId);
      }
    } else {
      await localDB.followSeller(followerId, followingId);
    }
  }

  async unfollowSeller(followerId: string, followingId: string): Promise<void> {
    if (this.useCloudDB) {
      try {
        await apiClient.unfollowSeller(followingId, followerId);
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        await localDB.unfollowSeller(followerId, followingId);
      }
    } else {
      await localDB.unfollowSeller(followerId, followingId);
    }
  }

  async getFollowedSellers(userId: string): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getFollowedSellers(userId);
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getFollowedSellers(userId);
      }
    } else {
      return await localDB.getFollowedSellers(userId);
    }
  }

  // Notification operations
  async createNotification(notificationData: any): Promise<string> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.createNotification(notificationData);
        return result.data?.id || result.id;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.createNotification(notificationData);
      }
    } else {
      return await localDB.createNotification(notificationData);
    }
  }

  async getNotificationsByUser(userId: string): Promise<any[]> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getNotifications(userId);
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await localDB.getNotificationsByUser(userId);
      }
    } else {
      return await localDB.getNotificationsByUser(userId);
    }
  }

  // Utility operations
  async clearAllData(): Promise<void> {
    if (this.useCloudDB) {
      try {
        await apiClient.clearAllData();
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        await localDB.clearAllData();
      }
    } else {
      await localDB.clearAllData();
    }
  }

  // Get all data for debugging
  async getAllData(): Promise<any> {
    if (this.useCloudDB) {
      try {
        const result = await apiClient.getAllData();
        return result.data || result;
      } catch (error) {
        console.error('Cloud DB error, falling back to local:', error);
        return await this.getLocalAllData();
      }
    } else {
      return await this.getLocalAllData();
    }
  }

  // Get all local data
  private async getLocalAllData(): Promise<any> {
    return await localDB.getAllData();
  }

  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    if (this.useCloudDB) {
      try {
        // Add sample users to backend database
        await this.createUser({
          phoneNumber: '919876543210',
          name: 'Test Buyer',
          role: 'buyer',
          language: 'en',
          location: 'Bangalore'
        });

        await this.createUser({
          phoneNumber: '919876543211',
          name: 'Test Seller',
          role: 'seller',
          language: 'en',
          location: 'Mumbai'
        });

        console.log('✅ Sample data initialized in backend API');
      } catch (error) {
        console.error('Error initializing backend data:', error);
        await localDB.initializeSampleData();
      }
    } else {
      await localDB.initializeSampleData();
    }
  }

  // Get database status
  getDatabaseStatus(): string {
    return this.useCloudDB ? 'Backend API' : 'Local Storage';
  }

  // Force reconnect to cloud
  async reconnectToCloud(): Promise<boolean> {
    try {
      await apiClient.healthCheck();
      this.useCloudDB = true;
      console.log('✅ Reconnected to backend API');
      return true;
    } catch (error) {
      console.error('❌ Failed to reconnect to backend API:', error);
      this.useCloudDB = false;
      return false;
    }
  }
}

export const hybridDB = HybridDatabaseService.getInstance(); 