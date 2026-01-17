/**
 * Booking Form Handler
 * Manages multi-step booking form with event card selection and validation
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
    
    this.allEvents = [];
    this.allWorkshops = [];
    this.selectedEventId = null;
    
    this.init();
  }
  
  /**
   * Initialize form
   */
  init() {
    console.log('📝 Initializing enhanced booking form...');
    
    // Check for pre-selected event from URL first
    this.checkURLParams();
    
    // Load workshops and events
    this.loadWorkshops();
    
    // Setup event listeners
    this.setupEventListeners();
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
      console.log('🔄 Loading workshops and events...');
      
      // Get all events
      this.allEvents = await sheetsAPI.getAllEvents();
      
      if (!this.allEvents || this.allEvents.length === 0) {
        throw new Error('No workshops available at this time');
      }
      
      // Get all workshops for additional details
      this.allWorkshops = await sheetsAPI.getWorkshops();
      
      // Create lookup map
      this.workshopMap = {};
      this.allWorkshops.forEach(w => {
        this.workshopMap[w.workshopId] = w;
      });
      
      // Build the event cards UI
      this.buildEventCardsUI();
      
      // Hide loading, show selection
      document.getElementById('workshopLoadingState').style.display = 'none';
      document.getElementById('workshopSelection').style.display = 'block';
      
      console.log('✅ Workshops loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load workshops:', error);
      document.getElementById('workshopLoadingState').style.display = 'none';
      document.getElementById('workshopErrorState').style.display = 'block';
      document.getElementById('workshopErrorMessage').textContent = error.message;
    }
  }
  
  /**
   * Build event cards UI with smart grouping
   */
  buildEventCardsUI() {
    const container = document.getElementById('workshopEventsList');
    const preSelectedContainer = document.getElementById('preSelectedEvent');
    const preSelectedCard = document.getElementById('preSelectedEventCard');
    
    // Sort events by date
    this.allEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    
    // Handle pre-selected event (if user came from event button)
    if (this.preSelectedEventId) {
      const preSelectedEvent = this.allEvents.find(e => e.eventId === this.preSelectedEventId);
      
      if (preSelectedEvent) {
        const workshop = this.workshopMap[preSelectedEvent.workshopId];
        
        // Show pre-selected event card
        preSelectedCard.innerHTML = this.createEventCardHTML(preSelectedEvent, workshop, true);
        preSelectedContainer.style.display = 'block';
        
        // Auto-select this event
        this.selectEvent(this.preSelectedEventId);
        
        // Filter to show only other events from the same workshop
        const otherEventsInWorkshop = this.allEvents.filter(
          e => e.workshopId === preSelectedEvent.workshopId && e.eventId !== this.preSelectedEventId
        );
        
        if (otherEventsInWorkshop.length > 0) {
          // Group remaining events from same workshop
          const groupHTML = this.createWorkshopGroupHTML(
            workshop,
            otherEventsInWorkshop,
            'Other Available Dates'
          );
          container.innerHTML = groupHTML;
        } else {
          // Show message if no other dates available
          container.innerHTML = `
            <div class="alert alert-info">
              <i class="fas fa-info-circle"></i>
              <div>This is the only scheduled date for this workshop. Check out our other workshops below or contact us for custom scheduling.</div>
            </div>
          `;
        }
        
        // Add click handlers
        this.attachEventCardHandlers();
        return;
      }
    }
    
    // Handle pre-selected workshop (if user clicked "Book Now" on workshop card)
    if (this.preSelectedWorkshopId) {
      const workshopEvents = this.allEvents.filter(e => e.workshopId === this.preSelectedWorkshopId);
      const workshop = this.workshopMap[this.preSelectedWorkshopId];
      
      if (workshopEvents.length > 0) {
        // Show all events for selected workshop
        const groupHTML = this.createWorkshopGroupHTML(
          workshop,
          workshopEvents,
          'Choose Your Date'
        );
        container.innerHTML = groupHTML;
        
        // Add divider before other workshops
        container.innerHTML += `
          <div class="event-divider">
            <span>Or browse other workshops</span>
          </div>
        `;
        
        // Show other workshops
        const otherWorkshops = Object.keys(this.workshopMap)
          .filter(id => id !== this.preSelectedWorkshopId);
        
        otherWorkshops.forEach(workshopId => {
          const ws = this.workshopMap[workshopId];
          const events = this.allEvents.filter(e => e.workshopId === workshopId);
          
          if (events.length > 0) {
            container.innerHTML += this.createWorkshopGroupHTML(ws, events);
          }
        });
        
        // Add click handlers
        this.attachEventCardHandlers();
        return;
      }
    }
    
    // Default: Group all events by workshop
    const workshopGroups = {};
    
    this.allEvents.forEach(event => {
      if (!workshopGroups[event.workshopId]) {
        workshopGroups[event.workshopId] = [];
      }
      workshopGroups[event.workshopId].push(event);
    });
    
    // Build HTML for each workshop group
    let html = '';
    Object.keys(workshopGroups).forEach(workshopId => {
      const workshop = this.workshopMap[workshopId];
      const events = workshopGroups[workshopId];
      
      if (workshop && events.length > 0) {
        html += this.createWorkshopGroupHTML(workshop, events);
      }
    });
    
    if (html) {
      container.innerHTML = html;
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <h3>No Events Available</h3>
          <p>There are currently no scheduled events. Please check back later or contact us for custom programs.</p>
        </div>
      `;
    }
    
    // Add click handlers to all event cards
    this.attachEventCardHandlers();
  }
  
  /**
   * Create HTML for workshop group
   */
  createWorkshopGroupHTML(workshop, events, customTitle = null) {
    const eventsHTML = events.map(event => 
      this.createEventCardHTML(event, workshop)
    ).join('');
    
    return `
      <div class="workshop-group">
        <div class="workshop-group-header">
          <h3 class="workshop-group-title">${customTitle || workshop.name}</h3>
          <p class="workshop-group-subtitle">${workshop.format} • ${workshop.duration}</p>
        </div>
        <div class="workshop-group-events">
          ${eventsHTML}
        </div>
      </div>
    `;
  }
  
  /**
   * Create HTML for individual event card
   */
  createEventCardHTML(event, workshop, isPreSelected = false) {
    const availabilityLevel = event.availableSeats > 10 ? 'high' : 
                             event.availableSeats > 5 ? 'medium' : 'low';
    
    const cardClass = isPreSelected ? 'event-card selected-event' : 'event-card';
    const buttonText = isPreSelected ? 'Pre-Selected' : 'Select This Date';
    
    return `
      <div class="${cardClass}" data-event-id="${event.eventId}">
        <div class="event-card-header">
          <div class="event-name">${workshop.name}</div>
          <div class="event-date-badge">${this.formatShortDate(event.eventDate)}</div>
        </div>
        
        ${workshop.description ? `
          <div class="event-description">${workshop.description}</div>
        ` : ''}
        
        <div class="event-details">
          <div class="event-detail">
            <i class="fas fa-calendar"></i>
            <span>${this.formatFullDate(event.eventDate)}</span>
          </div>
          <div class="event-detail">
            <i class="fas fa-clock"></i>
            <span>${event.eventTime}</span>
          </div>
          <div class="event-detail">
            <i class="fas fa-map-marker-alt"></i>
            <span>${event.venueDetails || workshop.location}</span>
          </div>
        </div>
        
        <div class="event-meta">
          <div class="event-price">$${workshop.price} NZD</div>
          <div class="event-availability">
            <span class="availability-dot ${availabilityLevel}"></span>
            <span>${event.availableSeats} seats available</span>
          </div>
        </div>
        
        ${!isPreSelected ? `
          <button class="event-select-btn" style="display: none;">
            <i class="fas fa-check"></i> ${buttonText}
          </button>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Attach click handlers to event cards
   */
  attachEventCardHandlers() {
    const cards = document.querySelectorAll('.event-card:not(.selected-event)');
    
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const eventId = card.dataset.eventId;
        this.selectEvent(eventId);
      });
    });
  }
  
  /**
   * Select an event
   */
  async selectEvent(eventId) {
    try {
      // Remove selection from all cards
      document.querySelectorAll('.event-card').forEach(card => {
        card.classList.remove('selected');
      });
      
      // Add selection to clicked card
      const selectedCard = document.querySelector(`.event-card[data-event-id="${eventId}"]`);
      if (selectedCard && !selectedCard.classList.contains('selected-event')) {
        selectedCard.classList.add('selected');
      }
      
      // Check availability
      const availability = await sheetsAPI.checkAvailability(eventId);
      
      if (!availability.isAvailable) {
        alert('Sorry, this event is no longer available. Please select another.');
        selectedCard.classList.remove('selected');
        return;
      }
      
      // Get full event details
      const event = this.allEvents.find(e => e.eventId === eventId);
      const workshop = this.workshopMap[event.workshopId];
      
      // Store in form data
      this.formData.eventId = eventId;
      this.formData.eventDetails = {
        ...event,
        workshop: workshop,
        availability: availability
      };
      
      // Enable next button
      document.getElementById('step1Next').disabled = false;
      
      // Scroll to continue button
      document.getElementById('step1Next').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
      
      console.log('✅ Event selected:', eventId);
      
    } catch (error) {
      console.error('❌ Error selecting event:', error);
      alert('Failed to select event. Please try again.');
    }
  }
  
  /**
   * Validate step and move to next
   */
  validateAndNext(step) {
    let valid = true;
    
    switch(step) {
      case 1:
        // Event selection validation
        valid = this.formData.eventId !== null;
        if (!valid) {
          alert('Please select a workshop event to continue.');
        }
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
    document.getElementById('reviewDate').textContent = this.formatFullDate(eventDate);
    document.getElementById('reviewTime').textContent = eventTime;
    document.getElementById('reviewLocation').textContent = venueDetails || workshop.location;
    
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
   * Format date for badge (short)
   */
  formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'short'
    });
  }
  
  /**
   * Format date for full display
   */
  formatFullDate(dateString) {
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
