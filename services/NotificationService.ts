import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for sellers and their skills
const mockSellers = [
  {
    id: 104,
    name: 'Vikram',
    skills: ['Plumbing', 'Painting'],
    location: 'Delhi',
    phone: '9876543214',
  },
  {
    id: 106,
    name: 'Manish',
    skills: ['Electrician', 'Welding'],
    location: 'Bangalore',
    phone: '9876543216',
  },
  {
    id: 108,
    name: 'Aman',
    skills: ['AC Repair', 'Refrigeration'],
    location: 'Mumbai',
    phone: '9876543218',
  },
  {
    id: 110,
    name: 'Rajiv',
    skills: ['Woodwork', 'Furniture'],
    location: 'Kochi',
    phone: '9876543220',
  },
  {
    id: 112,
    name: 'Deepak',
    skills: ['Masonry', 'Tiling'],
    location: 'Indore',
    phone: '9876543222',
  },
  {
    id: 114,
    name: 'Painter',
    skills: ['Painting', 'Interior'],
    location: 'Chennai',
    phone: '9876543224',
  },
  {
    id: 116,
    name: 'Gardener',
    skills: ['Gardening', 'Landscaping'],
    location: 'Lucknow',
    phone: '9876543226',
  },
  {
    id: 118,
    name: 'Metalworker',
    skills: ['Metalwork', 'Welding'],
    location: 'Kolkata',
    phone: '9876543228',
  },
  {
    id: 120,
    name: 'Repairman',
    skills: ['Repair', 'General Maintenance'],
    location: 'Asansol',
    phone: '9876543230',
  },
  {
    id: 122,
    name: 'Security',
    skills: ['CCTV', 'Security Systems'],
    location: 'Hyderabad',
    phone: '9876543232',
  },
];

// Mock data for posted jobs
const mockJobs = [
  {
    id: 402,
    title: 'Install Sink',
    description: 'Kitchen sink with tap',
    skill: 'Plumbing',
    budget_min: 1000,
    budget_max: 2500,
    timeline: '2 days',
    location: 'Chennai',
    buyer_id: 103,
    status: 'open',
    applicants: 2,
    posted_at: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
  },
  {
    id: 403,
    title: 'Fan Installation',
    description: 'Install ceiling fan',
    skill: 'Electrician',
    budget_min: 400,
    budget_max: 800,
    timeline: '1 day',
    location: 'Delhi',
    buyer_id: 105,
    status: 'open',
    applicants: 1,
    posted_at: Date.now() - 26 * 60 * 60 * 1000, // 26 hours ago
  },
  {
    id: 404,
    title: 'Paint Bedroom',
    description: 'Repaint entire bedroom',
    skill: 'Painting',
    budget_min: 1500,
    budget_max: 3000,
    timeline: '3 days',
    location: 'Lucknow',
    buyer_id: 107,
    status: 'open',
    applicants: 2,
    posted_at: Date.now() - 27 * 60 * 60 * 1000, // 27 hours ago
  },
  {
    id: 405,
    title: 'Tiling Kitchen',
    description: 'Backsplash wall tiling',
    skill: 'Tiling',
    budget_min: 2000,
    budget_max: 3500,
    timeline: '2 days',
    location: 'Mumbai',
    buyer_id: 109,
    status: 'open',
    applicants: 1,
    posted_at: Date.now() - 28 * 60 * 60 * 1000, // 28 hours ago
  },
  {
    id: 406,
    title: 'Security Setup',
    description: 'Install CCTV camera',
    skill: 'CCTV',
    budget_min: 5000,
    budget_max: 10000,
    timeline: '1 day',
    location: 'Kochi',
    buyer_id: 111,
    status: 'open',
    applicants: 3,
    posted_at: Date.now() - 29 * 60 * 60 * 1000, // 29 hours ago
  },
];

export interface NotificationData {
  id: string;
  type: 'seller_job' | 'buyer_reminder' | 'buyer_followup';
  title: string;
  message: string;
  jobData?: any;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];

  private constructor() {
    this.loadNotifications();
    this.startPolling();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async loadNotifications() {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private async saveNotifications() {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Subscribe to notification updates
  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get all notifications
  getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Dismiss notification
  dismissNotification(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.dismissed = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Simulate seller job notification
  private simulateSellerJobNotification(job: any) {
    const matchingSellers = mockSellers.filter(seller => 
      seller.skills.includes(job.skill) && 
      seller.location === job.location
    );

    matchingSellers.forEach(seller => {
      const notification: NotificationData = {
        id: `seller_job_${job.id}_${seller.id}`,
        type: 'seller_job',
        title: `New job for ${job.skill} in your area!`,
        message: `A buyer in ${job.location} is looking for ${job.skill} work.`,
        jobData: job,
        timestamp: Date.now(),
        read: false,
        dismissed: false,
      };

      this.notifications.unshift(notification);
    });

    this.saveNotifications();
    this.notifyListeners();
  }

  // Simulate buyer reminder notification
  private simulateBuyerReminderNotification(job: any) {
    const notification: NotificationData = {
      id: `buyer_reminder_${job.id}`,
      type: 'buyer_reminder',
      title: 'Did you get an Udyami to fulfil your task?',
      message: `It's been 24 hours since you posted "${job.title}". Check if you found someone for the job.`,
      jobData: job,
      timestamp: Date.now(),
      read: false,
      dismissed: false,
    };

    this.notifications.unshift(notification);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Simulate posting a new job (triggers seller notifications)
  simulatePostJob(jobData: any) {
    // Add job to mock jobs
    const newJob = {
      ...jobData,
      id: Date.now(),
      posted_at: Date.now(),
      status: 'open',
      applicants: 0,
    };
    mockJobs.push(newJob);

    // Trigger seller notifications after a short delay
    setTimeout(() => {
      this.simulateSellerJobNotification(newJob);
    }, 2000);
  }

  // Start polling for notifications
  private startPolling() {
    // Check for buyer reminders every minute
    setInterval(() => {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      mockJobs.forEach(job => {
        const timeSincePosted = now - job.posted_at;
        const reminderId = `buyer_reminder_${job.id}`;
        
        // Check if it's been 24 hours and no reminder has been sent
        if (timeSincePosted >= twentyFourHours && 
            timeSincePosted < twentyFourHours + 60000 && // Within 1 minute window
            !this.notifications.some(n => n.id === reminderId)) {
          this.simulateBuyerReminderNotification(job);
        }
      });
    }, 60000); // Check every minute
  }

  // Get unread notification count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read && !n.dismissed).length;
  }

  // Get notifications for a specific user type
  getNotificationsForUser(userType: 'buyer' | 'seller', userId?: number): NotificationData[] {
    return this.notifications.filter(notification => {
      if (notification.dismissed) return false;
      
      if (userType === 'seller') {
        return notification.type === 'seller_job';
      } else {
        return notification.type === 'buyer_reminder' || notification.type === 'buyer_followup';
      }
    });
  }
}

export default NotificationService; 