/**
 * Stripe Service - Handles Stripe payment integration
 */

const StripeService = {
  
  /**
   * Create Stripe Checkout Session
   */
  createCheckoutSession: function(eventId, customerData) {
    const config = getConfiguration();
    
    // Get event and workshop details
    const eventDetails = WorkshopService.getEventDetails(eventId);
    
    if (!eventDetails.workshop) {
      throw new Error('Workshop details not found');
    }
    
    // Prepare line items
    const lineItems = [{
      price_data: {
        currency: config.CURRENCY,
        product_data: {
          name: eventDetails.workshop.name,
          description: eventDetails.workshop.description + ' - ' + eventDetails.eventDate + ' at ' + eventDetails.eventTime,
          metadata: {
            workshopId: eventDetails.workshopId,
            eventId: eventId
          }
        },
        unit_amount: Math.round(eventDetails.workshop.price * 100) // Convert to cents
      },
      quantity: customerData.numSeats || 1
    }];
    
    // Prepare metadata
    const metadata = {
      eventId: eventId,
      workshopId: eventDetails.workshopId,
      customerName: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      organization: customerData.organization || '',
      designation: customerData.designation || '',
      numSeats: customerData.numSeats || 1,
      newsletterOptIn: customerData.newsletterOptIn ? 'true' : 'false',
      promoOptIn: customerData.promoOptIn ? 'true' : 'false'
    };
    
    // Create checkout session
    const payload = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: config.SUCCESS_URL + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: config.CANCEL_URL + '?event=' + eventId,
      customer_email: customerData.email,
      metadata: metadata,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true
      }
    };
    
    const response = this.callStripeAPI('checkout/sessions', 'POST', payload);
    
    return {
      sessionId: response.id,
      url: response.url
    };
  },
  
  /**
   * Verify payment was successful
   */
  verifyPayment: function(sessionId) {
    const session = this.callStripeAPI('checkout/sessions/' + sessionId, 'GET');
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }
    
    // Get payment intent details
    const paymentIntent = this.callStripeAPI('payment_intents/' + session.payment_intent, 'GET');
    
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paid: paymentIntent.status === 'succeeded',
      metadata: session.metadata
    };
  },
  
  /**
   * Call Stripe API
   */
  callStripeAPI: function(endpoint, method, payload = null) {
    const config = getConfiguration();
    const url = 'https://api.stripe.com/v1/' + endpoint;
    
    const options = {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + config.STRIPE_SECRET_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      muteHttpExceptions: true
    };
    
    // Convert payload to form-urlencoded format for Stripe
    if (payload && method === 'POST') {
      options.payload = this.encodePayload(payload);
    }
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode !== 200) {
      Logger.log('Stripe API Error: ' + responseText);
      throw new Error('Stripe API error: ' + responseCode);
    }
    
    return JSON.parse(responseText);
  },
  
  /**
   * Encode payload for Stripe API (form-urlencoded)
   */
  encodePayload: function(obj, prefix = '') {
    const str = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const encodedKey = prefix ? prefix + '[' + key + ']' : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          // Recursive for nested objects
          str.push(this.encodePayload(value, encodedKey));
        } else if (Array.isArray(value)) {
          // Handle arrays
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              str.push(this.encodePayload(item, encodedKey + '[' + index + ']'));
            } else {
              str.push(encodeURIComponent(encodedKey + '[' + index + ']') + '=' + encodeURIComponent(item));
            }
          });
        } else {
          str.push(encodeURIComponent(encodedKey) + '=' + encodeURIComponent(value));
        }
      }
    }
    
    return str.join('&');
  }
};

