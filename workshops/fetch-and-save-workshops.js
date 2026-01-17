/**
 * Fetch and Save Workshops to JSON
 * 
 * This utility fetches all workshop data from Google Sheets
 * and saves it as a static JSON file for:
 * - Offline fallback
 * - Development/testing
 * - Backup
 * - Faster loading
 * 
 * Usage:
 * 1. Open workshops/index.html
 * 2. Open browser console (F12)
 * 3. Run: await fetchAndSaveWorkshops()
 * 4. Copy the JSON output and save to workshops-data.json
 */

async function fetchAndSaveWorkshops() {
    console.log('🔄 Fetching all workshop data from Google Sheets...');
    
    try {
        // Check if API is available
        if (typeof sheetsAPI === 'undefined') {
            throw new Error('Google Sheets API not loaded. Make sure you run this from the workshops page.');
        }
        
        // Fetch workshops and events
        console.log('📊 Fetching workshops...');
        const workshops = await sheetsAPI.getWorkshops();
        
        console.log('📅 Fetching events...');
        const events = await sheetsAPI.getAllEvents();
        
        // Create combined data structure
        const data = {
            metadata: {
                fetchedAt: new Date().toISOString(),
                totalWorkshops: workshops.length,
                totalEvents: events.length,
                source: 'Google Sheets',
                generatedBy: 'fetch-and-save-workshops.js'
            },
            workshops: workshops,
            events: events
        };
        
        // Convert to formatted JSON
        const jsonString = JSON.stringify(data, null, 2);
        
        // Display results
        console.log(`✅ Successfully fetched ${workshops.length} workshops and ${events.length} events`);
        console.log('📦 Total data size:', (jsonString.length / 1024).toFixed(2), 'KB');
        
        // Log the JSON
        console.log('\n📋 JSON DATA (copy this):');
        console.log('='.repeat(80));
        console.log(jsonString);
        console.log('='.repeat(80));
        
        // Create downloadable file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `workshops-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ File downloaded! Check your Downloads folder.');
        console.log('💡 You can also copy the JSON above and save it manually as workshops-data.json');
        
        // Store in localStorage as backup
        try {
            localStorage.setItem('workshops_backup_json', jsonString);
            console.log('✅ Also saved to localStorage as backup');
        } catch (e) {
            console.warn('⚠️ Could not save to localStorage (too large?):', e.message);
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Error fetching workshops:', error);
        console.error('Make sure:');
        console.error('1. You are on the workshops page');
        console.error('2. Google Sheets API is configured');
        console.error('3. You have internet connection');
        throw error;
    }
}

/**
 * Load workshops from saved JSON file
 */
async function loadWorkshopsFromJSON(jsonFile = 'workshops-data.json') {
    console.log('📂 Loading workshops from JSON file...');
    
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('✅ Loaded from JSON:');
        console.log(`   - ${data.workshops.length} workshops`);
        console.log(`   - ${data.events.length} events`);
        console.log(`   - Fetched: ${data.metadata.fetchedAt}`);
        
        return data;
        
    } catch (error) {
        console.error('❌ Error loading JSON file:', error);
        throw error;
    }
}

/**
 * Update dynamic renderer to use JSON fallback
 */
function enhanceRendererWithJSONFallback() {
    if (typeof WorkshopDynamicRenderer === 'undefined') {
        console.warn('WorkshopDynamicRenderer not found');
        return;
    }
    
    // Store original init method
    const originalInit = WorkshopDynamicRenderer.prototype.init;
    
    // Override with fallback support
    WorkshopDynamicRenderer.prototype.init = async function() {
        try {
            // Try original method (fetch from API)
            return await originalInit.call(this);
        } catch (error) {
            console.warn('⚠️ Failed to fetch from API, trying JSON fallback...');
            
            try {
                // Try loading from JSON file
                const data = await loadWorkshopsFromJSON('workshops-data.json');
                this.workshops = data.workshops;
                this.render();
                console.log('✅ Loaded from JSON fallback successfully');
                return { workshops: data.workshops };
            } catch (jsonError) {
                console.error('❌ JSON fallback also failed:', jsonError);
                throw error; // Throw original error
            }
        }
    };
    
    console.log('✅ Enhanced renderer with JSON fallback support');
}

// Auto-enhance if running on page
if (typeof window !== 'undefined') {
    window.fetchAndSaveWorkshops = fetchAndSaveWorkshops;
    window.loadWorkshopsFromJSON = loadWorkshopsFromJSON;
    window.enhanceRendererWithJSONFallback = enhanceRendererWithJSONFallback;
    
    console.log('✅ Fetch and Save utilities loaded');
    console.log('📌 Available commands:');
    console.log('   - fetchAndSaveWorkshops()     : Fetch from Google Sheets and download JSON');
    console.log('   - loadWorkshopsFromJSON()     : Load from workshops-data.json');
    console.log('   - enhanceRendererWithJSONFallback() : Add JSON fallback to renderer');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchAndSaveWorkshops,
        loadWorkshopsFromJSON,
        enhanceRendererWithJSONFallback
    };
}
