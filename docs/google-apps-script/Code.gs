/**
 * Main entry point for GET requests
 * Handles: getWorkshops, getEvents, checkAvailability
 */
function doGet(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    
    if (!action) {
      return createResponse({ error: 'Action parameter required' }, 400);
    }
    
    let result;
    
    switch(action) {
      case 'getWorkshops':
        result = WorkshopService.getWorkshops();
        break;
        
      case 'getEvents':
        const workshopId = e.parameter.workshopId;
        if (!workshopId) {
          return createResponse({ error: 'workshopId parameter required' }, 400);
        }
        result = WorkshopService.getEventsByWorkshop(workshopId);
        break;
        
      case 'checkAvailability':
        const eventId = e.parameter.eventId;
        if (!eventId) {
          return createResponse({ error: 'eventId parameter required' }, 400);
        }
        result = WorkshopService.checkAvailability(eventId);
        break;
        
      case 'getAllEvents':
        result = WorkshopService.getAllScheduledEvents();
        break;
        
      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Main entry point for POST requests
 * Handles: createCheckoutSession, confirmBooking
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    if (!action) {
      return createResponse({ error: 'Action parameter required' }, 400);
    }
    
    let result;
    
    switch(action) {
      case 'createCheckoutSession':
        // Validate required fields
        if (!requestData.eventId || !requestData.customerData) {
          return createResponse({ error: 'Missing required fields' }, 400);
        }
        result = StripeService.createCheckoutSession(
          requestData.eventId,
          requestData.customerData
        );
        break;
        
      case 'confirmBooking':
        // Validate payment and create booking
        if (!requestData.sessionId) {
          return createResponse({ error: 'Session ID required' }, 400);
        }
        result = BookingService.confirmBooking(requestData.sessionId);
        break;
        
      case 'validateBooking':
        // Pre-validate before showing payment
        if (!requestData.eventId || !requestData.numSeats) {
          return createResponse({ error: 'Missing required fields' }, 400);
        }
        result = BookingService.validateBooking(
          requestData.eventId,
          requestData.numSeats
        );
        break;
        
      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return createResponse({ status: 'OK' });
}

/**
 * Create standardized response with CORS headers
 */
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  return output;
}

/**
 * Test function to verify setup
 */
function testSetup() {
  Logger.log('Testing configuration...');
  
  const config = getConfiguration();
  Logger.log('Sheet ID: ' + (config.SHEET_ID ? 'Configured' : 'MISSING'));
  Logger.log('Stripe Key: ' + (config.STRIPE_SECRET_KEY ? 'Configured' : 'MISSING'));
  
  // Test sheet access
  try {
    const ss = SpreadsheetApp.openById(config.SHEET_ID);
    Logger.log('Sheet access: SUCCESS');
    Logger.log('Sheet name: ' + ss.getName());
  } catch (e) {
    Logger.log('Sheet access: FAILED - ' + e.toString());
  }
  
  Logger.log('Test complete!');
}

