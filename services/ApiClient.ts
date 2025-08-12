// Frontend-safe API client that uses HTTP requests
export class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use localhost for development, can be configured for production
    this.baseUrl = 'http://localhost:3001/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        // Don't throw error, return null instead to prevent app crashes
        console.warn(`API request failed: ${response.status} - ${response.statusText}`);
        return null as T;
      }

      return await response.json();
    } catch (error) {
      // Log error but don't throw to prevent app crashes
      console.warn('API request failed:', error);
      return null as T;
    }
  }

  // User operations
  async createUser(userData: any): Promise<any> {
    try {
      return await this.request('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.warn('Create user failed:', error);
      return null;
    }
  }

  async getUser(userId: string): Promise<any> {
    try {
      return await this.request(`/users/${userId}`);
    } catch (error) {
      console.warn('Get user failed:', error);
      return null;
    }
  }

  async getUserByPhone(phoneNumber: string): Promise<any> {
    try {
      return await this.request(`/users/phone/${phoneNumber}`);
    } catch (error) {
      console.warn('Get user by phone failed:', error);
      return null;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      return await this.request('/users') || [];
    } catch (error) {
      console.warn('Get users failed:', error);
      return [];
    }
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      return await this.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.warn('Update user failed:', error);
      return null;
    }
  }

  // Job operations
  async createJob(jobData: any): Promise<any> {
    try {
      return await this.request('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
    } catch (error) {
      console.warn('Create job failed:', error);
      return null;
    }
  }

  async getJobs(filters?: any): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters);
      return await this.request(`/jobs?${params}`) || [];
    } catch (error) {
      console.warn('Get jobs failed:', error);
      return [];
    }
  }

  async updateJobStatus(jobId: string, status: string): Promise<any> {
    try {
      return await this.request(`/jobs/${jobId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.warn('Update job status failed:', error);
      return null;
    }
  }

  // Service operations
  async createService(serviceData: any): Promise<any> {
    try {
      return await this.request('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });
    } catch (error) {
      console.warn('Create service failed:', error);
      return null;
    }
  }

  async getServices(sellerId?: string): Promise<any[]> {
    try {
      const params = sellerId ? `?sellerId=${sellerId}` : '';
      return await this.request(`/services${params}`) || [];
    } catch (error) {
      console.warn('Get services failed:', error);
      return [];
    }
  }

  // Seller operations
  async createSeller(sellerData: any): Promise<any> {
    try {
      return await this.request('/sellers', {
        method: 'POST',
        body: JSON.stringify(sellerData),
      });
    } catch (error) {
      console.warn('Create seller failed:', error);
      return null;
    }
  }

  async getSellers(filters?: any): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters);
      return await this.request(`/sellers?${params}`) || [];
    } catch (error) {
      console.warn('Get sellers failed:', error);
      return [];
    }
  }

  async getSeller(sellerId: string): Promise<any> {
    try {
      return await this.request(`/sellers/${sellerId}`);
    } catch (error) {
      console.warn('Get seller failed:', error);
      return null;
    }
  }

  async followSeller(sellerId: string, followerId: string): Promise<any> {
    try {
      return await this.request('/follows', {
        method: 'POST',
        body: JSON.stringify({ sellerId, followerId }),
      });
    } catch (error) {
      console.warn('Follow seller failed:', error);
      return null;
    }
  }

  async unfollowSeller(sellerId: string, followerId: string): Promise<any> {
    try {
      return await this.request(`/follows/${sellerId}/${followerId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Unfollow seller failed:', error);
      return null;
    }
  }

  async getFollowedSellers(userId: string): Promise<any[]> {
    try {
      return await this.request(`/follows/${userId}`) || [];
    } catch (error) {
      console.warn('Get followed sellers failed:', error);
      return [];
    }
  }

  async createNotification(notificationData: any): Promise<any> {
    try {
      return await this.request('/notifications', {
        method: 'POST',
        body: JSON.stringify(notificationData),
      });
    } catch (error) {
      console.warn('Create notification failed:', error);
      return null;
    }
  }

  async getNotifications(userId: string): Promise<any[]> {
    try {
      return await this.request(`/notifications/${userId}`) || [];
    } catch (error) {
      console.warn('Get notifications failed:', error);
      return [];
    }
  }

  async healthCheck(): Promise<any> {
    try {
      return await this.request('/');
    } catch (error) {
      console.warn('Health check failed:', error);
      return null;
    }
  }

  async clearAllData(): Promise<any> {
    try {
      return await this.request('/clear', { method: 'DELETE' });
    } catch (error) {
      console.warn('Clear data failed:', error);
      return null;
    }
  }

  async getAllData(): Promise<any> {
    try {
      return await this.request('/data');
    } catch (error) {
      console.warn('Get all data failed:', error);
      return null;
    }
  }
}

export const apiClient = new ApiClient(); 