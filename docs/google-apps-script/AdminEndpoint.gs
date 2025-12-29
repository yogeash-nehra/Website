/**
 * IMPORTANT: Add this to your Google Apps Script Code.gs file
 * 
 * This adds an admin endpoint to fetch all bookings
 * In production, you should add authentication to protect this endpoint
 */

/**
 * Get all bookings (ADMIN ONLY)
 * TODO: Add authentication before deploying to production
 */
function getBookings() {
  // In production, verify admin authentication here
  // Example: verifyAdminToken(e.parameter.token)
  
  const config = getConfiguration();
  const sheet = getSheet(config.BOOKINGS_SHEET);
  const data = sheet.getDataRange().getValues();
  
  const bookings = [];
  
  // Skip header row
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

/**
 * Update doGet to include getBookings action
 * Add this case to the existing switch statement in doGet()
 */
/*
case 'getBookings':
  // TODO: Add authentication check
  result = getBookings();
  break;
*/

