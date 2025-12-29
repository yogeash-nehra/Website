/**
 * Google Sheets API Wrapper
 * Handles communication with Google Apps Script backend
 */

class GoogleSheetsAPI {
  constructor() {
    this.baseUrl = CONFIG.APPS_SCRIPT_URL;
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }
  
  /**
   * Make GET request to Apps Script
   */
  async get(action, params = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.append('action', action);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    // Check cache
    const cacheKey = url.toString();
    if (this.isCached(cacheKey)) {
      console.log('📦 Using cached data for:', action);
      return this.cache.get(cacheKey);
    }
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      // Cache the result
      this.setCache(cacheKey, data.data);
      
      return data.data;
      
    } catch (error) {
      console.error('❌ API GET Error:', error);
      throw new Error(`Failed to ${action}: ${error.message}`);
    }
  }
  
  /**
   * Make POST request to Apps Script
   */
  async post(action, data) {
    try {
      const payload = {
        action: action,
        ...data
      };
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
      
      // Clear cache on successful POST (data has changed)
      this.clearCache();
      
      return result.data;
      
    } catch (error) {
      console.error('❌ API POST Error:', error);
      throw new Error(`Failed to ${action}: ${error.message}`);
    }
  }
  
  /**
   * Get all workshops
   */
  async getWorkshops() {
    return await this.get('getWorkshops');
  }
  
  /**
   * Get events for a specific workshop
   */
  async getEvents(workshopId) {
    return await this.get('getEvents', { workshopId });
  }
  
  /**
   * Get all scheduled events
   */
  async getAllEvents() {
    return await this.get('getAllEvents');
  }
  
  /**
   * Check availability for an event
   */
  async checkAvailability(eventId) {
    // Don't cache availability - always fresh
    const url = new URL(this.baseUrl);
    url.searchParams.append('action', 'checkAvailability');
    url.searchParams.append('eventId', eventId);
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to check availability');
    }
    
    return data.data;
  }
  
  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(eventId, customerData) {
    return await this.post('createCheckoutSession', {
      eventId,
      customerData
    });
  }
  
  /**
   * Confirm booking after payment
   */
  async confirmBooking(sessionId) {
    return await this.post('confirmBooking', { sessionId });
  }
  
  /**
   * Validate booking before payment
   */
  async validateBooking(eventId, numSeats = 1) {
    return await this.post('validateBooking', { eventId, numSeats });
  }
  
  /**
   * Cache management
   */
  isCached(key) {
    if (!this.cache.has(key)) return false;
    const expiry = this.cacheExpiry.get(key);
    if (Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return false;
    }
    return true;
  }
  
  setCache(key, value) {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + CONFIG.CACHE_DURATION);
  }
  
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Create global instance
const sheetsAPI = new GoogleSheetsAPI();

