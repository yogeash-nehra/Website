/**
 * Main entry point for POST requests
 * FIXED VERSION - Handles both JSON and form-encoded data
 */
function doPost(e) {
  try {
    let requestData;
    
    // Check content type and parse accordingly
    if (e.postData.type === 'application/json') {
      // JSON request (from fetch API)
      requestData = JSON.parse(e.postData.contents);
    } else {
      // Form-encoded request (from HTML form or other)
      // Parse parameters from e.parameter object
      requestData = e.parameter;
    }
    
    const action = requestData.action;
    
    if (!action) {
      return createResponse({ success: false, error: 'Action parameter required' });
    }
    
    let result;
    
    switch(action) {
      case 'createCheckoutSession':
        // Validate required fields
        if (!requestData.eventId || !requestData.customerData) {
          return createResponse({ success: false, error: 'Missing required fields' });
        }
        result = StripeService.createCheckoutSession(
          requestData.eventId,
          requestData.customerData
        );
        break;
        
      case 'confirmBooking':
        // Validate payment and create booking
        if (!requestData.sessionId) {
          return createResponse({ success: false, error: 'Session ID required' });
        }
        result = BookingService.confirmBooking(requestData.sessionId);
        break;
        
      case 'validateBooking':
        // Pre-validate before showing payment
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
 * Create standardized response
 */
function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

