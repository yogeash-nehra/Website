/**
 * Main entry point for GET requests
 * Handles: getWorkshops, getEvents, checkAvailability, validateBooking, createCheckoutSession
 */
function doGet(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' });
    }
    
    let result;
    
    switch(action) {
      case 'getWorkshops':
        result = WorkshopService.getWorkshops();
        break;
        
      case 'getEvents':
        const workshopId = e.parameter.workshopId;
        if (!workshopId) {
          return createResponse({ success: false, error: 'workshopId parameter required' });
        }
        result = WorkshopService.getEventsByWorkshop(workshopId);
        break;
        
      case 'checkAvailability':
        const eventId = e.parameter.eventId;
        if (!eventId) {
          return createResponse({ success: false, error: 'eventId parameter required' });
        }
        result = WorkshopService.checkAvailability(eventId);
        break;
        
      case 'getAllEvents':
        result = WorkshopService.getAllScheduledEvents();
        break;
        
      case 'validateBooking':
        // Handle validateBooking via GET to avoid CORS preflight
        if (!e.parameter.eventId) {
          return createResponse({ success: false, error: 'Event ID required' });
        }
        const numSeats = parseInt(e.parameter.numSeats) || 1;
        result = BookingService.validateBooking(
          e.parameter.eventId,
          numSeats
        );
        break;
        
      case 'createCheckoutSession':
        // Handle createCheckoutSession via GET to avoid CORS preflight
        if (!e.parameter.eventId || !e.parameter.customerData) {
          return createResponse({ success: false, error: 'Missing required fields' });
        }
        
        // Parse customerData if it's a JSON string
        let customerData = e.parameter.customerData;
        if (typeof customerData === 'string') {
          try {
            customerData = JSON.parse(customerData);
          } catch (parseError) {
            return createResponse({ success: false, error: 'Invalid customerData format' });
          }
        }
        
        result = StripeService.createCheckoutSession(
          e.parameter.eventId,
          customerData
        );
        break;
        
      case 'confirmBooking':
        // Handle confirmBooking via GET
        if (!e.parameter.sessionId) {
          return createResponse({ success: false, error: 'Session ID required' });
        }
        result = BookingService.confirmBooking(e.parameter.sessionId);
        break;
        
      default:
        return createResponse({ success: false, error: 'Invalid action: ' + action });
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse({ success: false, error: error.toString() });
  }
}

/**
 * Main entry point for POST requests
 * Handles both JSON and form-encoded data
 */
function doPost(e) {
  try {
    let requestData;
    
    // Check if it's JSON or form data
    if (e.postData && e.postData.type === 'application/json') {
      // JSON request (from fetch API)
      requestData = JSON.parse(e.postData.contents);
    } else {
      // Form-encoded or parameter request
      requestData = e.parameter;
    }
    
    const action = requestData.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' });
    }
    
    let result;
    
    switch(action) {
      case 'createCheckoutSession':
        if (!requestData.eventId || !requestData.customerData) {
          return createResponse({ success: false, error: 'Missing required fields' });
        }
        result = StripeService.createCheckoutSession(
          requestData.eventId,
          requestData.customerData
        );
        break;
        
      case 'confirmBooking':
        if (!requestData.sessionId) {
          return createResponse({ success: false, error: 'Session ID required' });
        }
        result = BookingService.confirmBooking(requestData.sessionId);
        break;
        
      case 'validateBooking':
        if (!requestData.eventId) {
          return createResponse({ success: false, error: 'Event ID required' });
        }
        const numSeats = parseInt(requestData.numSeats) || 1;
        result = BookingService.validateBooking(
          requestData.eventId,
          numSeats
        );
        break;
        
      default:
        return createResponse({ success: false, error: 'Invalid action: ' + action });
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({ success: false, error: error.toString() });
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

