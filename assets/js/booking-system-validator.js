/**
 * Website-Wide Booking System Configuration Checker
 * Run this script to verify all booking integrations are set up correctly
 */

class BookingSystemValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
  }
  
  async runAllChecks() {
    console.log('🔍 Starting Booking System Validation...\n');
    
    // Check 1: Config file
    await this.checkConfig();
    
    // Check 2: API connectivity
    await this.checkAPIConnection();
    
    // Check 3: Workshop data
    await this.checkWorkshopData();
    
    // Check 4: Events data
    await this.checkEventsData();
    
    // Check 5: Stripe configuration
    await this.checkStripeConfig();
    
    // Check 6: Page links
    await this.checkPageLinks();
    
    // Display results
    this.displayResults();
  }
  
  async checkConfig() {
    console.log('📋 Checking configuration file...');
    
    if (typeof CONFIG === 'undefined') {
      this.errors.push('CONFIG object not found. Is config.js loaded?');
      return;
    }
    
    // Check Apps Script URL
    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      this.errors.push('APPS_SCRIPT_URL not configured in config.js');
    } else if (!CONFIG.APPS_SCRIPT_URL.includes('/exec')) {
      this.warnings.push('APPS_SCRIPT_URL should end with /exec');
    } else {
      this.successes.push('✓ Apps Script URL configured');
    }
    
    // Check Stripe key
    if (!CONFIG.STRIPE_PUBLISHABLE_KEY || CONFIG.STRIPE_PUBLISHABLE_KEY === 'YOUR_STRIPE_PUBLISHABLE_KEY_HERE') {
      this.errors.push('STRIPE_PUBLISHABLE_KEY not configured in config.js');
    } else if (!CONFIG.STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
      this.errors.push('Invalid Stripe key format (should start with pk_test_ or pk_live_)');
    } else {
      this.successes.push('✓ Stripe Publishable Key configured');
    }
  }
  
  async checkAPIConnection() {
    console.log('🌐 Testing API connection...');
    
    try {
      const response = await fetch(CONFIG.APPS_SCRIPT_URL + '?action=getWorkshops');
      const data = await response.json();
      
      if (data.success && data.data) {
        this.successes.push(`✓ API connection successful (${data.data.length} workshops found)`);
      } else {
        this.errors.push('API returned but with errors: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      this.errors.push('Cannot connect to API: ' + error.message);
    }
  }
  
  async checkWorkshopData() {
    console.log('📚 Checking workshop data...');
    
    try {
      const workshops = await sheetsAPI.getWorkshops();
      
      if (!workshops || workshops.length === 0) {
        this.errors.push('No workshops found in database');
        return;
      }
      
      this.successes.push(`✓ Found ${workshops.length} workshops`);
      
      // Check for required fields
      const requiredFields = ['workshopId', 'name', 'price', 'status'];
      const missingFields = [];
      
      workshops.forEach((workshop, index) => {
        requiredFields.forEach(field => {
          if (!workshop[field] && workshop[field] !== 0) {
            missingFields.push(`Workshop ${index + 1} missing ${field}`);
          }
        });
      });
      
      if (missingFields.length > 0) {
        this.warnings.push('Some workshops have missing data: ' + missingFields.join(', '));
      }
      
    } catch (error) {
      this.errors.push('Error loading workshops: ' + error.message);
    }
  }
  
  async checkEventsData() {
    console.log('📅 Checking scheduled events...');
    
    try {
      const events = await sheetsAPI.getAllEvents();
      
      if (!events || events.length === 0) {
        this.warnings.push('No scheduled events found. Add events to "Scheduled Events" sheet');
        return;
      }
      
      this.successes.push(`✓ Found ${events.length} scheduled events`);
      
      // Check for past events
      const today = new Date();
      const futureEvents = events.filter(e => new Date(e.eventDate) >= today);
      const pastEvents = events.length - futureEvents.length;
      
      if (pastEvents > 0) {
        this.warnings.push(`${pastEvents} events are in the past. Consider archiving them.`);
      }
      
      // Check for sold out events
      const soldOut = events.filter(e => e.availableSeats <= 0);
      if (soldOut.length > 0) {
        this.successes.push(`${soldOut.length} events are sold out`);
      }
      
    } catch (error) {
      this.errors.push('Error loading events: ' + error.message);
    }
  }
  
  async checkStripeConfig() {
    console.log('💳 Checking Stripe configuration...');
    
    if (typeof Stripe === 'undefined') {
      this.errors.push('Stripe.js not loaded. Check if script tag is present.');
      return;
    }
    
    try {
      // Try to initialize Stripe
      const stripe = Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
      this.successes.push('✓ Stripe initialized successfully');
      
      if (CONFIG.STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
        this.warnings.push('⚠️  Using Stripe TEST mode (remember to switch to live keys for production)');
      } else if (CONFIG.STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) {
        this.successes.push('✓ Using Stripe LIVE mode');
      }
    } catch (error) {
      this.errors.push('Failed to initialize Stripe: ' + error.message);
    }
  }
  
  async checkPageLinks() {
    console.log('🔗 Checking booking links on page...');
    
    // Find all "Book Now" buttons
    const bookButtons = document.querySelectorAll('a[href*="booking.html"]');
    
    if (bookButtons.length === 0) {
      this.warnings.push('No booking links found on this page');
      return;
    }
    
    this.successes.push(`✓ Found ${bookButtons.length} booking buttons`);
    
    // Check link format
    let correctFormat = 0;
    let needsUpdate = 0;
    
    bookButtons.forEach(button => {
      const href = button.getAttribute('href');
      if (href.includes('?workshop=') || href.includes('?event=')) {
        correctFormat++;
      } else {
        needsUpdate++;
      }
    });
    
    if (needsUpdate > 0) {
      this.warnings.push(`${needsUpdate} booking buttons don't have workshop/event parameters`);
    }
  }
  
  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    if (this.successes.length > 0) {
      console.log('\n✅ PASSED CHECKS:');
      this.successes.forEach(msg => console.log('  ' + msg));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(msg => console.log('  ' + msg));
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS (Must Fix):');
      this.errors.forEach(msg => console.log('  ' + msg));
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0) {
      console.log('🎉 ALL CRITICAL CHECKS PASSED!');
      console.log('Your booking system is ready to use.');
    } else {
      console.log('⚠️  PLEASE FIX ERRORS ABOVE BEFORE GOING LIVE');
    }
    
    console.log('='.repeat(60) + '\n');
    
    // Return summary
    return {
      passed: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      successes: this.successes
    };
  }
}

// Auto-run validation when script is loaded
if (typeof window !== 'undefined') {
  window.bookingValidator = new BookingSystemValidator();
  
  // Add a global function to run validation
  window.validateBookingSystem = async function() {
    return await window.bookingValidator.runAllChecks();
  };
  
  console.log('💡 Booking system validator loaded. Run validateBookingSystem() to check your setup.');
}

