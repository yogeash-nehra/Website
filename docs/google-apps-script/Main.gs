/**
 * Main Web App Entry Point
 * Handles all API requests for workshops, events, and bookings
 */

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'getWorkshops':
        return jsonResponse(WorkshopService.getWorkshops());
        
      case 'getWorkshopById':
        const workshopId = e.parameter.workshopId;
        return jsonResponse(WorkshopService.getWorkshopById(workshopId));
        
      case 'getAllScheduledEvents':
        return jsonResponse({ events: WorkshopService.getAllScheduledEvents() });
        
      case 'getEventsByWorkshop':
        const wId = e.parameter.workshopId;
        return jsonResponse({ events: WorkshopService.getEventsByWorkshop(wId) });
        
      case 'getEventDetails':
        const eventId = e.parameter.eventId;
        return jsonResponse(WorkshopService.getEventDetails(eventId));
        
      case 'checkAvailability':
        const eId = e.parameter.eventId;
        return jsonResponse(WorkshopService.checkAvailability(eId));
        
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'createBooking':
        return jsonResponse(BookingService.createBooking(data));
        
      case 'confirmPayment':
        return jsonResponse(BookingService.confirmPayment(data.bookingId, data.paymentDetails));
        
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Helper function to return JSON response
 */
function jsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Get configuration
 */
function getConfiguration() {
  return {
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE', // Replace with your actual spreadsheet ID
    WORKSHOP_CATALOG_SHEET: 'Workshop Catalogue',
    SCHEDULED_EVENTS_SHEET: 'Scheduled Events',
    BOOKINGS_SHEET: 'Bookings',
    BOOKING_ID_PREFIX: 'WH'
  };
}

/**
 * Get sheet by name
 */
function getSheet(sheetName) {
  const config = getConfiguration();
  const ss = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  return sheet;
}
