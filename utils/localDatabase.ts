import AsyncStorage from '@react-native-async-storage/async-storage';

// Local database simulation for development
export class LocalDatabase {
  private static instance: LocalDatabase;
  private storage: typeof AsyncStorage;

  constructor() {
    this.storage = AsyncStorage;
  }

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  // Users
  async createUser(userData: any): Promise<string> {
    const users = await this.getUsers();
    const newUser = {
      id: this.generateUUID(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    await this.storage.setItem('users', JSON.stringify(users));
    console.log('✅ User created:', newUser.id);
    return newUser.id;
  }

  async getUsers(): Promise<any[]> {
    try {
      const users = await this.storage.getItem('users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getUserById(id: string): Promise<any | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async getUserByPhone(phoneNumber: string): Promise<any | null> {
    const users = await this.getUsers();
    return users.find(user => user.phoneNumber === phoneNumber) || null;
  }

  // Jobs
  async createJob(jobData: any): Promise<string> {
    const jobs = await this.getJobs();
    const newJob = {
      id: this.generateUUID(),
      ...jobData,
      status: 'open',
      applicants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    await this.storage.setItem('jobs', JSON.stringify(jobs));
    console.log('✅ Job created:', newJob.id);
    return newJob.id;
  }

  async getJobs(): Promise<any[]> {
    try {
      const jobs = await this.storage.getItem('jobs');
      return jobs ? JSON.parse(jobs) : [];
    } catch (error) {
      console.error('Error getting jobs:', error);
      return [];
    }
  }

  async getJobsByUser(userId: string): Promise<any[]> {
    const jobs = await this.getJobs();
    return jobs.filter(job => job.buyerId === userId);
  }

  async updateJobStatus(jobId: string, status: string): Promise<void> {
    const jobs = await this.getJobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = status;
      jobs[jobIndex].updatedAt = new Date().toISOString();
      await this.storage.setItem('jobs', JSON.stringify(jobs));
      console.log('✅ Job status updated:', jobId, status);
    }
  }

  // Sellers
  async createSeller(sellerData: any): Promise<void> {
    const sellers = await this.getSellers();
    const newSeller = {
      id: this.generateUUID(),
      ...sellerData,
      rating: 0,
      totalRatings: 0,
      followers: 0,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sellers.push(newSeller);
    await this.storage.setItem('sellers', JSON.stringify(sellers));
    console.log('✅ Seller created:', newSeller.id);
  }

  async getSellers(): Promise<any[]> {
    try {
      const sellers = await this.storage.getItem('sellers');
      return sellers ? JSON.parse(sellers) : [];
    } catch (error) {
      console.error('Error getting sellers:', error);
      return [];
    }
  }

  async getSellerById(id: string): Promise<any | null> {
    const sellers = await this.getSellers();
    return sellers.find(seller => seller.id === id) || null;
  }

  // Services
  async createService(serviceData: any): Promise<string> {
    const services = await this.getServices();
    const newService = {
      id: this.generateUUID(),
      ...serviceData,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    services.push(newService);
    await this.storage.setItem('services', JSON.stringify(services));
    console.log('✅ Service created:', newService.id);
    return newService.id;
  }

  async getServices(): Promise<any[]> {
    try {
      const services = await this.storage.getItem('services');
      return services ? JSON.parse(services) : [];
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }

  async getServicesBySeller(sellerId: string): Promise<any[]> {
    const services = await this.getServices();
    return services.filter(service => service.sellerId === sellerId);
  }

  // Follows
  async followSeller(followerId: string, followingId: string): Promise<void> {
    const follows = await this.getFollows();
    const existingFollow = follows.find(f => f.followerId === followerId && f.followingId === followingId);
    
    if (!existingFollow) {
      follows.push({
        id: this.generateUUID(),
        followerId,
        followingId,
        createdAt: new Date().toISOString(),
      });
      await this.storage.setItem('follows', JSON.stringify(follows));
      console.log('✅ Follow created:', followerId, '->', followingId);
    }
  }

  async unfollowSeller(followerId: string, followingId: string): Promise<void> {
    const follows = await this.getFollows();
    const filteredFollows = follows.filter(f => !(f.followerId === followerId && f.followingId === followingId));
    await this.storage.setItem('follows', JSON.stringify(filteredFollows));
    console.log('✅ Follow removed:', followerId, '->', followingId);
  }

  async getFollows(): Promise<any[]> {
    try {
      const follows = await this.storage.getItem('follows');
      return follows ? JSON.parse(follows) : [];
    } catch (error) {
      console.error('Error getting follows:', error);
      return [];
    }
  }

  async getFollowedSellers(userId: string): Promise<any[]> {
    const follows = await this.getFollows();
    const followedIds = follows.filter(f => f.followerId === userId).map(f => f.followingId);
    const sellers = await this.getSellers();
    return sellers.filter(seller => followedIds.includes(seller.id));
  }

  // Notifications
  async createNotification(notificationData: any): Promise<string> {
    const notifications = await this.getNotifications();
    const newNotification = {
      id: this.generateUUID(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(newNotification);
    await this.storage.setItem('notifications', JSON.stringify(notifications));
    console.log('✅ Notification created:', newNotification.id);
    return newNotification.id;
  }

  async getNotifications(): Promise<any[]> {
    try {
      const notifications = await this.storage.getItem('notifications');
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async getNotificationsByUser(userId: string): Promise<any[]> {
    const notifications = await this.getNotifications();
    return notifications.filter(notification => notification.userId === userId);
  }

  // Utility methods
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    await this.storage.multiRemove([
      'users',
      'jobs',
      'sellers',
      'services',
      'follows',
      'notifications'
    ]);
    console.log('🗑️ All data cleared');
  }

  // Get all data (for debugging)
  async getAllData(): Promise<any> {
    try {
      const users = await this.getUsers();
      const jobs = await this.getJobs();
      const sellers = await this.getSellers();
      const services = await this.getServices();
      const follows = await this.getFollows();
      const notifications = await this.getNotifications();
      
      return {
        users,
        jobs,
        sellers,
        services,
        follows,
        notifications
      };
    } catch (error) {
      console.error('Error getting all data:', error);
      return {
        users: [],
        jobs: [],
        sellers: [],
        services: [],
        follows: [],
        notifications: []
      };
    }
  }

  // Initialize with sample data
  async initializeSampleData(): Promise<void> {
    const users = await this.getUsers();
    if (users.length === 0) {
      console.log('📝 Initializing sample data...');
      
      // Add sample users
      const buyerId = await this.createUser({
        phoneNumber: '919876543210',
        name: 'Amit Sharma',
        role: 'buyer',
        language: 'en',
        location: 'Bangalore'
      });

      const sellerId = await this.createUser({
        phoneNumber: '919876543211',
        name: 'Ravi Kumar',
        role: 'seller',
        language: 'en',
        location: 'Mumbai'
      });

      // Add sample sellers
      await this.createSeller({
        userId: sellerId,
        name: 'Ravi Kumar',
        skills: ['painting', 'wall_design'],
        rating: 4.8,
        location: 'Bangalore',
        followers: 156,
        bio: 'Professional painter with 5 years of experience',
        verified: true
      });

      // Add sample jobs
      await this.createJob({
        title: 'Living Room Paint Job',
        description: 'Need to paint living room and bedroom walls with quality paint. Includes wall preparation and primer.',
        skill: 'painting',
        budgetMin: 15000,
        budgetMax: 20000,
        timeline: '3 days',
        location: 'Koramangala, Bangalore',
        buyerId: buyerId,
        postedBy: 'Amit Sharma'
      });

      await this.createJob({
        title: 'Kitchen Plumbing Repair',
        description: 'Fix leaking pipes and install new faucet in kitchen. Emergency repair needed.',
        skill: 'plumbing',
        budgetMin: 8000,
        budgetMax: 12000,
        timeline: '1 day',
        location: 'Whitefield, Bangalore',
        buyerId: buyerId,
        postedBy: 'Amit Sharma'
      });

      await this.createJob({
        title: 'Custom Wooden Furniture',
        description: 'Design and build custom dining table and chairs for 6 people.',
        skill: 'carpentry',
        budgetMin: 35000,
        budgetMax: 45000,
        timeline: '2 weeks',
        location: 'Indiranagar, Bangalore',
        buyerId: buyerId,
        postedBy: 'Amit Sharma'
      });

      // Add sample services
      await this.createService({
        title: 'Interior Wall Painting',
        description: 'Professional interior painting with premium quality paints and finish.',
        price: 'Starting ₹50/sq ft',
        category: 'Painting',
        sellerId: sellerId
      });

      await this.createService({
        title: 'Custom Wall Designs',
        description: 'Creative wall designs including texture painting and artistic patterns.',
        price: 'Starting ₹200/sq ft',
        category: 'Painting',
        sellerId: sellerId
      });

      await this.createService({
        title: 'Color Consultation',
        description: 'Professional color consultation for your home interior design.',
        price: '₹2,000 per consultation',
        category: 'Design',
        sellerId: sellerId
      });

      // Add more sellers
      const seller2Id = await this.createUser({
        phoneNumber: '919876543212',
        name: 'Priya Sharma',
        role: 'seller',
        language: 'en',
        location: 'Delhi'
      });

      await this.createSeller({
        userId: seller2Id,
        name: 'Priya Sharma',
        skills: ['plumbing', 'electrical'],
        rating: 4.6,
        location: 'Delhi',
        followers: 89,
        bio: 'Expert plumber and electrician with 3 years experience',
        verified: true
      });

      await this.createService({
        title: 'Plumbing Repair',
        description: 'Complete plumbing repair and maintenance services.',
        price: 'Starting ₹300/hour',
        category: 'Plumbing',
        sellerId: seller2Id
      });

      await this.createService({
        title: 'Electrical Installation',
        description: 'Professional electrical installation and wiring services.',
        price: 'Starting ₹500/hour',
        category: 'Electrical',
        sellerId: seller2Id
      });

      console.log('✅ Sample data initialized with jobs, services, and sellers');
    }
  }
}

export const localDB = LocalDatabase.getInstance(); 