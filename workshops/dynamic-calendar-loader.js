/**
 * Enhanced Dynamic Calendar Loader
 * 
 * Fetches ALL events and workshops from Google Sheets
 * Groups events by workshop
 * Displays complete workshop details (name, duration, location)
 * Automatically updates from Google Sheets (source of truth)
 * 
 * NEW APPROACH:
 * 1. Fetch all events from Scheduled Events sheet
 * 2. Fetch all workshops from Workshop Catalog sheet
 * 3. Group events by workshop ID (service-1, service-2, etc.)
 * 4. For each group, get workshop details from catalog
 * 5. Display grouped by workshop with full details
 */

const DynamicCalendarLoader = {
  workshopData: null,
  eventData: null,
  
  /**
   * Initialize and load calendar from Google Sheets
   */
  async init() {
    console.log('📅 Initializing Dynamic Calendar Loader...');
    
    try {
      // Check if API is available
      if (typeof sheetsAPI === 'undefined') {
        throw new Error('Google Sheets API not loaded');
      }
      
      // Fetch workshops and events
      console.log('📊 Fetching workshops from Google Sheets...');
      this.workshopData = await sheetsAPI.getWorkshops();
      
      console.log('📅 Fetching events from Google Sheets...');
      this.eventData = await sheetsAPI.getAllEvents();
      
      console.log(`✅ Loaded ${this.workshopData.length} workshops and ${this.eventData.length} events`);
      
      // Render the calendar
      this.renderCalendar();
      
    } catch (error) {
      console.error('❌ Failed to load calendar:', error);
      this.showError('Unable to load calendar data. Please check your internet connection.');
    }
  },
  
  /**
   * Group events by workshop and enrich with workshop details
   */
  groupAndEnrichEvents() {
    console.log('🔄 Grouping events by workshop...');
    
    const grouped = {};
    
    // Group events by workshopId
    this.eventData.forEach(event => {
      const workshopId = event.workshopId;
      
      if (!workshopId) {
        console.warn('Event missing workshopId:', event);
        return;
      }
      
      if (!grouped[workshopId]) {
        grouped[workshopId] = {
          workshopId: workshopId,
          workshop: null,
          events: []
        };
      }
      
      grouped[workshopId].events.push(event);
    });
    
    // Enrich each group with workshop details from catalog
    Object.keys(grouped).forEach(workshopId => {
      const workshop = this.workshopData.find(w => w.workshopId === workshopId);
      
      if (workshop) {
        grouped[workshopId].workshop = workshop;
        console.log(`✅ Found workshop details for ${workshopId}: ${workshop.name}`);
      } else {
        console.warn(`⚠️ No workshop found in catalog for ${workshopId}`);
      }
    });
    
    // Sort events within each workshop by date
    Object.values(grouped).forEach(group => {
      group.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    // Sort groups by workshop ID (service-1, service-2, etc.)
    const sortedGroups = Object.keys(grouped)
      .sort((a, b) => {
        // Extract numbers from workshop IDs
        const numA = parseInt(a.replace('service-', ''));
        const numB = parseInt(b.replace('service-', ''));
        return numA - numB;
      })
      .reduce((obj, key) => {
        obj[key] = grouped[key];
        return obj;
      }, {});
    
    console.log(`✅ Grouped into ${Object.keys(sortedGroups).length} workshops`);
    
    return sortedGroups;
  },
  
  /**
   * Render the complete calendar
   */
  renderCalendar() {
    console.log('🎨 Rendering calendar...');
    
    const container = document.getElementById('calendar-2026');
    
    if (!container) {
      console.error('❌ Calendar container #calendar-2026 not found');
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Group and enrich events
    const groupedEvents = this.groupAndEnrichEvents();
    
    // Check if we have any events
    if (Object.keys(groupedEvents).length === 0) {
      container.innerHTML = `
        <div class="cal-wrap">
          <header class="cal-header">
            <h2 class="cal-title">2026 Workshops & Events Calendar</h2>
            <div class="cal-divider"></div>
          </header>
          <div style="text-align: center; padding: 40px; color: #666;">
            <p style="font-size: 18px;">No scheduled events yet.</p>
            <p>Check back soon for upcoming workshops!</p>
          </div>
        </div>
      `;
      return;
    }
    
    // Create calendar wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'cal-wrap';
    
    // Add header
    const header = document.createElement('header');
    header.className = 'cal-header';
    header.innerHTML = `
      <h2 class="cal-title">2026 Workshops & Events Calendar</h2>
      <div class="cal-divider"></div>
      <p class="cal-note" style="text-align: center; color: #666; margin-top: 10px;">
        All events are shown below, grouped by workshop. Click "Book Now" to reserve your seat.
      </p>
    `;
    wrapper.appendChild(header);
    
    // Create section for each workshop with events
    Object.values(groupedEvents).forEach(group => {
      if (group.events.length > 0 && group.workshop) {
        const section = this.createWorkshopSection(group);
        wrapper.appendChild(section);
      }
    });
    
    // Add refresh info
    const refreshInfo = this.createRefreshInfo();
    wrapper.appendChild(refreshInfo);
    
    container.appendChild(wrapper);
    
    console.log('✅ Calendar rendered successfully');
  },
  
  /**
   * Create section for a workshop with its events
   */
  createWorkshopSection(group) {
    const { workshop, events } = group;
    
    const section = document.createElement('div');
    section.className = 'cal-section';
    section.style.cssText = 'margin-bottom: 40px;';
    
    // Workshop header with full details
    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 15px;';
    header.innerHTML = `
      <h3 class="cal-section-title" style="margin-bottom: 8px;">${this.escapeHtml(workshop.name)}</h3>
      <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 14px; color: #666;">
        <span><b>Format:</b> ${this.escapeHtml(workshop.format)}</span>
        <span><b>Duration:</b> ${this.escapeHtml(workshop.duration)}</span>
        <span><b>Location:</b> ${this.escapeHtml(workshop.location)}</span>
        ${workshop.price ? `<span><b>Price:</b> $${workshop.price} NZD</span>` : ''}
      </div>
    `;
    section.appendChild(header);
    
    // Create table for events
    const table = document.createElement('table');
    table.className = 'cal-table';
    
    // Table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Day</th>
        <th>Time</th>
        <th>Venue</th>
        <th>Available Seats</th>
        <th>Action</th>
      </tr>
    `;
    table.appendChild(thead);
    
    // Table body with events
    const tbody = document.createElement('tbody');
    
    events.forEach(event => {
      const row = this.createEventRow(event, workshop);
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    section.appendChild(table);
    
    return section;
  },
  
  /**
   * Create table row for an event
   */
  createEventRow(event, workshop) {
    const tr = document.createElement('tr');
    
    // Parse date
    const eventDate = new Date(event.date);
    const dateStr = this.formatDate(eventDate);
    const dayStr = this.getDayName(eventDate);
    
    // Format time
    const timeStr = event.time || 'TBC';
    
    // Get venue (use event venue if available, otherwise workshop location)
    const venue = event.location || workshop.location || 'Venue TBC';
    
    // Seat availability
    const availableSeats = parseInt(event.availableSeats) || 0;
    const totalSeats = workshop.totalSeats || 0;
    
    let seatClass = 'cal-seats';
    let seatText = `${availableSeats} of ${totalSeats} available`;
    
    if (availableSeats === 0) {
      seatClass = 'cal-seats full';
      seatText = 'Fully Booked';
    } else if (availableSeats <= 5) {
      seatClass = 'cal-seats low';
      seatText = `Only ${availableSeats} left!`;
    }
    
    // Create row
    tr.innerHTML = `
      <td data-label="Date">${dateStr}</td>
      <td data-label="Day">${dayStr}</td>
      <td data-label="Time">${this.escapeHtml(timeStr)}</td>
      <td data-label="Venue">${this.escapeHtml(venue)}</td>
      <td data-label="Seats"><span class="${seatClass}">${seatText}</span></td>
      <td data-label="Action">
        ${availableSeats > 0 
          ? `<button class="cal-book-btn" onclick="openBookingModalWithEvents('${workshop.workshopId}')">Book Now</button>`
          : `<button class="cal-book-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Sold Out</button>`
        }
      </td>
    `;
    
    return tr;
  },
  
  /**
   * Format date (e.g., "11 Feb 2026")
   */
  formatDate(date) {
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  },
  
  /**
   * Get day name (e.g., "Monday")
   */
  getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  },
  
  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  /**
   * Create refresh info footer
   */
  createRefreshInfo() {
    const info = document.createElement('div');
    info.className = 'cal-refresh-info';
    info.style.cssText = 'text-align: center; padding: 30px 20px; color: #666; font-size: 14px; border-top: 1px solid #e8e8e8; margin-top: 20px;';
    
    const now = new Date();
    info.innerHTML = `
      <p style="margin-bottom: 10px;">
        <strong>Calendar last updated:</strong> ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}
      </p>
      <p style="margin-bottom: 15px; font-size: 13px;">
        Data sourced directly from Google Sheets
      </p>
      <button 
        onclick="DynamicCalendarLoader.forceRefresh()" 
        style="padding: 10px 20px; background: #d8aa6a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s;"
        onmouseover="this.style.background='#c99858'"
        onmouseout="this.style.background='#d8aa6a'"
      >
        🔄 Refresh Calendar
      </button>
    `;
    
    return info;
  },
  
  /**
   * Force refresh calendar data
   */
  async forceRefresh() {
    console.log('🔄 Force refreshing calendar...');
    
    const container = document.getElementById('calendar-2026');
    if (container) {
      container.innerHTML = `
        <div class="cal-wrap">
          <div style="text-align: center; padding: 60px 20px;">
            <p style="font-size: 18px; color: #666;">🔄 Refreshing calendar from Google Sheets...</p>
          </div>
        </div>
      `;
    }
    
    await this.init();
  },
  
  /**
   * Show error message
   */
  showError(message) {
    const container = document.getElementById('calendar-2026');
    
    if (container) {
      container.innerHTML = `
        <div class="cal-wrap">
          <header class="cal-header">
            <h2 class="cal-title">2026 Workshops & Events Calendar</h2>
            <div class="cal-divider"></div>
          </header>
          <div class="cal-error" style="text-align: center; padding: 40px; color: #d32f2f;">
            <p style="font-size: 18px; margin-bottom: 15px;">⚠️ ${this.escapeHtml(message)}</p>
            <button 
              onclick="DynamicCalendarLoader.forceRefresh()" 
              style="padding: 12px 24px; background: #d8aa6a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
            >
              Try Again
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  // Wait a bit for other scripts to load
  setTimeout(async () => {
    try {
      await DynamicCalendarLoader.init();
    } catch (error) {
      console.error('Failed to initialize calendar:', error);
    }
  }, 1000);
});

// Make globally available
window.DynamicCalendarLoader = DynamicCalendarLoader;

console.log('✅ Dynamic Calendar Loader initialized');
