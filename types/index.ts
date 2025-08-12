export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  email?: string;
  role: 'buyer' | 'seller';
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seller extends User {
  skills: string[];
  portfolio: PortfolioItem[];
  rating: number;
  totalRatings: number;
  followers: number;
  location: string;
  bio?: string;
  verified: boolean;
}

export interface Buyer extends User {
  interests: string[];
  following: string[];
  location: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skill: string;
  budget: string;
  timeline: string;
  location: string;
  buyerId: string;
  postedBy: string;
  postedAt: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applicants: string[];
  acceptedBy?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  sellerId: string;
  images: string[];
  active: boolean;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  sellerId: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  sellerId: string;
  buyerId: string;
  jobId: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_posted' | 'job_applied' | 'job_accepted' | 'rating_received' | 'new_follower';
  read: boolean;
  createdAt: string;
  data?: any;
}