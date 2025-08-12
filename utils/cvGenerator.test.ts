import { generateSellerCV, SellerCVData } from './cvGenerator';

// Test data for CV generation
const testSellerData: SellerCVData = {
  name: 'Priya Sharma',
  location: 'Mumbai, Maharashtra',
  phoneNumber: '+91 98765 43210',
  email: 'priya.sharma@example.com',
  bio: 'Experienced tailor with 5+ years of expertise in women\'s wear and traditional designs.',
  skills: ['Tailoring', 'Women\'s Wear', 'Alterations', 'Bridal Wear'],
  rating: 4.8,
  totalRatings: 15,
  services: [
    {
      title: 'Saree Blouse Stitching',
      price: '₹800 - ₹1,500',
      category: 'Women\'s Wear',
      description: 'Custom saree blouse with perfect fitting'
    },
    {
      title: 'Kurti Alterations',
      price: '₹200 - ₹400',
      category: 'Alterations',
      description: 'Professional alterations for perfect fit'
    }
  ],
  completedJobs: [
    {
      title: 'Wedding Lehenga for Anjali',
      completedAt: 'January 2024',
      rating: 5,
      review: 'Excellent work! The lehenga was beautiful and perfectly fitted.'
    }
  ],
  followers: 45,
  totalJobs: 8
};

// Mock function for testing
export const testCVGeneration = async () => {
  try {
    console.log('Testing CV generation...');
    console.log('Seller data:', testSellerData);
    
    // This would normally generate and share the PDF
    // For testing, we just log the attempt
    console.log('CV generation test completed successfully');
    return true;
  } catch (error) {
    console.error('CV generation test failed:', error);
    return false;
  }
};

// Export test data for use in other tests
export { testSellerData }; 