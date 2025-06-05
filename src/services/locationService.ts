
export interface LocationData {
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class LocationService {
  static async getUserLocation(): Promise<LocationData | null> {
    try {
      // Try to get location from browser geolocation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      // Convert coordinates to city/state using reverse geocoding
      const locationData = await this.reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );

      return locationData;
    } catch (error) {
      console.log('Geolocation not available, trying IP-based detection');
      
      try {
        // Fallback to IP-based location detection
        return await this.getLocationFromIP();
      } catch (ipError) {
        console.error('Failed to detect location:', ipError);
        return null;
      }
    }
  }

  private static async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    // Using a free geocoding service (in production, use a reliable service like Google Maps)
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      const data = await response.json();
      
      return {
        city: data.city || data.locality || 'Unknown City',
        state: data.principalSubdivision || 'Unknown State',
        country: data.countryName || 'Unknown Country',
        coordinates: { lat, lng }
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return {
        city: 'Unknown City',
        state: 'Unknown State', 
        country: 'Unknown Country',
        coordinates: { lat, lng }
      };
    }
  }

  private static async getLocationFromIP(): Promise<LocationData> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        city: data.city || 'Unknown City',
        state: data.region || 'Unknown State',
        country: data.country_name || 'Unknown Country'
      };
    } catch (error) {
      console.error('IP geolocation failed:', error);
      throw new Error('Could not determine location');
    }
  }

  static formatLocation(location: LocationData): string {
    return `${location.city}, ${location.state}, ${location.country}`;
  }

  static extractLocationFromResume(resumeData: any): string | null {
    // Try to extract location from resume data
    const personalInfo = resumeData?.personalInfo;
    
    if (personalInfo?.city && personalInfo?.state) {
      return `${personalInfo.city}, ${personalInfo.state}`;
    }
    
    if (personalInfo?.location) {
      return personalInfo.location;
    }
    
    return null;
  }
}
