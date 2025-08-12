// Geocoding utility for reverse geocoding coordinates to city names
// This is a simplified implementation. In production, you'd use Google Maps API or similar

interface GeocodeResult {
  city: string;
  state: string;
  country: string;
  formattedAddress: string;
}

// Mock geocoding data for major Indian cities
const cityCoordinates = [
  { lat: 12.9716, lng: 77.5946, city: 'Bangalore', state: 'Karnataka', country: 'India' },
  { lat: 19.0760, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { lat: 28.7041, lng: 77.1025, city: 'Delhi', state: 'Delhi', country: 'India' },
  { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal', country: 'India' },
  { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { lat: 12.2958, lng: 76.6394, city: 'Mysore', state: 'Karnataka', country: 'India' },
  { lat: 15.2993, lng: 74.1240, city: 'Goa', state: 'Goa', country: 'India' },
  { lat: 26.8467, lng: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', state: 'Dubai', country: 'UAE' },
  { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'New York', country: 'USA' },
  { lat: 51.5074, lng: -0.1278, city: 'London', state: 'England', country: 'UK' },
];

// Calculate distance between two points using Haversine formula
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

// Reverse geocode coordinates to city name
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult> {
  try {
    // Find the closest city from our mock data
    let closestCity = cityCoordinates[0];
    let minDistance = calculateDistance(latitude, longitude, closestCity.lat, closestCity.lng);

    for (const city of cityCoordinates) {
      const distance = calculateDistance(latitude, longitude, city.lat, city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    }

    // If the closest city is more than 100km away, return a generic result
    if (minDistance > 100) {
      return {
        city: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country',
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      };
    }

    return {
      city: closestCity.city,
      state: closestCity.state,
      country: closestCity.country,
      formattedAddress: `${closestCity.city}, ${closestCity.state}, ${closestCity.country}`
    };

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to reverse geocode coordinates');
  }
}

// Get city information by name
export async function getCityInfo(cityName: string): Promise<GeocodeResult | null> {
  try {
    const city = cityCoordinates.find(c => 
      c.city.toLowerCase() === cityName.toLowerCase()
    );

    if (!city) {
      return null;
    }

    return {
      city: city.city,
      state: city.state,
      country: city.country,
      formattedAddress: `${city.city}, ${city.state}, ${city.country}`
    };

  } catch (error) {
    console.error('Get city info error:', error);
    return null;
  }
}

// Get nearby cities within a radius
export async function getNearbyCities(
  latitude: number, 
  longitude: number, 
  radiusKm: number = 50
): Promise<GeocodeResult[]> {
  try {
    const nearbyCities = cityCoordinates
      .map(city => ({
        ...city,
        distance: calculateDistance(latitude, longitude, city.lat, city.lng)
      }))
      .filter(city => city.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .map(city => ({
        city: city.city,
        state: city.state,
        country: city.country,
        formattedAddress: `${city.city}, ${city.state}, ${city.country}`,
        distance: Math.round(city.distance * 10) / 10
      }));

    return nearbyCities;

  } catch (error) {
    console.error('Get nearby cities error:', error);
    return [];
  }
}

// Validate coordinates
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    !isNaN(latitude) && !isNaN(longitude)
  );
}

// Format coordinates for display
export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${Math.abs(latitude).toFixed(4)}°${latDir}, ${Math.abs(longitude).toFixed(4)}°${lngDir}`;
} 