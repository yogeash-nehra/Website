/**
 * Workshop Service - Handles workshop and event data retrieval
 */

const WorkshopService = {
  
  /**
   * Get all active workshops from catalog
   */
  getWorkshops: function() {
    const config = getConfiguration();
    const sheet = getSheet(config.WORKSHOP_CATALOG_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    const workshops = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Only include active workshops
      if (row[8] === 'Active') {
        workshops.push({
          workshopId: row[0],
          name: row[1],
          description: row[2],
          format: row[3],
          duration: row[4],
          price: row[5],
          totalSeats: row[6],
          location: row[7],
          status: row[8]
        });
      }
    }
    
    return workshops;
  },
  
  /**
   * Get workshop by ID
   */
  getWorkshopById: function(workshopId) {
    const workshops = this.getWorkshops();
    return workshops.find(w => w.workshopId === workshopId);
  },
  
  /**
   * Get all scheduled events
   */
  getAllScheduledEvents: function() {
    const config = getConfiguration();
    const sheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const events = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Only include active events
      if (row[5] === 'Active') {
        events.push({
          eventId: row[0],
          workshopId: row[1],
          eventDate: this.formatDate(row[2]),
          eventTime: row[3],
          availableSeats: row[4],
          status: row[5],
          venueDetails: row[6]
        });
      }
    }
    
    return events;
  },
  
  /**
   * Get scheduled events for a specific workshop
   */
  getEventsByWorkshop: function(workshopId) {
    const allEvents = this.getAllScheduledEvents();
    return allEvents.filter(e => e.workshopId === workshopId);
  },
  
  /**
   * Check availability for specific event
   */
  checkAvailability: function(eventId) {
    const config = getConfiguration();
    const sheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[0] === eventId) {
        const availableSeats = row[4];
        const status = row[5];
        
        return {
          eventId: eventId,
          availableSeats: availableSeats,
          status: status,
          isAvailable: availableSeats > 0 && status === 'Active',
          isClosingSoon: this.isClosingSoon(row[2]),
          isNearlyFull: availableSeats <= 5 && availableSeats > 0
        };
      }
    }
    
    throw new Error('Event not found: ' + eventId);
  },
  
  /**
   * Get full event details with workshop info
   */
  getEventDetails: function(eventId) {
    const config = getConfiguration();
    const eventsSheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const eventsData = eventsSheet.getDataRange().getValues();
    
    // Find event
    let eventRow = null;
    for (let i = 1; i < eventsData.length; i++) {
      if (eventsData[i][0] === eventId) {
        eventRow = eventsData[i];
        break;
      }
    }
    
    if (!eventRow) {
      throw new Error('Event not found: ' + eventId);
    }
    
    // Get workshop details
    const workshop = this.getWorkshopById(eventRow[1]);
    
    if (!workshop) {
      throw new Error('Workshop not found for event: ' + eventId);
    }
    
    return {
      eventId: eventRow[0],
      workshopId: eventRow[1],
      eventDate: this.formatDate(eventRow[2]),
      eventTime: eventRow[3],
      availableSeats: eventRow[4],
      status: eventRow[5],
      venueDetails: eventRow[6],
      workshop: workshop
    };
  },
  
  /**
   * Check if event is closing soon (within 7 days)
   */
  isClosingSoon: function(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    const daysUntil = Math.ceil((event - now) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil > 0;
  },
  
  /**
   * Format date consistently
   */
  formatDate: function(date) {
    if (!date) return '';
    const d = new Date(date);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
};

