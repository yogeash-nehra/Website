/**
 * Workshop Data Cache Enhancer
 * Extends existing GoogleSheetsAPI with smart caching:
 * - Workshop Catalog: Cached for 7 days (static data)
 * - Scheduled Events: Always live (dynamic availability)
 */

class WorkshopCacheEnhancer {
    constructor(googleSheetsAPI) {
        this.api = googleSheetsAPI;
        this.CATALOG_CACHE_KEY = 'wh_workshop_catalog';
        this.CATALOG_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
        this.EVENTS_CACHE_KEY = 'wh_scheduled_events';
        this.EVENTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (for performance)
        
        this.catalogData = null;
        this.eventsData = null;
    }

    /**
     * Initialize and load all data
     * @returns {Promise<Object>} Combined workshop and event data
     */
    async init() {
        console.log('🚀 Initializing Workshop Cache Enhancer...');
        
        try {
            // Load catalog (tries cache first)
            await this.loadCatalog();
            
            // Load events (always fresh)
            await this.loadEvents();
            
            // Combine data
            const combined = this.combineData();
            
            console.log('✅ Initialization complete:', {
                workshops: combined.workshops.length,
                events: combined.events.length
            });
            
            // Schedule background refresh
            this.scheduleBackgroundRefresh();
            
            return combined;
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            
            // Try to return cached data as fallback
            return this.loadFromCache() || { workshops: [], events: [] };
        }
    }

    /**
     * Load Workshop Catalog (with 7-day cache)
     */
    async loadCatalog() {
        // Try cache first
        const cached = this.getCachedCatalog();
        if (cached) {
            console.log('📦 Using cached catalog (age: ' + this.getCatalogAge() + ')');
            this.catalogData = cached;
            
            // Refresh in background if older than 24 hours
            if (this.getCatalogAge() > 24 * 60 * 60 * 1000) {
                setTimeout(() => this.refreshCatalog(), 2000);
            }
            
            return cached;
        }

        // No cache, fetch fresh
        return await this.refreshCatalog();
    }

    /**
     * Refresh Workshop Catalog from API
     */
    async refreshCatalog() {
        console.log('🔄 Fetching fresh Workshop Catalog...');
        
        try {
            const data = await this.api.getWorkshops();
            this.catalogData = data;
            this.cacheCatalog(data);
            console.log('✅ Catalog refreshed:', data.length, 'workshops');
            
            // Trigger event for UI updates
            window.dispatchEvent(new CustomEvent('workshopCatalogUpdated', {
                detail: { workshops: data }
            }));
            
            return data;
            
        } catch (error) {
            console.error('❌ Failed to refresh catalog:', error);
            throw error;
        }
    }

    /**
     * Load Scheduled Events (always live, with short performance cache)
     */
    async loadEvents() {
        // Check short cache for performance (5 minutes)
        const cached = this.getCachedEvents();
        if (cached && Date.now() - cached.timestamp < this.EVENTS_CACHE_DURATION) {
            console.log('⚡ Using recent events cache (age: ' + Math.round((Date.now() - cached.timestamp) / 1000) + 's)');
            this.eventsData = cached.data;
            return cached.data;
        }

        // Fetch live events
        return await this.refreshEvents();
    }

    /**
     * Refresh Scheduled Events from API (live data)
     */
    async refreshEvents() {
        console.log('📡 Fetching live Scheduled Events...');
        
        try {
            const data = await this.api.getAllEvents();
            this.eventsData = data;
            this.cacheEvents(data);
            console.log('✅ Events refreshed:', data.length, 'scheduled events');
            
            // Trigger event for UI updates
            window.dispatchEvent(new CustomEvent('scheduledEventsUpdated', {
                detail: { events: data }
            }));
            
            return data;
            
        } catch (error) {
            console.error('❌ Failed to refresh events:', error);
            throw error;
        }
    }

    /**
     * Combine catalog and events data
     */
    combineData() {
        const workshops = this.catalogData || [];
        const events = this.eventsData || [];

        // Enhance workshops with event availability
        const enhancedWorkshops = workshops.map(workshop => {
            // Find all events for this workshop
            const workshopEvents = events.filter(e => e.workshopId === workshop.workshopId);
            
            // Calculate total available seats across all events
            const totalAvailableSeats = workshopEvents.reduce((sum, event) => {
                return sum + (parseInt(event.availableSeats) || 0);
            }, 0);
            
            // Get next upcoming event
            const upcomingEvents = workshopEvents
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Add totalSeats to each event from workshop data
            const eventsWithTotal = workshopEvents.map(event => ({
                ...event,
                totalSeats: workshop.totalSeats || 0
            }));
            
            return {
                ...workshop,
                totalAvailableSeats,
                upcomingEventsCount: upcomingEvents.length,
                nextEvent: upcomingEvents[0] ? {
                    ...upcomingEvents[0],
                    totalSeats: workshop.totalSeats || 0
                } : null,
                allEvents: eventsWithTotal
            };
        });

        return {
            workshops: enhancedWorkshops,
            events: events,
            lastUpdated: new Date().toISOString(),
            catalogAge: this.getCatalogAge(),
            eventsAge: this.getEventsAge()
        };
    }

    /**
     * Get workshop by ID with live event data
     */
    async getWorkshopById(workshopId) {
        if (!this.catalogData) {
            await this.loadCatalog();
        }
        
        const workshop = this.catalogData.find(w => w.workshopId === workshopId);
        if (!workshop) return null;

        // Get live events for this workshop
        const events = await this.getEventsByWorkshop(workshopId);
        
        return {
            ...workshop,
            events: events
        };
    }

    /**
     * Get events for a specific workshop (always live)
     */
    async getEventsByWorkshop(workshopId) {
        console.log('📡 Fetching live events for:', workshopId);
        return await this.api.getEvents(workshopId);
    }

    /**
     * Check live availability for an event
     */
    async checkAvailability(eventId) {
        console.log('📡 Checking live availability for:', eventId);
        return await this.api.checkAvailability(eventId);
    }

    /**
     * Get all workshops with live availability
     */
    async getAllWorkshopsWithAvailability() {
        await this.loadCatalog();
        await this.refreshEvents(); // Force fresh events
        return this.combineData();
    }

    /**
     * Force refresh all data
     */
    async forceRefresh() {
        console.log('🔄 Force refreshing all data...');
        this.api.clearCache(); // Clear API cache
        await this.refreshCatalog();
        await this.refreshEvents();
        return this.combineData();
    }

    /**
     * Schedule background refresh
     */
    scheduleBackgroundRefresh() {
        // Refresh events every 5 minutes
        setInterval(() => {
            console.log('⏰ Background: Refreshing events...');
            this.refreshEvents().catch(err => 
                console.warn('Background refresh failed:', err)
            );
        }, 5 * 60 * 1000);

        // Refresh catalog once per day
        setInterval(() => {
            console.log('⏰ Background: Refreshing catalog...');
            this.refreshCatalog().catch(err => 
                console.warn('Background catalog refresh failed:', err)
            );
        }, 24 * 60 * 60 * 1000);
    }

    // ================== Cache Management ==================

    /**
     * Cache Workshop Catalog
     */
    cacheCatalog(data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.CATALOG_CACHE_KEY, JSON.stringify(cacheData));
            console.log('💾 Catalog cached');
        } catch (error) {
            console.warn('⚠️ Failed to cache catalog:', error.message);
        }
    }

    /**
     * Get cached catalog
     */
    getCachedCatalog() {
        try {
            const cached = localStorage.getItem(this.CATALOG_CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Return if less than 7 days old
            if (age < this.CATALOG_CACHE_DURATION) {
                return data;
            }

            console.log('⏰ Catalog cache expired');
            return null;

        } catch (error) {
            console.warn('⚠️ Failed to load catalog cache:', error.message);
            return null;
        }
    }

    /**
     * Get catalog age in milliseconds
     */
    getCatalogAge() {
        try {
            const cached = localStorage.getItem(this.CATALOG_CACHE_KEY);
            if (!cached) return Infinity;
            
            const { timestamp } = JSON.parse(cached);
            return Date.now() - timestamp;
        } catch (error) {
            return Infinity;
        }
    }

    /**
     * Cache Events (short performance cache)
     */
    cacheEvents(data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.EVENTS_CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('⚠️ Failed to cache events:', error.message);
        }
    }

    /**
     * Get cached events
     */
    getCachedEvents() {
        try {
            const cached = localStorage.getItem(this.EVENTS_CACHE_KEY);
            if (!cached) return null;
            return JSON.parse(cached);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get events age in milliseconds
     */
    getEventsAge() {
        try {
            const cached = localStorage.getItem(this.EVENTS_CACHE_KEY);
            if (!cached) return Infinity;
            
            const { timestamp } = JSON.parse(cached);
            return Date.now() - timestamp;
        } catch (error) {
            return Infinity;
        }
    }

    /**
     * Load from cache (emergency fallback)
     */
    loadFromCache() {
        const catalog = this.getCachedCatalog();
        const events = this.getCachedEvents();
        
        if (!catalog) return null;
        
        this.catalogData = catalog;
        this.eventsData = events?.data || [];
        
        return this.combineData();
    }

    /**
     * Clear all caches
     */
    clearCache() {
        try {
            localStorage.removeItem(this.CATALOG_CACHE_KEY);
            localStorage.removeItem(this.EVENTS_CACHE_KEY);
            this.api.clearCache();
            console.log('🗑️ All caches cleared');
        } catch (error) {
            console.warn('⚠️ Failed to clear cache:', error.message);
        }
    }

    /**
     * Get cache info for debugging
     */
    getCacheInfo() {
        const catalogAge = this.getCatalogAge();
        const eventsAge = this.getEventsAge();
        
        return {
            catalog: {
                exists: catalogAge !== Infinity,
                age: Math.round(catalogAge / 1000), // seconds
                ageHours: Math.round(catalogAge / (1000 * 60 * 60)),
                ageDays: Math.round(catalogAge / (1000 * 60 * 60 * 24)),
                isExpired: catalogAge > this.CATALOG_CACHE_DURATION,
                expiresIn: Math.max(0, this.CATALOG_CACHE_DURATION - catalogAge)
            },
            events: {
                exists: eventsAge !== Infinity,
                age: Math.round(eventsAge / 1000), // seconds
                ageMinutes: Math.round(eventsAge / (1000 * 60)),
                isExpired: eventsAge > this.EVENTS_CACHE_DURATION
            }
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkshopCacheEnhancer;
}

window.WorkshopCacheEnhancer = WorkshopCacheEnhancer;

console.log('✅ Workshop Cache Enhancer loaded');
