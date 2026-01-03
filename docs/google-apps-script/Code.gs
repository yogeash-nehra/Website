/**
 * Main entry point for GET requests
 * Handles: getWorkshops, getEvents, checkAvailability, getAllEvents
 */
function doGet(e) {
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
 * Handles form-encoded data (no CORS preflight!)
 */
function doPost(e) {
  try {
    // e.parameter contains form-encoded data
    const requestData = e.parameter;
    const action = requestData.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' });
    }
    
    let result;
    
    switch(action) {
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
        
      case 'createCheckoutSession':
        if (!requestData.eventId || !requestData.customerData) {
          return createResponse({ success: false, error: 'Missing required fields' });
        }
        
        // Parse customerData if it's a JSON string
        let customerData = requestData.customerData;
        if (typeof customerData === 'string') {
          try {
            customerData = JSON.parse(customerData);
          } catch (parseError) {
            return createResponse({ success: false, error: 'Invalid customerData format' });
          }
        }
        
        result = StripeService.createCheckoutSession(
          requestData.eventId,
          customerData
        );
        break;
        
      case 'confirmBooking':
        if (!requestData.sessionId) {
          return createResponse({ success: false, error: 'Session ID required' });
        }
        result = BookingService.confirmBooking(requestData.sessionId);
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

