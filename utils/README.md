# Digital CV Feature

## Overview
The Digital CV feature allows sellers to generate and download a professional PDF resume that includes their profile information, skills, services, and work history.

## Files
- `cvGenerator.ts` - Main utility for PDF generation
- `cvGenerator.test.ts` - Test file for the CV generation functionality

## Features

### PDF Content
The generated PDF includes:
- **Header**: Udyami logo and "Digital CV" title
- **Profile Section**: Name, location, contact info, stats (rating, jobs completed, followers)
- **About Me**: Bio/description (if available)
- **Skills & Expertise**: All skills as styled tags
- **Services Offered**: Service listings with prices and descriptions
- **Recent Work**: Completed jobs with ratings and reviews
- **Footer**: Generation timestamp and Udyami branding

### Design
- Clean, professional layout
- Udyami brand colors (#b73c2f, #956a41, #e19b3c)
- Responsive design for different screen sizes
- Print-optimized CSS

## Usage

### In Seller Profile
The "Download Digital CV" button appears in the seller's profile screen:
- Green download icon button next to the edit profile button
- Only visible to sellers on their own profile
- Generates PDF with current profile data

### Function Call
```typescript
import { generateSellerCV, SellerCVData } from '@/utils/cvGenerator';

const sellerData: SellerCVData = {
  name: 'Seller Name',
  location: 'City, State',
  phoneNumber: '+91 98765 43210',
  // ... other data
};

await generateSellerCV(sellerData);
```

## Dependencies
- `expo-print` - For PDF generation
- `expo-sharing` - For file sharing/download

## Installation
```bash
npm install expo-print expo-sharing
```

## Data Structure
```typescript
interface SellerCVData {
  name: string;
  location: string;
  phoneNumber: string;
  email?: string;
  bio?: string;
  skills: string[];
  rating: number;
  totalRatings: number;
  services: Array<{
    title: string;
    price: string;
    category: string;
    description?: string;
  }>;
  completedJobs: Array<{
    title: string;
    completedAt: string;
    rating?: number;
    review?: string;
  }>;
  followers: number;
  totalJobs: number;
}
```

## Future Enhancements
- Add profile photo to PDF
- Include portfolio images
- Add QR code linking to seller profile
- Customizable CV templates
- Multiple language support
- Export to different formats (DOC, TXT)

## Testing
Run the test file to verify functionality:
```typescript
import { testCVGeneration } from '@/utils/cvGenerator.test';
await testCVGeneration();
``` 