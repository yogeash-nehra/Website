/**
 * Workshop Availability Display
 * Updates workshop cards with real-time seat availability and status badges
 */

class WorkshopAvailability {
  constructor() {
    this.refreshInterval = 120000; // 2 minutes
    this.events = {};
    this.workshops = {};
    this.init();
  }
  
  /**
   * Initialize availability system
   */
  async init() {
    console.log('🔄 Initializing workshop availability system...');
    
    try {
      // Load data
      await this.loadData();
      
      // Update UI
      this.updateAllAvailability();
      
      // Set up auto-refresh
      this.setupAutoRefresh();
      
      console.log('✅ Workshop availability system initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize availability system:', error);
    }
  }
  
  /**
   * Load workshop and event data
   */
  async loadData() {
    try {
      // Load events and workshops in parallel
      const [events, workshops] = await Promise.all([
        sheetsAPI.getAllEvents(),
        sheetsAPI.getWorkshops()
      ]);
      
      // Create lookup maps
      events.forEach(event => {
        this.events[event.eventId] = event;
      });
      
      workshops.forEach(workshop => {
        this.workshops[workshop.workshopId] = workshop;
      });
      
      console.log(`📊 Loaded ${events.length} events and ${workshops.length} workshops`);
      
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      throw error;
    }
  }
  
  /**
   * Update all availability indicators on the page
   */
  updateAllAvailability() {
    // Find all book now buttons
    const bookButtons = document.querySelectorAll('[href*="book.html"]');
    
    bookButtons.forEach(button => {
      const href = button.getAttribute('href');
      const eventId = this.extractEventId(href);
      
      if (eventId && this.events[eventId]) {
        this.updateButtonAvailability(button, eventId);
      }
    });
    
    // Update calendar table if present
    this.updateCalendarAvailability();
  }
  
  /**
   * Extract event ID from URL
   */
  extractEventId(url) {
    const match = url.match(/[?&]event=([^&]+)/);
    return match ? match[1] : null;
  }
  
  /**
   * Update individual button availability
   */
  updateButtonAvailability(button, eventId) {
    const event = this.events[eventId];
    
    if (!event) return;
    
    // Get parent element to add badges
    let container = button.closest('.wh-actions');
    if (!container) {
      container = button.parentElement;
    }
    
    // Remove existing availability info
    const existingInfo = container.querySelector('.availability-info');
    if (existingInfo) {
      existingInfo.remove();
    }
    
    // Create availability info
    const availInfo = document.createElement('div');
    availInfo.className = 'availability-info';
    availInfo.style.cssText = 'margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;';
    
    // Seats badge
    const seatsBadge = this.createBadge(
      `${event.availableSeats} seats left`,
      event.availableSeats > 5 ? 'success' : (event.availableSeats > 0 ? 'warning' : 'danger')
    );
    availInfo.appendChild(seatsBadge);
    
    // Check if closing soon
    const daysUntil = this.getDaysUntil(event.eventDate);
    if (daysUntil <= 7 && daysUntil > 0) {
      const closingBadge = this.createBadge('Closing Soon', 'info');
      availInfo.appendChild(closingBadge);
    }
    
    // Nearly full badge
    if (event.availableSeats <= 5 && event.availableSeats > 0) {
      const nearlyFullBadge = this.createBadge('Nearly Full!', 'warning');
      availInfo.appendChild(nearlyFullBadge);
    }
    
    // Sold out handling
    if (event.availableSeats <= 0 || event.status !== 'Active') {
      button.style.opacity = '0.5';
      button.style.pointerEvents = 'none';
      button.textContent = 'Sold Out';
      
      const soldOutBadge = this.createBadge('Sold Out', 'danger');
      availInfo.innerHTML = '';
      availInfo.appendChild(soldOutBadge);
    }
    
    container.appendChild(availInfo);
  }
  
  /**
   * Update calendar table availability
   */
  updateCalendarAvailability() {
    // Find all calendar book buttons
    const calendarButtons = document.querySelectorAll('.cal-book-btn');
    
    calendarButtons.forEach(button => {
      const href = button.getAttribute('href');
      const eventId = this.extractEventId(href);
      
      if (eventId && this.events[eventId]) {
        const event = this.events[eventId];
        
        // Update button if sold out
        if (event.availableSeats <= 0 || event.status !== 'Active') {
          button.textContent = 'Sold Out';
          button.style.opacity = '0.6';
          button.style.pointerEvents = 'none';
          button.style.background = '#999';
        } else if (event.availableSeats <= 5) {
          // Add visual indicator for nearly full
          button.style.background = '#ff9800';
        }
        
        // Add seats remaining text in parent cell
        const cell = button.closest('td');
        if (cell && !cell.querySelector('.seats-remaining')) {
          const seatsText = document.createElement('div');
          seatsText.className = 'seats-remaining';
          seatsText.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
          seatsText.textContent = `${event.availableSeats} seats left`;
          cell.appendChild(seatsText);
        }
      }
    });
  }
  
  /**
   * Create availability badge
   */
  createBadge(text, type) {
    const badge = document.createElement('span');
    badge.className = `availability-badge badge-${type}`;
    badge.textContent = text;
    
    const colors = {
      success: { bg: '#e8f5e9', color: '#2e7d32' },
      warning: { bg: '#fff3e0', color: '#e65100' },
      danger: { bg: '#ffebee', color: '#c62828' },
      info: { bg: '#e3f2fd', color: '#1565c0' }
    };
    
    const style = colors[type] || colors.info;
    badge.style.cssText = `
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: ${style.bg};
      color: ${style.color};
    `;
    
    return badge;
  }
  
  /**
   * Get days until event
   */
  getDaysUntil(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  /**
   * Setup auto-refresh
   */
  setupAutoRefresh() {
    setInterval(async () => {
      console.log('🔄 Refreshing availability data...');
      try {
        await this.loadData();
        this.updateAllAvailability();
        console.log('✅ Availability refreshed');
      } catch (error) {
        console.error('❌ Failed to refresh availability:', error);
      }
    }, this.refreshInterval);
  }
  
  /**
   * Force refresh
   */
  async refresh() {
    await this.loadData();
    this.updateAllAvailability();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on workshop pages
    if (window.location.pathname.includes('workshops') || window.location.pathname.includes('workshop')) {
      window.workshopAvailability = new WorkshopAvailability();
    }
  });
} else {
  if (window.location.pathname.includes('workshops') || window.location.pathname.includes('workshop')) {
    window.workshopAvailability = new WorkshopAvailability();
  }
}

