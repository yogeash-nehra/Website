/**
 * Workshop Service - Handles workshop and event data retrieval
 * Updated to match your exact column structure with "Level" column
 */

const WorkshopService = {
  
  /**
   * Get all active workshops from catalog
   * Columns: Workshop ID | Workshop Name | Level | Description | Format | Duration | Price | Total Seats | Location | Status
   */
  getWorkshops: function() {
    const config = getConfiguration();
    const sheet = getSheet(config.WORKSHOP_CATALOG_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    const workshops = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Only include active workshops (Status is in column J, index 9)
      if (row[9] === 'Active') {
        workshops.push({
          workshopId: row[0],    // Column A: Workshop ID
          name: row[1],          // Column B: Workshop Name
          level: row[2],         // Column C: Level
          description: row[3],   // Column D: Description
          format: row[4],        // Column E: Format
          duration: row[5],      // Column F: Duration
          price: row[6],         // Column G: Price (NZD)
          totalSeats: row[7],    // Column H: Total Seats
          location: row[8],      // Column I: Location
          status: row[9]         // Column J: Status
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
   * Columns: Event ID | Workshop ID | Event Date | Event Time | Available Seats | Status | Venue Details
   */
  getAllScheduledEvents: function() {
    const config = getConfiguration();
    const sheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const events = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (!row[0]) continue;
      
      // Only include active events (Status is in column F, index 5)
      if (row[5] === 'Active') {
        // Get workshop details to include additional info
        const workshop = this.getWorkshopById(row[1]);
        
        events.push({
          eventId: row[0],          // Column A: Event ID
          workshopId: row[1],       // Column B: Workshop ID
          date: this.formatDate(row[2]), // Column C: Event Date
          time: row[3],             // Column D: Event Time
          availableSeats: parseInt(row[4]) || 0, // Column E: Available Seats
          status: row[5],           // Column F: Status
          location: row[6] || '',   // Column G: Venue Details
          
          // Include workshop info for easy access
          workshopName: workshop ? workshop.name : '',
          totalSeats: workshop ? workshop.totalSeats : 0,
          duration: workshop ? workshop.duration : '',
          price: workshop ? workshop.price : 0,
          format: workshop ? workshop.format : ''
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
        const availableSeats = parseInt(row[4]) || 0;
        const status = row[5];
        const workshop = this.getWorkshopById(row[1]);
        const totalSeats = workshop ? workshop.totalSeats : 0;
        
        return {
          eventId: eventId,
          workshopId: row[1],
          availableSeats: availableSeats,
          totalSeats: totalSeats,
          status: status,
          date: this.formatDate(row[2]),
          time: row[3],
          location: row[6],
          isAvailable: availableSeats > 0 && status === 'Active',
          isClosingSoon: this.isClosingSoon(row[2]),
          isNearlyFull: availableSeats <= 5 && availableSeats > 0,
          percentageFull: totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0
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
    
    const availableSeats = parseInt(eventRow[4]) || 0;
    const totalSeats = workshop.totalSeats || 0;
    
    return {
      // Event details
      eventId: eventRow[0],
      workshopId: eventRow[1],
      date: this.formatDate(eventRow[2]),
      time: eventRow[3],
      availableSeats: availableSeats,
      status: eventRow[5],
      location: eventRow[6],
      
      // Workshop details
      workshop: workshop,
      workshopName: workshop.name,
      totalSeats: totalSeats,
      duration: workshop.duration,
      price: workshop.price,
      format: workshop.format,
      level: workshop.level,
      description: workshop.description,
      
      // Computed fields
      isAvailable: availableSeats > 0 && eventRow[5] === 'Active',
      isNearlyFull: availableSeats <= 5 && availableSeats > 0,
      percentageFull: totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0
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
