# Workshop Booking System

Dynamic workshop catalog and booking system powered by Google Sheets.

## Features

- ✅ **Dynamic Workshop Catalog** - All workshop data loaded from Google Sheets
- ✅ **Smart Calendar** - Events grouped by workshop with automatic details
- ✅ **Booking System** - Integrated booking with success/failure pages
- ✅ **Offline Fallback** - JSON backup for offline access
- ✅ **Caching** - Smart caching for performance (7-day catalog, 5-min events)

## File Structure

### HTML Pages
- `index.html` - Main workshop catalog page
- `booking.html` - Booking form
- `booking-success.html` - Success page
- `booking-failed.html` - Error page

### JavaScript
- `workshop-dynamic-renderer.js` - Renders workshop cards from Google Sheets
- `dynamic-calendar-loader.js` - Groups events by workshop and displays calendar
- `workshop-cache-enhancer.js` - Caching system for performance
- `workshop-page-integration.js` - Coordinates all components
- `fetch-and-save-workshops.js` - Utility to save Google Sheets data as JSON
- `workshop-json-loader.js` - JSON fallback loader

### CSS
- `event-selection-modal.css` - Modal styling

### Data
- `workshops-data.json` - Optional offline fallback data

## Google Sheets Setup

### Required Sheets

#### 1. Workshop Catalog
Columns: Workshop ID | Name | Level | Description | Format | Duration | Price | Total Seats | Location | Status

#### 2. Scheduled Events
Columns: Event ID | Workshop ID | Date | Time | Available Seats | Status | Venue

**Critical:** Workshop IDs must match exactly between sheets (case-sensitive).

## Usage

### To Update Workshops
1. Edit "Workshop Catalog" sheet in Google Sheets
2. Save
3. Refresh website (Ctrl+Shift+R)

### To Add Events
1. Add row to "Scheduled Events" sheet
2. Use matching Workshop ID from catalog
3. Set Status to "Active"
4. Save and refresh

### To Create JSON Backup
Open browser console on the workshops page:
```javascript
await fetchAndSaveWorkshops()
```
File downloads automatically. Rename to `workshops-data.json` for offline fallback.

## How It Works

1. Page loads and fetches all data from Google Sheets
2. Workshops rendered dynamically (no hardcoded HTML)
3. Events grouped by workshop ID
4. Workshop details (name, duration, location) pulled from catalog
5. Calendar displays grouped by workshop with all details

## Configuration

Google Apps Script URL must be configured in `assets/js/config.js`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Proprietary - Wolfgramm Holdings

---

*For detailed documentation, see the original implementation files or contact the development team.*
