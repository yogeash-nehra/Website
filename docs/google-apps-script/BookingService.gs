/**
 * Booking Service - Handles booking creation and seat management
 */

const BookingService = {
  
  /**
   * Submit direct booking (without payment - for inquiry/registration)
   * Automatically calculates price and populates all fields
   */
  submitDirectBooking: function(formData) {
    const eventId = formData.eventId || formData.workshopId;
    const participants = parseInt(formData.participants) || 1;
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      throw new Error('Name and email are required');
    }
    
    // Get event and workshop details to calculate price
    let eventDetails = null;
    let totalAmount = 0;
    
    if (eventId) {
      try {
        eventDetails = WorkshopService.getEventDetails(eventId);
        
        // Check availability
        if (!eventDetails.isAvailable) {
          throw new Error('This event is no longer available');
        }
        if (eventDetails.availableSeats < participants) {
          throw new Error(`Not enough seats available. Only ${eventDetails.availableSeats} seats remaining.`);
        }
        
        // Calculate total amount (price per seat × number of participants)
        const pricePerSeat = eventDetails.price || 0;
        totalAmount = pricePerSeat * participants;
        
      } catch (error) {
        Logger.log('Event check failed: ' + error.toString());
        throw error; // Re-throw to show user the error
      }
    }
    
    // Generate booking ID
    const bookingId = this.generateBookingId();
    const timestamp = new Date();
    
    // Prepare booking data with ALL fields automatically populated
    const bookingData = {
      bookingId: bookingId,
      eventId: eventId || '',
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      organization: formData.organization || '',
      designation: formData.designation || '',
      participants: participants,
      totalAmount: totalAmount, // Auto-calculated from workshop price
      stripePayment: '', // Will be filled when payment is processed
      paymentStatus: totalAmount > 0 ? 'Pending' : 'Not Required', // Auto-set based on price
      newsletterOptIn: formData.newsletterOptIn || 'No',
      promoOptIn: formData.promoOptIn || 'No',
      bookingTimestamp: timestamp,
      status: 'Pending' // Will be updated to Confirmed after payment
    };
    
    // Save booking using lock to prevent concurrency issues
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000);
      
      // Save to Bookings sheet
      this.saveDirectBooking(bookingData);
      
      // DON'T decrement seats yet - wait until payment is confirmed
      // Seats will be decremented in confirmBooking()
      
      lock.releaseLock();
      
    } catch (e) {
      if (lock) lock.releaseLock();
      throw new Error('Failed to save booking: ' + e.toString());
    }
    
    return {
      success: true,
      bookingId: bookingId,
      totalAmount: totalAmount,
      requiresPayment: totalAmount > 0,
      message: totalAmount > 0 
        ? `Booking created. Total: $${totalAmount.toFixed(2)} NZD. Please proceed to payment.`
        : 'Booking request submitted successfully. We will contact you shortly.'
    };
  },
  
  /**
   * Save direct booking to sheet
   * Matches your exact column structure from the screenshot
   */
  saveDirectBooking: function(bookingData) {
    const config = getConfiguration();
    const sheet = getSheet(config.BOOKINGS_SHEET);
    
    // Your sheet already has headers, so we just append the data
    // Column structure from your sheet:
    // A: Booking ID
    // B: Event ID
    // C: Customer Name
    // D: Email
    // E: Phone
    // F: Organisation
    // G: Designation
    // H: Number of Seats
    // I: Total Amount (NZD)
    // J: Stripe Payment
    // K: Payment Status
    // L: Newsletter Opt-in
    // M: Promo Opt-in
    // N: Booking Timestamp
    // O: Status
    
    const row = [
      bookingData.bookingId,                    // A: Booking ID
      bookingData.eventId || '',                // B: Event ID
      bookingData.customerName,                 // C: Customer Name
      bookingData.email,                        // D: Email
      bookingData.phone,                        // E: Phone
      bookingData.organization || '',           // F: Organisation
      bookingData.designation || '',            // G: Designation
      bookingData.participants,                 // H: Number of Seats
      bookingData.totalAmount || 0,             // I: Total Amount (NZD)
      bookingData.stripePayment || '',          // J: Stripe Payment
      bookingData.paymentStatus || 'Pending',   // K: Payment Status
      bookingData.newsletterOptIn || 'No',      // L: Newsletter Opt-in
      bookingData.promoOptIn || 'No',           // M: Promo Opt-in
      bookingData.bookingTimestamp,             // N: Booking Timestamp
      bookingData.status || 'Pending'           // O: Status
    ];
    
    sheet.appendRow(row);
  },
  
  /**
   * Validate booking before payment
   */
  validateBooking: function(eventId, numSeats = 1) {
    const availability = WorkshopService.checkAvailability(eventId);
    
    if (!availability.isAvailable) {
      throw new Error('Event is no longer available');
    }
    
    if (availability.availableSeats < numSeats) {
      throw new Error('Not enough seats available. Only ' + availability.availableSeats + ' seats remaining.');
    }
    
    return {
      valid: true,
      availableSeats: availability.availableSeats
    };
  },
  
  /**
   * Confirm booking after successful Stripe payment
   * Updates all payment fields automatically
   */
  confirmBooking: function(sessionId) {
    // Verify payment with Stripe
    const paymentData = StripeService.verifyPayment(sessionId);
    
    if (!paymentData.paid) {
      throw new Error('Payment not completed');
    }
    
    // Extract booking data from payment metadata
    const metadata = paymentData.metadata;
    const eventId = metadata.eventId;
    const numSeats = parseInt(metadata.numSeats) || 1;
    
    // Validate availability again (in case of concurrent bookings)
    this.validateBooking(eventId, numSeats);
    
    // Generate booking ID
    const bookingId = this.generateBookingId();
    const timestamp = new Date();
    
    // Get event details for price calculation
    const eventDetails = WorkshopService.getEventDetails(eventId);
    const totalAmount = (eventDetails.price || 0) * numSeats;
    
    // Prepare complete booking data with payment info
    const bookingData = {
      bookingId: bookingId,
      eventId: eventId,
      customerName: metadata.customerName,
      email: metadata.email,
      phone: metadata.phone,
      organization: metadata.organization || '',
      designation: metadata.designation || '',
      participants: numSeats,
      totalAmount: totalAmount,
      stripePayment: paymentData.id, // Stripe Payment Intent ID
      paymentStatus: 'Completed', // Payment successful
      newsletterOptIn: metadata.newsletterOptIn === 'true' ? 'Yes' : 'No',
      promoOptIn: metadata.promoOptIn === 'true' ? 'Yes' : 'No',
      bookingTimestamp: timestamp,
      status: 'Confirmed' // Auto-confirmed after payment
    };
    
    // Use lock to prevent concurrent modifications
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000);
      
      // Save booking
      this.saveDirectBooking(bookingData);
      
      // NOW decrement seats (only after confirmed payment)
      this.decrementSeats(eventId, numSeats);
      
      lock.releaseLock();
      
    } catch (e) {
      if (lock) lock.releaseLock();
      throw new Error('Failed to complete booking: ' + e.toString());
    }
    
    // Send confirmation emails
    try {
      // Uncomment when MailService is set up
      // MailService.sendBookingConfirmation(bookingData, eventDetails);
      // MailService.sendAdminNotification(bookingData, eventDetails);
    } catch (e) {
      Logger.log('Email sending failed: ' + e.toString());
      // Don't throw error - booking is already saved
    }
    
    return bookingData;
  },
  
  /**
   * Decrement available seats for event
   */
  decrementSeats: function(eventId, numSeats) {
    const config = getConfiguration();
    const sheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === eventId) {
        const currentSeats = parseInt(data[i][4]) || 0;
        const newSeats = currentSeats - numSeats;
        
        if (newSeats < 0) {
          throw new Error('Cannot decrement seats below zero');
        }
        
        // Update available seats (column E, index 4)
        sheet.getRange(i + 1, 5).setValue(newSeats);
        
        // Update status if sold out (column F, index 5)
        if (newSeats === 0) {
          sheet.getRange(i + 1, 6).setValue('Full');
        }
        
        Logger.log(`Decremented seats for ${eventId}: ${currentSeats} → ${newSeats}`);
        return newSeats;
      }
    }
    
    throw new Error('Event not found: ' + eventId);
  },
  
  /**
   * Generate unique booking ID
   */
  generateBookingId: function() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return 'BK-' + timestamp + '-' + random;
  },
  
  /**
   * Get all bookings
   */
  getAllBookings: function() {
    const config = getConfiguration();
    const sheet = getSheet(config.BOOKINGS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const bookings = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      bookings.push({
        bookingId: row[0],
        eventId: row[1],
        customerName: row[2],
        email: row[3],
        phone: row[4],
        organization: row[5],
        designation: row[6],
        numSeats: row[7],
        totalAmount: row[8],
        stripePaymentId: row[9],
        paymentStatus: row[10],
        newsletterOptIn: row[11],
        promoOptIn: row[12],
        bookingTimestamp: row[13],
        status: row[14]
      });
    }
    
    return bookings;
  }
};

