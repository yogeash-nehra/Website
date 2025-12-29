/**
 * Mail Service - Handles email notifications
 */

const MailService = {
  
  /**
   * Send booking confirmation to customer
   */
  sendBookingConfirmation: function(bookingData, eventDetails) {
    const config = getConfiguration();
    
    const subject = 'Booking Confirmation - ' + eventDetails.workshop.name;
    const htmlBody = this.getCustomerEmailTemplate(bookingData, eventDetails);
    
    try {
      GmailApp.sendEmail(
        bookingData.email,
        subject,
        '', // Plain text body (empty, using HTML)
        {
          htmlBody: htmlBody,
          name: config.BUSINESS_NAME
        }
      );
      
      Logger.log('Confirmation email sent to: ' + bookingData.email);
      return true;
      
    } catch (e) {
      Logger.log('Failed to send confirmation email: ' + e.toString());
      throw e;
    }
  },
  
  /**
   * Send notification to admin
   */
  sendAdminNotification: function(bookingData, eventDetails) {
    const config = getConfiguration();
    
    const subject = 'New Booking: ' + eventDetails.workshop.name + ' - ' + bookingData.customerName;
    const htmlBody = this.getAdminEmailTemplate(bookingData, eventDetails);
    
    try {
      GmailApp.sendEmail(
        config.ADMIN_EMAIL,
        subject,
        '', // Plain text body
        {
          htmlBody: htmlBody,
          name: config.BUSINESS_NAME + ' Booking System'
        }
      );
      
      Logger.log('Admin notification sent');
      return true;
      
    } catch (e) {
      Logger.log('Failed to send admin notification: ' + e.toString());
      // Don't throw - admin notification is not critical
      return false;
    }
  },
  
  /**
   * Customer email template
   */
  getCustomerEmailTemplate: function(bookingData, eventDetails) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #d8aa6a; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 30px; }
    .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #d8aa6a; }
    .detail-row { margin: 10px 0; }
    .label { font-weight: bold; color: #555; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #d8aa6a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed!</h1>
    </div>
    
    <div class="content">
      <p>Kia ora ${bookingData.customerName},</p>
      
      <p>Thank you for booking with Wolfgramm Holdings. Your registration has been confirmed!</p>
      
      <div class="booking-details">
        <h2 style="margin-top: 0; color: #d8aa6a;">Booking Details</h2>
        
        <div class="detail-row">
          <span class="label">Booking Reference:</span> ${bookingData.bookingId}
        </div>
        
        <div class="detail-row">
          <span class="label">Workshop:</span> ${eventDetails.workshop.name}
        </div>
        
        <div class="detail-row">
          <span class="label">Date:</span> ${eventDetails.eventDate}
        </div>
        
        <div class="detail-row">
          <span class="label">Time:</span> ${eventDetails.eventTime}
        </div>
        
        <div class="detail-row">
          <span class="label">Location:</span> ${eventDetails.venueDetails}
        </div>
        
        <div class="detail-row">
          <span class="label">Duration:</span> ${eventDetails.workshop.duration}
        </div>
        
        <div class="detail-row">
          <span class="label">Number of Seats:</span> ${bookingData.numSeats}
        </div>
        
        <div class="detail-row">
          <span class="label">Total Amount:</span> NZD $${bookingData.totalAmount.toFixed(2)}
        </div>
      </div>
      
      <h3>What's Next?</h3>
      <ul>
        <li>Save this email for your records</li>
        <li>We'll send you a reminder email 3 days before the workshop</li>
        <li>If you have any questions, reply to this email</li>
      </ul>
      
      <p><strong>Important Information:</strong></p>
      <p>${eventDetails.workshop.description}</p>
      
      <p style="margin-top: 30px;">We look forward to seeing you!</p>
      
      <p>Ngā mihi,<br>
      <strong>Wolfgramm Holdings Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Wolfgramm Holdings | Growing Better People</p>
      <p>Email: info@wgholdings.co.nz | Website: wgholdings.co.nz</p>
      <p>If you need to cancel or modify your booking, please contact us directly.</p>
    </div>
  </div>
</body>
</html>
    `;
  },
  
  /**
   * Admin email template
   */
  getAdminEmailTemplate: function(bookingData, eventDetails) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: white; padding: 20px; }
    .content { padding: 20px; }
    .booking-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border: 1px solid #ddd; }
    .detail-row { margin: 8px 0; }
    .label { font-weight: bold; display: inline-block; width: 150px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Workshop Booking</h2>
    </div>
    
    <div class="content">
      <p>A new booking has been confirmed:</p>
      
      <div class="booking-details">
        <h3>Customer Information</h3>
        <div class="detail-row">
          <span class="label">Name:</span> ${bookingData.customerName}
        </div>
        <div class="detail-row">
          <span class="label">Email:</span> ${bookingData.email}
        </div>
        <div class="detail-row">
          <span class="label">Phone:</span> ${bookingData.phone}
        </div>
        <div class="detail-row">
          <span class="label">Organization:</span> ${bookingData.organization}
        </div>
        <div class="detail-row">
          <span class="label">Designation:</span> ${bookingData.designation}
        </div>
      </div>
      
      <div class="booking-details">
        <h3>Workshop Information</h3>
        <div class="detail-row">
          <span class="label">Workshop:</span> ${eventDetails.workshop.name}
        </div>
        <div class="detail-row">
          <span class="label">Event Date:</span> ${eventDetails.eventDate}
        </div>
        <div class="detail-row">
          <span class="label">Event Time:</span> ${eventDetails.eventTime}
        </div>
        <div class="detail-row">
          <span class="label">Venue:</span> ${eventDetails.venueDetails}
        </div>
        <div class="detail-row">
          <span class="label">Seats Remaining:</span> ${eventDetails.availableSeats}
        </div>
      </div>
      
      <div class="booking-details">
        <h3>Payment Details</h3>
        <div class="detail-row">
          <span class="label">Booking ID:</span> ${bookingData.bookingId}
        </div>
        <div class="detail-row">
          <span class="label">Stripe Payment ID:</span> ${bookingData.stripePaymentId}
        </div>
        <div class="detail-row">
          <span class="label">Amount:</span> NZD $${bookingData.totalAmount.toFixed(2)}
        </div>
        <div class="detail-row">
          <span class="label">Seats Booked:</span> ${bookingData.numSeats}
        </div>
        <div class="detail-row">
          <span class="label">Status:</span> ${bookingData.status}
        </div>
      </div>
      
      <div class="booking-details">
        <h3>Marketing Preferences</h3>
        <div class="detail-row">
          <span class="label">Newsletter:</span> ${bookingData.newsletterOptIn}
        </div>
        <div class="detail-row">
          <span class="label">Promo Updates:</span> ${bookingData.promoOptIn}
        </div>
      </div>
      
      <p style="margin-top: 20px;">
        <small>This booking was automatically processed on ${bookingData.bookingTimestamp}</small>
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }
};

