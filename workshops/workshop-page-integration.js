/**
 * Workshop Page Integration
 * Connects existing Google Sheets API with enhanced caching and new booking modal
 * 
 * Data Flow:
 * 1. Workshop Catalog → Cached 7 days (static)
 * 2. Scheduled Events → Live data (dynamic availability)
 * 3. Combined view → Workshop details + live availability
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Workshop Page...');
    
    // Create enhanced cache manager
    const workshopCache = new WorkshopCacheEnhancer(sheetsAPI);
    
    try {
        // Load all workshop data
        const data = await workshopCache.init();
        
        console.log('📊 Workshop data loaded:', {
            workshops: data.workshops.length,
            events: data.events.length,
            catalogAge: Math.round(data.catalogAge / (1000 * 60 * 60)) + ' hours',
            eventsAge: Math.round(data.eventsAge / 1000) + ' seconds'
        });
        
        // Wait for workshops to be rendered (if dynamic renderer is active)
        // Then update availability indicators
        const waitForWorkshops = () => {
            return new Promise((resolve) => {
                // If workshops are already rendered, proceed immediately
                if (window.workshopRenderer && window.workshopRenderer.isRendered) {
                    resolve();
                    return;
                }
                
                // Otherwise wait for workshopsRendered event
                window.addEventListener('workshopsRendered', resolve, { once: true });
                
                // Fallback: if no dynamic renderer, wait 1 second then proceed
                setTimeout(resolve, 1000);
            });
        };
        
        await waitForWorkshops();
        
        // Update availability indicators on page
        updateWorkshopAvailability(data.workshops);
        
        // Update calendar events
        updateCalendarAvailability(data.events);
        
        // Make globally available
        window.workshopCache = workshopCache;
        window.workshopData = data;
        
        // Success - no toast needed (silent load for better UX)
        console.log('✅ Workshop data ready');
        
    } catch (error) {
        console.error('❌ Failed to load workshop data:', error);
        
        if (typeof showToast === 'function') {
            showToast('Failed to load workshop data. Using cached data if available.', 'error', 5000);
        }
    }
});

/**
 * Update workshop card availability indicators
 */
function updateWorkshopAvailability(workshops) {
    console.log('🎨 Updating workshop availability indicators...');
    
    workshops.forEach(workshop => {
        const card = document.getElementById(workshop.workshopId);
        if (!card) return;
        
        const availabilityDiv = card.querySelector('.wh-availability');
        if (!availabilityDiv) return;
        
        // Calculate availability status
        const status = calculateAvailabilityStatus(workshop);
        
        availabilityDiv.innerHTML = `
            <span class="wh-availability-dot ${status.color}"></span>
            <span>${status.label}</span>
        `;
        
        // Update booking button with live data
        const bookButton = card.querySelector('.wh-action.book');
        if (bookButton && workshop.allEvents && workshop.allEvents.length > 0) {
            // Update onclick to include event data
            bookButton.setAttribute('data-workshop-id', workshop.workshopId);
            bookButton.setAttribute('data-has-events', 'true');
        }
    });
    
    console.log('✅ Availability indicators updated');
}

/**
 * Calculate availability status from workshop data
 */
function calculateAvailabilityStatus(workshop) {
    const totalSeats = workshop.totalAvailableSeats || 0;
    const eventsCount = workshop.upcomingEventsCount || 0;
    
    // No upcoming events
    if (eventsCount === 0) {
        return {
            status: 'unavailable',
            label: 'No upcoming dates',
            color: 'medium'
        };
    }
    
    // Has events but no seats
    if (totalSeats === 0) {
        return {
            status: 'full',
            label: 'Fully booked',
            color: 'low'
        };
    }
    
    // Calculate percentage based on next event
    if (workshop.nextEvent && workshop.nextEvent.totalSeats) {
        const percentage = (workshop.nextEvent.availableSeats / workshop.nextEvent.totalSeats) * 100;
        
        if (percentage >= 50) {
            return {
                status: 'high',
                label: `${totalSeats} seat${totalSeats !== 1 ? 's' : ''} available`,
                color: 'high'
            };
        } else if (percentage >= 20) {
            return {
                status: 'medium',
                label: `${totalSeats} seat${totalSeats !== 1 ? 's' : ''} available`,
                color: 'medium'
            };
        } else {
            return {
                status: 'low',
                label: `Only ${totalSeats} seat${totalSeats !== 1 ? 's' : ''} left`,
                color: 'low'
            };
        }
    }
    
    // Default
    return {
        status: 'available',
        label: `${totalSeats} seat${totalSeats !== 1 ? 's' : ''} available`,
        color: 'high'
    };
}

/**
 * Update calendar event availability
 */
function updateCalendarAvailability(events) {
    console.log('📅 Updating calendar availability...');
    
    events.forEach(event => {
        // Find calendar row by event ID or construct selector from event data
        // Try multiple selectors since calendar might use different data attributes
        const eventRow = document.querySelector(`[data-event-id="${event.eventId}"]`) ||
                        document.querySelector(`button[onclick*="${event.eventId}"]`)?.closest('tr');
        
        if (!eventRow) return;
        
        // Update seats display
        const seatsCell = eventRow.querySelector('.cal-seats');
        if (seatsCell) {
            const available = event.availableSeats || 0;
            const total = event.totalSeats || 0;
            const percentage = total > 0 ? (available / total) * 100 : 0;
            
            let className = 'cal-seats';
            if (percentage < 20 && available > 0) {
                className += ' low';
            }
            
            seatsCell.className = className;
            
            if (available > 0) {
                seatsCell.textContent = `${available} available`;
            } else {
                seatsCell.textContent = 'Fully booked';
            }
        }
        
        // Disable booking button if no seats
        const bookButton = eventRow.querySelector('.cal-book-btn');
        if (bookButton && event.availableSeats === 0) {
            bookButton.disabled = true;
            bookButton.textContent = 'Sold Out';
            bookButton.style.opacity = '0.5';
            bookButton.style.cursor = 'not-allowed';
        }
    });
    
    console.log('✅ Calendar availability updated');
}

/**
 * Enhanced booking modal opener with live event selection
 * Redirects to booking page with workshop pre-selected
 */
async function openBookingModalWithEvents(workshopId) {
    try {
        // Get workshop with live events
        const workshop = await window.workshopCache.getWorkshopById(workshopId);
        
        if (!workshop) {
            showToast('Workshop not found', 'error');
            return;
        }
        
        // Check if there are available events
        const upcomingEvents = workshop.events.filter(e => 
            new Date(e.date) >= new Date() && e.availableSeats > 0
        );
        
        if (upcomingEvents.length === 0) {
            showToast('No available dates for this workshop. Please contact us for custom scheduling.', 'warning');
            // Optionally redirect to contact page after delay
            setTimeout(() => {
                window.location.href = '../contact?subject=Custom%20Workshop%20Inquiry%20-%20' + encodeURIComponent(workshop.name);
            }, 2000);
            return;
        }
        
        // Redirect to booking page with workshop pre-selected
        // This will show all dates for the workshop
        window.location.href = 'booking.html?workshop=' + encodeURIComponent(workshopId);
        
    } catch (error) {
        console.error('Error opening booking modal:', error);
        showToast('Failed to load workshop details', 'error');
    }
}

/**
 * Show event selection modal for workshops with multiple dates
 */
function showEventSelectionModal(workshop, events) {
    // Create or get event selection modal
    let modal = document.getElementById('eventSelectionModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eventSelectionModal';
        modal.className = 'booking-modal';
        document.body.appendChild(modal);
    }
    
    // Build events list with proper formatting
    let eventsHTML = events.map(event => {
        const available = event.availableSeats || 0;
        const total = event.totalSeats || 0;
        const seatClass = available < 5 ? 'low' : '';
        const dateFormatted = formatDate(event.date);
        
        return `
        <div class="event-option" onclick="selectEventAndBook('${workshop.workshopId}', '${event.eventId}', '${escapeHtml(workshop.name)}', '${dateFormatted}', '${event.location || ''}')">
            <div class="event-date">
                <strong>${dateFormatted}</strong>
                ${event.time ? `<span class="event-time">${event.time}</span>` : ''}
            </div>
            <div class="event-details">
                <span class="event-location">${event.location || 'Location TBC'}</span>
                <span class="event-seats ${seatClass}">${available} of ${total} seats left</span>
            </div>
        </div>
    `;
    }).join('');
    
    modal.innerHTML = `
        <div class="booking-modal-content">
            <div class="booking-modal-header">
                <h3 class="booking-modal-title">Select a Date</h3>
                <button class="booking-modal-close" onclick="closeEventSelectionModal()">&times;</button>
            </div>
            <div class="booking-modal-body">
                <p style="margin-bottom: 20px; color: #666;">Choose a date for <strong>${escapeHtml(workshop.name)}</strong></p>
                <div class="events-list">
                    ${eventsHTML}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Close event selection modal
 */
function closeEventSelectionModal() {
    const modal = document.getElementById('eventSelectionModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Select event and proceed to booking
 */
function selectEventAndBook(workshopId, eventId, workshopName, eventDate, eventLocation) {
    closeEventSelectionModal();
    
    // Store selected event ID for booking
    window.selectedEventId = eventId;
    
    // Open booking modal with event details
    if (typeof openBookingModal === 'function') {
        openBookingModal(
            workshopId,
            workshopName,
            'Selected Event',
            eventDate,
            eventLocation || 'As per event'
        );
    } else {
        console.error('openBookingModal function not found');
        showToast('Error opening booking modal', 'error');
    }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-NZ', options);
}

/**
 * Listen for data updates
 */
window.addEventListener('scheduledEventsUpdated', function(e) {
    console.log('📊 Events updated, refreshing availability...');
    updateCalendarAvailability(e.detail.events);
});

window.addEventListener('workshopCatalogUpdated', function(e) {
    console.log('📚 Catalog updated');
    if (typeof showToast === 'function') {
        showToast('Workshop catalog updated', 'info', 3000);
    }
});

/**
 * Manual refresh function (for admin use)
 * @param {boolean} silent - If true, don't show success toast
 */
async function refreshWorkshopData(silent = false) {
    if (!window.workshopCache) {
        console.error('Workshop cache not initialized');
        return;
    }
    
    console.log('🔄 Refreshing workshop data...');
    
    try {
        const data = await window.workshopCache.forceRefresh();
        updateWorkshopAvailability(data.workshops);
        updateCalendarAvailability(data.events);
        
        if (!silent && typeof showToast === 'function') {
            showToast('Workshop data refreshed', 'success', 2000);
        }
        
        console.log('✅ Workshop data updated');
        return data;
    } catch (error) {
        console.error('Refresh failed:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to refresh data', 'error');
        }
    }
}

// Make refresh function globally available
window.refreshWorkshopData = refreshWorkshopData;

console.log('✅ Workshop page integration loaded');
