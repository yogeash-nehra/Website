/**
 * Workshop JSON Loader
 * 
 * Provides JSON file loading capability with automatic fallback
 * Use this when you want to use static JSON instead of API calls
 */

class WorkshopJSONLoader {
    constructor(jsonFilePath = 'workshops-data.json') {
        this.jsonFilePath = jsonFilePath;
        this.data = null;
        this.useJSON = false; // Set to true to prefer JSON over API
    }

    /**
     * Initialize - decides whether to use JSON or API
     */
    async init() {
        console.log('🚀 Initializing Workshop JSON Loader...');
        
        // Check if we should use JSON (configuration flag)
        if (this.useJSON || !this.isAPIAvailable()) {
            console.log('📂 Using JSON file mode');
            return await this.loadFromJSON();
        } else {
            console.log('📡 Using API mode with JSON fallback');
            return await this.loadWithFallback();
        }
    }

    /**
     * Check if Google Sheets API is available
     */
    isAPIAvailable() {
        return typeof sheetsAPI !== 'undefined' && sheetsAPI !== null;
    }

    /**
     * Load from JSON file
     */
    async loadFromJSON() {
        console.log(`📂 Loading workshops from ${this.jsonFilePath}...`);
        
        try {
            const response = await fetch(this.jsonFilePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.data = await response.json();
            
            console.log('✅ Loaded from JSON:', {
                workshops: this.data.workshops?.length || 0,
                events: this.data.events?.length || 0,
                fetchedAt: this.data.metadata?.fetchedAt || 'unknown'
            });
            
            // Check if data is stale (older than 7 days)
            if (this.data.metadata?.fetchedAt) {
                const fetchedDate = new Date(this.data.metadata.fetchedAt);
                const daysSinceFetch = (Date.now() - fetchedDate.getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysSinceFetch > 7) {
                    console.warn(`⚠️ JSON data is ${Math.round(daysSinceFetch)} days old. Consider refreshing.`);
                }
            }
            
            return this.data;
            
        } catch (error) {
            console.error('❌ Failed to load JSON file:', error);
            throw error;
        }
    }

    /**
     * Load with API first, JSON as fallback
     */
    async loadWithFallback() {
        try {
            // Try API first
            console.log('📡 Attempting to load from API...');
            
            if (!this.isAPIAvailable()) {
                throw new Error('API not available');
            }
            
            const workshops = await sheetsAPI.getWorkshops();
            const events = await sheetsAPI.getAllEvents();
            
            this.data = {
                metadata: {
                    fetchedAt: new Date().toISOString(),
                    totalWorkshops: workshops.length,
                    totalEvents: events.length,
                    source: 'Google Sheets API'
                },
                workshops,
                events
            };
            
            console.log('✅ Loaded from API:', {
                workshops: workshops.length,
                events: events.length
            });
            
            return this.data;
            
        } catch (apiError) {
            console.warn('⚠️ API failed, trying JSON fallback:', apiError.message);
            
            try {
                return await this.loadFromJSON();
            } catch (jsonError) {
                console.error('❌ JSON fallback also failed:', jsonError.message);
                throw new Error('Both API and JSON fallback failed');
            }
        }
    }

    /**
     * Get workshops
     */
    getWorkshops() {
        if (!this.data) {
            console.error('❌ Data not loaded. Call init() first.');
            return [];
        }
        return this.data.workshops || [];
    }

    /**
     * Get events
     */
    getEvents() {
        if (!this.data) {
            console.error('❌ Data not loaded. Call init() first.');
            return [];
        }
        return this.data.events || [];
    }

    /**
     * Get workshop by ID
     */
    getWorkshopById(workshopId) {
        const workshops = this.getWorkshops();
        return workshops.find(w => w.workshopId === workshopId);
    }

    /**
     * Get events for specific workshop
     */
    getEventsForWorkshop(workshopId) {
        const events = this.getEvents();
        return events.filter(e => e.workshopId === workshopId);
    }

    /**
     * Enable JSON mode (prefer JSON over API)
     */
    enableJSONMode() {
        this.useJSON = true;
        console.log('✅ JSON mode enabled - will use static JSON file');
    }

    /**
     * Disable JSON mode (prefer API over JSON)
     */
    disableJSONMode() {
        this.useJSON = false;
        console.log('✅ JSON mode disabled - will use API with JSON fallback');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.WorkshopJSONLoader = WorkshopJSONLoader;
    console.log('✅ Workshop JSON Loader available');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkshopJSONLoader;
}
