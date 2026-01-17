/**
 * Workshop Dynamic Renderer
 * Dynamically renders workshop cards from Google Sheets data
 * Ensures the HTML always matches the Google Sheet (source of truth)
 */

class WorkshopDynamicRenderer {
    constructor() {
        this.container = null;
        this.navContainer = null;
        this.workshops = [];
        this.isRendered = false;
    }

    /**
     * Initialize and render workshops from Google Sheets
     */
    async init() {
        console.log('🎨 Initializing dynamic workshop renderer...');
        
        // Get containers
        this.container = document.querySelector('.wh-grid');
        this.navContainer = document.querySelector('.wh-nav');
        
        if (!this.container) {
            console.error('❌ Workshop grid container not found');
            return;
        }

        try {
            // Wait for Google Sheets API to be available
            if (typeof sheetsAPI === 'undefined') {
                console.warn('⚠️ Google Sheets API not loaded, trying JSON fallback...');
                return await this.initFromJSON();
            }

            // Fetch workshops from Google Sheets
            console.log('📊 Fetching workshops from Google Sheets...');
            const data = await sheetsAPI.getWorkshops();
            
            if (!data || data.length === 0) {
                console.warn('⚠️ No workshop data received, trying JSON fallback...');
                return await this.initFromJSON();
            }

            this.workshops = data;
            console.log(`✅ Loaded ${data.length} workshops from Google Sheets`);

            // Render the workshops
            this.render();
            
        } catch (error) {
            console.error('❌ Failed to fetch workshops from API:', error);
            console.log('🔄 Attempting JSON fallback...');
            
            try {
                return await this.initFromJSON();
            } catch (jsonError) {
                console.error('❌ JSON fallback also failed:', jsonError);
                console.log('ℹ️ Keeping existing HTML workshop cards as fallback');
            }
        }
    }

    /**
     * Initialize from static JSON file (fallback)
     */
    async initFromJSON() {
        console.log('📂 Loading workshops from JSON file...');
        
        try {
            const response = await fetch('workshops-data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Could not load JSON file`);
            }
            
            const data = await response.json();
            this.workshops = data.workshops || [];
            
            console.log(`✅ Loaded ${this.workshops.length} workshops from JSON file`);
            
            // Check if data is stale
            if (data.metadata?.fetchedAt) {
                const fetchedDate = new Date(data.metadata.fetchedAt);
                const daysSinceFetch = (Date.now() - fetchedDate.getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysSinceFetch > 7) {
                    console.warn(`⚠️ JSON data is ${Math.round(daysSinceFetch)} days old`);
                    console.log('💡 Run fetchAndSaveWorkshops() to update the JSON file');
                } else {
                    console.log(`ℹ️ JSON data age: ${Math.round(daysSinceFetch)} days`);
                }
            }
            
            // Render the workshops
            this.render();
            
            return data;
            
        } catch (error) {
            console.error('❌ Failed to load from JSON:', error);
            throw error;
        }
    }

    /**
     * Render all workshop cards dynamically
     */
    render() {
        if (!this.container || this.workshops.length === 0) return;

        console.log('🎨 Rendering workshop cards dynamically...');

        // Clear existing content
        this.container.innerHTML = '';

        // Render each workshop
        this.workshops.forEach((workshop, index) => {
            const card = this.createWorkshopCard(workshop, index + 1);
            this.container.appendChild(card);
        });

        // Update navigation
        this.updateNavigation();

        this.isRendered = true;
        
        // Dispatch event for other systems to update
        window.dispatchEvent(new CustomEvent('workshopsRendered', {
            detail: { workshops: this.workshops }
        }));

        // Re-initialize navigation scroll handlers
        if (window.__WH_NAV_INIT__) {
            window.__WH_NAV_INIT__();
        }

        console.log(`✅ Rendered ${this.workshops.length} workshop cards`);
    }

    /**
     * Create a workshop card HTML element
     */
    createWorkshopCard(workshop, displayNumber) {
        const article = document.createElement('article');
        article.id = workshop.workshopId;
        article.className = 'wh-card wh-anchor';
        article.setAttribute('data-workshop-id', workshop.workshopId);

        // Format the workshop name with number prefix if not already present
        const workshopName = workshop.name.startsWith(`${displayNumber}.`) 
            ? workshop.name 
            : `${displayNumber}. ${workshop.name}`;

        // Format duration
        const duration = this.formatDuration(workshop.duration);

        // Format price
        const price = this.formatPrice(workshop.price);

        // Format seats
        const seats = this.formatSeats(workshop.totalSeats);

        article.innerHTML = `
            <h3 class="wh-heading">${this.escapeHtml(workshopName)}</h3>
            <hr class="wh-rule">
            <p class="wh-summary">${this.escapeHtml(workshop.description)}</p>
            <div class="wh-meta">
                <div><b>Format:</b> ${this.escapeHtml(workshop.format)}</div>
                <div><b>Seats:</b> ${seats}</div>
                <div><b>Duration:</b> ${duration}</div>
                <div><b>Location:</b> ${this.escapeHtml(workshop.location)}</div>
            </div>
            <div class="wh-availability">
                <span class="wh-availability-dot high"></span>
                <span>Loading availability...</span>
            </div>
            <div class="wh-actions">
                <a class="wh-action watch" href="video.html?service=${workshop.workshopId}">Watch Video</a>
                <button class="wh-action book" onclick="openBookingModalWithEvents('${workshop.workshopId}')" data-workshop-id="${workshop.workshopId}">Book Now</button>
            </div>
        `;

        return article;
    }

    /**
     * Update navigation chips
     */
    updateNavigation() {
        if (!this.navContainer) return;

        console.log('🧭 Updating navigation...');

        // Clear existing nav items
        this.navContainer.innerHTML = '';

        // Create nav items for each workshop
        this.workshops.forEach((workshop, index) => {
            const displayNumber = index + 1;
            const workshopName = workshop.name.startsWith(`${displayNumber}.`) 
                ? workshop.name 
                : `${displayNumber}. ${workshop.name}`;

            const chip = document.createElement('a');
            chip.className = 'wh-chip';
            chip.href = `#${workshop.workshopId}`;
            chip.textContent = workshopName;
            
            this.navContainer.appendChild(chip);
        });
    }

    /**
     * Format duration for display
     */
    formatDuration(duration) {
        if (!duration) return 'TBD';
        
        // Handle various duration formats from Google Sheets
        const str = String(duration).trim();
        
        // If already formatted nicely, return as is
        if (str.match(/\d+\s*(mins?|hours?|hrs?|days?)/i)) {
            return str;
        }
        
        // If it's "Full Day" or similar
        if (str.match(/full\s*day/i)) {
            return 'Full Day';
        }
        
        // If it's a number (assume minutes)
        if (str.match(/^\d+$/)) {
            return `${str} mins`;
        }
        
        // If it's decimal hours (like 4.5)
        if (str.match(/^\d+\.\d+$/)) {
            const hours = parseFloat(str);
            return `${hours} Hours`;
        }
        
        return str;
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (!price) return 'Custom';
        
        // Check if it's already a formatted string
        if (typeof price === 'string' && !price.match(/^\d+$/)) {
            return price;
        }
        
        // If it's a number or numeric string
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) {
            return 'Custom';
        }
        
        return `$${numPrice} NZD`;
    }

    /**
     * Format seats for display
     */
    formatSeats(seats) {
        if (!seats) return 'Custom';
        
        // Check if it's a string like "Tailored" or "Custom"
        if (typeof seats === 'string' && !seats.match(/^\d+$/)) {
            return seats;
        }
        
        // If it's a number
        const numSeats = parseInt(seats);
        if (isNaN(numSeats)) {
            return 'Custom';
        }
        
        return numSeats.toString();
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get workshop by ID
     */
    getWorkshopById(workshopId) {
        return this.workshops.find(w => w.workshopId === workshopId);
    }

    /**
     * Refresh workshops from Google Sheets
     */
    async refresh() {
        console.log('🔄 Refreshing workshops...');
        await this.init();
    }
}

// Initialize when DOM is ready
let workshopRenderer = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Wait a bit for other scripts to initialize
    setTimeout(async () => {
        workshopRenderer = new WorkshopDynamicRenderer();
        await workshopRenderer.init();
        
        // Make globally available
        window.workshopRenderer = workshopRenderer;
    }, 500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkshopDynamicRenderer;
}

window.WorkshopDynamicRenderer = WorkshopDynamicRenderer;

console.log('✅ Workshop Dynamic Renderer loaded');
