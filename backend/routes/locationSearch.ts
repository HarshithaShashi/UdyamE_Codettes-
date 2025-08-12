import express from 'express';
import { mockData } from '../mockData';

const router = express.Router();

interface SearchRequest {
  query: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface SearchResult {
  id: string;
  name: string;
  skill: string;
  location: string;
  rating: number;
  distance?: number;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Mock location data for sellers
const sellerLocations = [
  { id: '1', latitude: 12.9716, longitude: 77.5946, city: 'Bangalore' }, // Bangalore
  { id: '2', latitude: 19.0760, longitude: 72.8777, city: 'Mumbai' }, // Mumbai
  { id: '3', latitude: 28.7041, longitude: 77.1025, city: 'Delhi' }, // Delhi
  { id: '4', latitude: 13.0827, longitude: 80.2707, city: 'Chennai' }, // Chennai
  { id: '5', latitude: 17.3850, longitude: 78.4867, city: 'Hyderabad' }, // Hyderabad
  { id: '6', latitude: 22.5726, longitude: 88.3639, city: 'Kolkata' }, // Kolkata
  { id: '7', latitude: 23.0225, longitude: 72.5714, city: 'Ahmedabad' }, // Ahmedabad
  { id: '8', latitude: 12.2958, longitude: 76.6394, city: 'Mysore' }, // Mysore
  { id: '9', latitude: 15.2993, longitude: 74.1240, city: 'Goa' }, // Goa
  { id: '10', latitude: 26.8467, longitude: 80.9462, city: 'Lucknow' }, // Lucknow
];

// Mock sellers data with skills
const mockSellers = [
  { id: '1', name: 'Rajesh Kumar', skill: 'Plumbing', rating: 4.5 },
  { id: '2', name: 'Suresh Patel', skill: 'Electrical', rating: 4.2 },
  { id: '3', name: 'Amit Singh', skill: 'Carpentry', rating: 4.7 },
  { id: '4', name: 'Vikram Sharma', skill: 'Painting', rating: 4.3 },
  { id: '5', name: 'Deepak Verma', skill: 'Masonry', rating: 4.6 },
  { id: '6', name: 'Ramesh Yadav', skill: 'Tailoring', rating: 4.4 },
  { id: '7', name: 'Lakshmi Devi', skill: 'Embroidery', rating: 4.8 },
  { id: '8', name: 'Anita Desai', skill: 'Interior Design', rating: 4.1 },
  { id: '9', name: 'Ganesh Iyer', skill: 'Welding', rating: 4.5 },
  { id: '10', name: 'Priya Reddy', skill: 'Gardening', rating: 4.2 },
];

router.post('/search-by-location', async (req, res) => {
  try {
    const { query, location }: SearchRequest = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    // Filter sellers based on search query
    let filteredSellers = mockSellers.filter(seller => 
      seller.name.toLowerCase().includes(query.toLowerCase()) ||
      seller.skill.toLowerCase().includes(query.toLowerCase())
    );

    // If location is provided, calculate distances and sort by proximity
    if (location) {
      const sellersWithDistance = filteredSellers.map(seller => {
        const sellerLocation = sellerLocations.find(loc => loc.id === seller.id);
        if (sellerLocation) {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            sellerLocation.latitude,
            sellerLocation.longitude
          );
          return {
            ...seller,
            location: sellerLocation.city,
            distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
          };
        }
        return {
          ...seller,
          location: 'Unknown',
          distance: undefined
        };
      });

      // Sort by distance (closest first)
      sellersWithDistance.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });

      // Limit results to top 10 closest matches
      filteredSellers = sellersWithDistance.slice(0, 10);
    } else {
      // If no location, just add city info without distance
      filteredSellers = filteredSellers.map(seller => {
        const sellerLocation = sellerLocations.find(loc => loc.id === seller.id);
        return {
          ...seller,
          location: sellerLocation?.city || 'Unknown'
        };
      });
    }

    // Convert to SearchResult format
    const results: SearchResult[] = filteredSellers.map(seller => ({
      id: seller.id,
      name: seller.name,
      skill: seller.skill,
      location: seller.location,
      rating: seller.rating,
      distance: (seller as any).distance
    }));

    res.json({
      success: true,
      results,
      total: results.length,
      query,
      locationUsed: !!location
    });

  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to perform location-based search'
    });
  }
});

// Get nearby sellers (without search query)
router.post('/nearby-sellers', async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 }: {
      latitude: number;
      longitude: number;
      radius?: number;
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    const nearbySellers = sellerLocations
      .map(location => {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );
        return { ...location, distance };
      })
      .filter(location => location.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const results = nearbySellers.map(location => {
      const seller = mockSellers.find(s => s.id === location.id);
      return {
        id: location.id,
        name: seller?.name || 'Unknown',
        skill: seller?.skill || 'Unknown',
        location: location.city,
        rating: seller?.rating || 0,
        distance: Math.round(location.distance * 10) / 10
      };
    });

    res.json({
      success: true,
      results,
      total: results.length,
      radius,
      userLocation: { latitude, longitude }
    });

  } catch (error) {
    console.error('Nearby sellers error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to find nearby sellers'
    });
  }
});

export default router; 