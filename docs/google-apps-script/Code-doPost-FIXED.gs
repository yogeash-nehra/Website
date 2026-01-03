/**
 * Main entry point for POST requests
 * Handles: createCheckoutSession, confirmBooking, validateBooking
 */
function doPost(e) {
  try {
    // Parse request data
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' }, 400);
    }
    
    let result;
    
    switch(action) {
      case 'createCheckoutSession':
        // Validate required fields
        if (!requestData.eventId || !requestData.customerData) {
          return createResponse({ success: false, error: 'Missing required fields' }, 400);
        }
        result = StripeService.createCheckoutSession(
          requestData.eventId,
          requestData.customerData
        );
        break;
        
      case 'confirmBooking':
        // Validate payment and create booking
        if (!requestData.sessionId) {
          return createResponse({ success: false, error: 'Session ID required' }, 400);
        }
        result = BookingService.confirmBooking(requestData.sessionId);
        break;
        
      case 'validateBooking':
        // Pre-validate before showing payment
        if (!requestData.eventId) {
          return createResponse({ success: false, error: 'Event ID required' }, 400);
        }
        const numSeats = requestData.numSeats || 1;
        result = BookingService.validateBooking(
          requestData.eventId,
          numSeats
        );
        break;
        
      default:
        return createResponse({ success: false, error: 'Invalid action: ' + action }, 400);
    }
    
    return createResponse({ success: true, data: result });
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({ success: false, error: error.toString() }, 500);
  }
}

/**
 * Create standardized response with proper headers
 */
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

