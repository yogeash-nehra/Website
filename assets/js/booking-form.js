/**
 * Booking Form Handler
 * Manages multi-step booking form with validation and API integration
 */

class BookingForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = {
      eventId: null,
      eventDetails: null,
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      designation: '',
      newsletterOptIn: false,
      promoOptIn: false,
      numSeats: 1
    };
    
    this.init();
  }
  
  /**
   * Initialize form
   */
  init() {
    console.log('📝 Initializing booking form...');
    
    // Load workshops and events
    this.loadWorkshops();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Check for pre-selected event from URL
    this.checkURLParams();
  }
  
  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Step navigation buttons
    document.getElementById('step1Next').addEventListener('click', () => this.validateAndNext(1));
    document.getElementById('step2Next').addEventListener('click', () => this.validateAndNext(2));
    document.getElementById('step2Back').addEventListener('click', () => this.goToStep(1));
    document.getElementById('step3Next').addEventListener('click', () => this.validateAndNext(3));
    document.getElementById('step3Back').addEventListener('click', () => this.goToStep(2));
    document.getElementById('step4Next').addEventListener('click', () => this.validateAndNext(4));
    document.getElementById('step4Back').addEventListener('click', () => this.goToStep(3));
    document.getElementById('step5Back').addEventListener('click', () => this.goToStep(4));
    document.getElementById('proceedToPayment').addEventListener('click', () => this.proceedToPayment());
    
    // Event selection change
    document.getElementById('eventSelect').addEventListener('change', (e) => this.onEventSelect(e.target.value));
    
    // Real-time validation
    document.getElementById('email').addEventListener('blur', (e) => this.validateEmail(e.target));
    document.getElementById('phone').addEventListener('blur', (e) => this.validatePhone(e.target));
    document.getElementById('fullName').addEventListener('input', (e) => this.validateRequired(e.target));
  }
  
  /**
   * Check URL parameters for pre-selected event or workshop
   */
  checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    const workshopId = urlParams.get('workshop');
    
    if (eventId) {
      console.log('📌 Pre-selected event from URL:', eventId);
      this.preSelectedEventId = eventId;
    } else if (workshopId) {
      console.log('📌 Pre-selected workshop from URL:', workshopId);
      this.preSelectedWorkshopId = workshopId;
    }
  }
  
  /**
   * Load workshops and events from API
   */
  async loadWorkshops() {
    try {
      console.log('🔄 Loading workshops...');
      
      // Get all events
      const events = await sheetsAPI.getAllEvents();
      
      if (!events || events.length === 0) {
        throw new Error('No workshops available at this time');
      }
      
      // Get all workshops for additional details
      const workshops = await sheetsAPI.getWorkshops();
      
      // Create lookup map
      const workshopMap = {};
      workshops.forEach(w => {
        workshopMap[w.workshopId] = w;
      });
      
      // Populate event dropdown
      this.populateEventDropdown(events, workshopMap);
      
      // Hide loading, show selection
      document.getElementById('workshopLoadingState').style.display = 'none';
      document.getElementById('workshopSelection').style.display = 'block';
      
      // Select pre-selected event if exists
      if (this.preSelectedEventId) {
        document.getElementById('eventSelect').value = this.preSelectedEventId;
        this.onEventSelect(this.preSelectedEventId);
      }
      
      console.log('✅ Workshops loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load workshops:', error);
      document.getElementById('workshopLoadingState').style.display = 'none';
      document.getElementById('workshopErrorState').style.display = 'block';
      document.getElementById('workshopErrorMessage').textContent = error.message;
    }
  }
  
  /**
   * Populate event dropdown with options
   */
  populateEventDropdown(events, workshopMap) {
    const select = document.getElementById('eventSelect');
    
    // Sort events by date
    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    
    // If there's a pre-selected workshop, filter events first
    let filteredEvents = events;
    if (this.preSelectedWorkshopId) {
      const workshopEvents = events.filter(e => e.workshopId === this.preSelectedWorkshopId);
      
      // Add optgroup for selected workshop
      if (workshopEvents.length > 0) {
        const selectedWorkshop = workshopMap[this.preSelectedWorkshopId];
        const optgroup = document.createElement('optgroup');
        optgroup.label = `${selectedWorkshop.name} (Recommended)`;
        
        workshopEvents.forEach(event => {
          const option = this.createEventOption(event, workshopMap[event.workshopId]);
          optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
      }
      
      // Add separator
      const separator = document.createElement('option');
      separator.disabled = true;
      separator.textContent = '───────────────────────';
      select.appendChild(separator);
      
      // Add "Browse All Workshops" section
      const allGroup = document.createElement('optgroup');
      allGroup.label = 'Browse All Other Workshops';
      
      events.forEach(event => {
        if (event.workshopId !== this.preSelectedWorkshopId) {
          const option = this.createEventOption(event, workshopMap[event.workshopId]);
          allGroup.appendChild(option);
        }
      });
      
      select.appendChild(allGroup);
      
    } else {
      // No pre-selection, group by workshop type
      const groupedEvents = {};
      
      events.forEach(event => {
        if (!groupedEvents[event.workshopId]) {
          groupedEvents[event.workshopId] = [];
        }
        groupedEvents[event.workshopId].push(event);
      });
      
      // Create optgroups for each workshop
      Object.keys(groupedEvents).forEach(workshopId => {
        const workshop = workshopMap[workshopId];
        if (!workshop) return;
        
        const optgroup = document.createElement('optgroup');
        optgroup.label = workshop.name;
        
        groupedEvents[workshopId].forEach(event => {
          const option = this.createEventOption(event, workshop);
          optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
      });
    }
  }
  
  /**
   * Create an option element for an event
   */
  createEventOption(event, workshop) {
    const option = document.createElement('option');
    option.value = event.eventId;
    option.textContent = `${this.formatDate(event.eventDate)} at ${event.eventTime}`;
    option.dataset.available = event.availableSeats;
    option.dataset.status = event.status;
    option.dataset.workshopId = event.workshopId;
    
    // Add availability info
    if (event.availableSeats <= 0 || event.status !== 'Active') {
      option.disabled = true;
      option.textContent += ' (Sold Out)';
    } else if (event.availableSeats <= 5) {
      option.textContent += ` (${event.availableSeats} seats left)`;
    }
    
    return option;
  }
  
  /**
   * Handle event selection
   */
  async onEventSelect(eventId) {
    if (!eventId) {
      document.getElementById('selectedEventDetails').style.display = 'none';
      document.getElementById('step1Next').disabled = true;
      return;
    }
    
    try {
      // Check availability
      const availability = await sheetsAPI.checkAvailability(eventId);
      
      if (!availability.isAvailable) {
        alert('Sorry, this event is no longer available. Please select another.');
        document.getElementById('eventSelect').value = '';
        return;
      }
      
      // Get full event details
      const events = await sheetsAPI.getAllEvents();
      const event = events.find(e => e.eventId === eventId);
      
      if (!event) {
        throw new Error('Event details not found');
      }
      
      // Get workshop details
      const workshops = await sheetsAPI.getWorkshops();
      const workshop = workshops.find(w => w.workshopId === event.workshopId);
      
      if (!workshop) {
        throw new Error('Workshop details not found');
      }
      
      // Store in form data
      this.formData.eventId = eventId;
      this.formData.eventDetails = {
        ...event,
        workshop: workshop,
        availability: availability
      };
      
      // Display event details
      this.displayEventDetails(this.formData.eventDetails);
      
      // Enable next button
      document.getElementById('step1Next').disabled = false;
      
    } catch (error) {
      console.error('❌ Error loading event details:', error);
      alert('Failed to load event details. Please try again.');
    }
  }
  
  /**
   * Display selected event details
   */
  displayEventDetails(details) {
    const container = document.getElementById('selectedEventDetails');
    const { workshop, eventDate, eventTime, venueDetails, availability } = details;
    
    const html = `
      <div class="workshop-card selected visible">
        <div class="workshop-card-header">
          <div class="workshop-name">${workshop.name}</div>
          <div class="workshop-price">$${workshop.price} NZD</div>
        </div>
        <div class="workshop-description">${workshop.description}</div>
        <div class="workshop-details">
          <div class="workshop-detail">
            <i class="fas fa-calendar"></i>
            <span>${this.formatDate(eventDate)}</span>
          </div>
          <div class="workshop-detail">
            <i class="fas fa-clock"></i>
            <span>${eventTime}</span>
          </div>
          <div class="workshop-detail">
            <i class="fas fa-map-marker-alt"></i>
            <span>${venueDetails}</span>
          </div>
          <div class="workshop-detail">
            <i class="fas fa-hourglass"></i>
            <span>${workshop.duration}</span>
          </div>
        </div>
        <div class="availability-badges">
          <span class="badge badge-success">
            <i class="fas fa-check-circle"></i> ${availability.availableSeats} seats available
          </span>
          ${availability.isNearlyFull ? '<span class="badge badge-warning">Nearly Full!</span>' : ''}
          ${availability.isClosingSoon ? '<span class="badge badge-info">Closing Soon</span>' : ''}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    container.style.display = 'block';
  }
  
  /**
   * Validate step and move to next
   */
  validateAndNext(step) {
    let valid = true;
    
    switch(step) {
      case 1:
        // Workshop selection is already validated
        valid = this.formData.eventId !== null;
        break;
        
      case 2:
        // Validate personal details
        valid = this.validatePersonalDetails();
        break;
        
      case 3:
        // Professional details are optional
        this.formData.organization = document.getElementById('organization').value.trim();
        this.formData.designation = document.getElementById('designation').value.trim();
        valid = true;
        break;
        
      case 4:
        // Save preferences
        this.formData.newsletterOptIn = document.getElementById('newsletterOptIn').checked;
        this.formData.promoOptIn = document.getElementById('promoOptIn').checked;
        valid = true;
        // Show review before moving to step 5
        this.populateReview();
        break;
    }
    
    if (valid) {
      this.goToStep(step + 1);
    }
  }
  
  /**
   * Validate personal details
   */
  validatePersonalDetails() {
    let valid = true;
    
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    // Validate name
    if (!this.validateRequired(fullName)) {
      valid = false;
    }
    
    // Validate email
    if (!this.validateEmail(email)) {
      valid = false;
    }
    
    // Validate phone
    if (!this.validatePhone(phone)) {
      valid = false;
    }
    
    if (valid) {
      this.formData.fullName = fullName.value.trim();
      this.formData.email = email.value.trim();
      this.formData.phone = phone.value.trim();
    }
    
    return valid;
  }
  
  /**
   * Validate required field
   */
  validateRequired(input) {
    const value = input.value.trim();
    
    if (!value) {
      input.classList.add('error');
      return false;
    }
    
    input.classList.remove('error');
    return true;
  }
  
  /**
   * Validate email
   */
  validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value || !emailRegex.test(value)) {
      input.classList.add('error');
      return false;
    }
    
    input.classList.remove('error');
    return true;
  }
  
  /**
   * Validate phone
   */
  validatePhone(input) {
    const value = input.value.trim();
    
    if (!value) {
      input.classList.add('error');
      return false;
    }
    
    input.classList.remove('error');
    return true;
  }
  
  /**
   * Go to specific step
   */
  goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    targetStep.classList.add('active');
    
    // Update progress indicators
    this.updateProgress(stepNumber);
    
    // Update current step
    this.currentStep = stepNumber;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Update progress indicators
   */
  updateProgress(currentStep) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNum = index + 1;
      
      step.classList.remove('active', 'completed');
      
      if (stepNum < currentStep) {
        step.classList.add('completed');
      } else if (stepNum === currentStep) {
        step.classList.add('active');
      }
    });
  }
  
  /**
   * Populate review section
   */
  populateReview() {
    const { eventDetails, fullName, email, phone, organization } = this.formData;
    const { workshop, eventDate, eventTime, venueDetails } = eventDetails;
    
    document.getElementById('reviewWorkshop').textContent = workshop.name;
    document.getElementById('reviewDate').textContent = this.formatDate(eventDate);
    document.getElementById('reviewTime').textContent = eventTime;
    document.getElementById('reviewLocation').textContent = venueDetails;
    
    document.getElementById('reviewName').textContent = fullName;
    document.getElementById('reviewEmail').textContent = email;
    document.getElementById('reviewPhone').textContent = phone;
    
    if (organization) {
      document.getElementById('reviewOrganization').textContent = organization;
      document.getElementById('reviewOrgRow').style.display = 'flex';
    }
    
    document.getElementById('reviewTotal').textContent = `$${workshop.price.toFixed(2)} NZD`;
  }
  
  /**
   * Proceed to payment
   */
  async proceedToPayment() {
    const button = document.getElementById('proceedToPayment');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
      console.log('💳 Creating checkout session...');
      
      // Validate booking one more time
      await sheetsAPI.validateBooking(this.formData.eventId, this.formData.numSeats);
      
      // Create customer data
      const customerData = {
        name: this.formData.fullName,
        email: this.formData.email,
        phone: this.formData.phone,
        organization: this.formData.organization,
        designation: this.formData.designation,
        numSeats: this.formData.numSeats,
        newsletterOptIn: this.formData.newsletterOptIn,
        promoOptIn: this.formData.promoOptIn
      };
      
      // Create Stripe checkout session
      const session = await sheetsAPI.createCheckoutSession(
        this.formData.eventId,
        customerData
      );
      
      console.log('✅ Checkout session created:', session.sessionId);
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
      
    } catch (error) {
      console.error('❌ Payment error:', error);
      
      document.getElementById('paymentErrorMessage').textContent = error.message;
      document.getElementById('paymentErrorState').style.display = 'block';
      
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-lock"></i> Proceed to Secure Payment';
      
      // Scroll to error
      document.getElementById('paymentErrorState').scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * Format date for display
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Initialize booking form when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BookingForm();
  });
} else {
  new BookingForm();
}

