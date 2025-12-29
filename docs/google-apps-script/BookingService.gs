/**
 * Booking Service - Handles booking creation and seat management
 */

const BookingService = {
  
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
   * Confirm booking after successful payment
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
    
    // Create booking record
    const bookingId = this.generateBookingId();
    const timestamp = new Date();
    
    const bookingData = {
      bookingId: bookingId,
      eventId: eventId,
      customerName: metadata.customerName,
      email: metadata.email,
      phone: metadata.phone,
      organization: metadata.organization || '',
      designation: metadata.designation || '',
      numSeats: numSeats,
      totalAmount: paymentData.amount / 100, // Convert from cents
      stripePaymentId: paymentData.id,
      paymentStatus: 'Completed',
      newsletterOptIn: metadata.newsletterOptIn === 'true' ? 'Yes' : 'No',
      promoOptIn: metadata.promoOptIn === 'true' ? 'Yes' : 'No',
      bookingTimestamp: timestamp,
      status: 'Confirmed'
    };
    
    // Use lock to prevent concurrent modifications
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000); // Wait up to 30 seconds
      
      // Save booking
      this.saveBooking(bookingData);
      
      // Decrement seats
      this.decrementSeats(eventId, numSeats);
      
      lock.releaseLock();
      
    } catch (e) {
      if (lock) lock.releaseLock();
      throw new Error('Failed to complete booking: ' + e.toString());
    }
    
    // Send confirmation email
    try {
      const eventDetails = WorkshopService.getEventDetails(eventId);
      MailService.sendBookingConfirmation(bookingData, eventDetails);
      MailService.sendAdminNotification(bookingData, eventDetails);
    } catch (e) {
      Logger.log('Email sending failed: ' + e.toString());
      // Don't throw error - booking is already saved
    }
    
    return bookingData;
  },
  
  /**
   * Save booking to sheet
   */
  saveBooking: function(bookingData) {
    const config = getConfiguration();
    const sheet = getSheet(config.BOOKINGS_SHEET);
    
    const row = [
      bookingData.bookingId,
      bookingData.eventId,
      bookingData.customerName,
      bookingData.email,
      bookingData.phone,
      bookingData.organization,
      bookingData.designation,
      bookingData.numSeats,
      bookingData.totalAmount,
      bookingData.stripePaymentId,
      bookingData.paymentStatus,
      bookingData.newsletterOptIn,
      bookingData.promoOptIn,
      bookingData.bookingTimestamp,
      bookingData.status
    ];
    
    sheet.appendRow(row);
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
        const currentSeats = data[i][4];
        const newSeats = currentSeats - numSeats;
        
        if (newSeats < 0) {
          throw new Error('Cannot decrement seats below zero');
        }
        
        // Update available seats (column E, index 4)
        sheet.getRange(i + 1, 5).setValue(newSeats);
        
        // Update status if sold out
        if (newSeats === 0) {
          sheet.getRange(i + 1, 6).setValue('Sold Out');
        }
        
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

