/**
 * Workshop Admin Dashboard
 * Manages booking data display, filtering, and CSV export
 */

class WorkshopAdmin {
  constructor() {
    this.bookings = [];
    this.filteredBookings = [];
    this.events = {};
    this.workshops = {};
    this.init();
  }
  
  /**
   * Initialize dashboard
   */
  async init() {
    console.log('🔧 Initializing admin dashboard...');
    
    try {
      // Load all data
      await this.loadData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Display data
      this.displayStats();
      this.displayBookings();
      
      console.log('✅ Admin dashboard initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize dashboard:', error);
      this.showError(error.message);
    }
  }
  
  /**
   * Load all data from API
   */
  async loadData() {
    try {
      // Note: In production, you'd want to add authentication here
      // and fetch bookings via a secure admin endpoint
      
      // For now, we'll load via the sheets API
      // This should be protected with authentication in production
      const [bookings, events, workshops] = await Promise.all([
        this.fetchBookings(),
        sheetsAPI.getAllEvents(),
        sheetsAPI.getWorkshops()
      ]);
      
      this.bookings = bookings;
      this.filteredBookings = bookings;
      
      // Create lookup maps
      events.forEach(event => {
        this.events[event.eventId] = event;
      });
      
      workshops.forEach(workshop => {
        this.workshops[workshop.workshopId] = workshop;
      });
      
      console.log(`📊 Loaded ${bookings.length} bookings`);
      
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      throw error;
    }
  }
  
  /**
   * Fetch bookings from API
   * Note: In production, this should be a protected admin-only endpoint
   */
  async fetchBookings() {
    // This is a placeholder - you would implement an admin endpoint in Apps Script
    // For now, we'll return empty array as we can't directly access bookings sheet
    // You would need to add a getBookings endpoint to your Apps Script with authentication
    
    try {
      // Placeholder for admin endpoint
      // const response = await sheetsAPI.get('getBookings');
      // return response;
      
      // For demo purposes, return empty array
      // In production, uncomment above and implement secure getBookings endpoint
      return [];
      
    } catch (error) {
      console.error('❌ Failed to fetch bookings:', error);
      return [];
    }
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => this.filterBookings());
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', () => this.filterBookings());
  }
  
  /**
   * Display statistics
   */
  displayStats() {
    const confirmedBookings = this.bookings.filter(b => b.status === 'Confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);
    const totalSeats = confirmedBookings.reduce((sum, b) => sum + parseInt(b.numSeats || 0), 0);
    const activeEvents = Object.values(this.events).filter(e => e.status === 'Active').length;
    
    document.getElementById('statTotalBookings').textContent = confirmedBookings.length;
    document.getElementById('statTotalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('statActiveWorkshops').textContent = activeEvents;
    document.getElementById('statSeatsBooked').textContent = totalSeats;
  }
  
  /**
   * Display bookings table
   */
  displayBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    const loadingState = document.getElementById('loadingState');
    const tableContainer = document.getElementById('tableContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Hide loading
    loadingState.style.display = 'none';
    
    if (this.filteredBookings.length === 0) {
      // Show empty state
      tableContainer.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    
    // Show table
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedBookings = [...this.filteredBookings].sort((a, b) => {
      return new Date(b.bookingTimestamp) - new Date(a.bookingTimestamp);
    });
    
    // Create rows
    sortedBookings.forEach(booking => {
      const row = this.createBookingRow(booking);
      tbody.appendChild(row);
    });
  }
  
  /**
   * Create table row for booking
   */
  createBookingRow(booking) {
    const row = document.createElement('tr');
    
    const event = this.events[booking.eventId] || {};
    const workshop = this.workshops[event.workshopId] || {};
    
    row.innerHTML = `
      <td><strong>${booking.bookingId}</strong></td>
      <td>${this.formatDate(booking.bookingTimestamp)}</td>
      <td>${booking.customerName}</td>
      <td><a href="mailto:${booking.email}">${booking.email}</a></td>
      <td>${workshop.name || booking.eventId}</td>
      <td>${booking.numSeats}</td>
      <td>$${parseFloat(booking.totalAmount).toFixed(2)}</td>
      <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
      <td>${booking.newsletterOptIn === 'Yes' ? '✓' : '—'}</td>
    `;
    
    return row;
  }
  
  /**
   * Filter bookings based on search and status
   */
  filterBookings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    this.filteredBookings = this.bookings.filter(booking => {
      // Search filter
      const matchesSearch = !searchTerm || 
        booking.bookingId.toLowerCase().includes(searchTerm) ||
        booking.customerName.toLowerCase().includes(searchTerm) ||
        booking.email.toLowerCase().includes(searchTerm);
      
      // Status filter
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    this.displayBookings();
  }
  
  /**
   * Export bookings to CSV
   */
  exportCSV() {
    if (this.bookings.length === 0) {
      alert('No bookings to export');
      return;
    }
    
    console.log('📥 Exporting bookings to CSV...');
    
    // CSV headers
    const headers = [
      'Booking ID',
      'Event ID',
      'Customer Name',
      'Email',
      'Phone',
      'Organization',
      'Designation',
      'Seats',
      'Amount (NZD)',
      'Payment ID',
      'Payment Status',
      'Newsletter',
      'Promo',
      'Booking Date',
      'Status'
    ];
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    
    this.bookings.forEach(booking => {
      const row = [
        booking.bookingId,
        booking.eventId,
        this.escapeCSV(booking.customerName),
        this.escapeCSV(booking.email),
        this.escapeCSV(booking.phone),
        this.escapeCSV(booking.organization),
        this.escapeCSV(booking.designation),
        booking.numSeats,
        booking.totalAmount,
        booking.stripePaymentId,
        booking.paymentStatus,
        booking.newsletterOptIn,
        booking.promoOptIn,
        this.formatDate(booking.bookingTimestamp),
        booking.status
      ];
      
      csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `workshop-bookings-${this.formatDateForFilename(new Date())}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ CSV exported successfully');
  }
  
  /**
   * Escape CSV field
   */
  escapeCSV(field) {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }
  
  /**
   * Refresh data
   */
  async refresh() {
    console.log('🔄 Refreshing dashboard...');
    
    try {
      document.getElementById('loadingState').style.display = 'block';
      document.getElementById('tableContainer').style.display = 'none';
      
      await this.loadData();
      this.displayStats();
      this.displayBookings();
      
      console.log('✅ Dashboard refreshed');
      
    } catch (error) {
      console.error('❌ Failed to refresh:', error);
      alert('Failed to refresh data: ' + error.message);
    }
  }
  
  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  /**
   * Format date for filename
   */
  formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Show error message
   */
  showError(message) {
    document.getElementById('loadingState').innerHTML = `
      <div style="text-align: center; color: #c62828;">
        <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 20px;"></i>
        <h3>Error Loading Dashboard</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.workshopAdmin = new WorkshopAdmin();
  });
} else {
  window.workshopAdmin = new WorkshopAdmin();
}

