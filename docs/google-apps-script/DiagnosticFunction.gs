/**
 * DIAGNOSTIC FUNCTION - Run this to find the exact problem
 * Select this function and click Run
 */
function diagnoseValidateBooking() {
  Logger.log('🔍 DIAGNOSTIC START');
  Logger.log('='.repeat(50));
  
  // Test 1: Configuration
  Logger.log('\n📋 Test 1: Configuration');
  try {
    const config = getConfiguration();
    Logger.log('✅ getConfiguration() works');
    Logger.log('   Sheet ID: ' + config.SHEET_ID);
    Logger.log('   Scheduled Events Sheet: ' + config.SCHEDULED_EVENTS_SHEET);
  } catch (e) {
    Logger.log('❌ getConfiguration() FAILED: ' + e.toString());
    return;
  }
  
  // Test 2: Open Spreadsheet
  Logger.log('\n📊 Test 2: Open Spreadsheet');
  try {
    const config = getConfiguration();
    const ss = SpreadsheetApp.openById(config.SHEET_ID);
    Logger.log('✅ Can open spreadsheet');
    Logger.log('   Name: ' + ss.getName());
  } catch (e) {
    Logger.log('❌ Cannot open spreadsheet: ' + e.toString());
    Logger.log('   Check: Is Sheet ID correct?');
    Logger.log('   Check: Do you have access to this sheet?');
    return;
  }
  
  // Test 3: Get Scheduled Events Sheet
  Logger.log('\n📅 Test 3: Get Scheduled Events Sheet');
  try {
    const config = getConfiguration();
    const ss = SpreadsheetApp.openById(config.SHEET_ID);
    const sheet = ss.getSheetByName(config.SCHEDULED_EVENTS_SHEET);
    
    if (!sheet) {
      Logger.log('❌ Sheet "' + config.SCHEDULED_EVENTS_SHEET + '" NOT FOUND!');
      Logger.log('   Available sheets:');
      ss.getSheets().forEach(s => Logger.log('   - ' + s.getName()));
      return;
    }
    
    Logger.log('✅ Found Scheduled Events sheet');
  } catch (e) {
    Logger.log('❌ Error getting sheet: ' + e.toString());
    return;
  }
  
  // Test 4: Read Events Data
  Logger.log('\n📖 Test 4: Read Events Data');
  try {
    const config = getConfiguration();
    const sheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    Logger.log('✅ Can read data');
    Logger.log('   Total rows: ' + data.length);
    Logger.log('   Headers: ' + data[0].join(', '));
    
    if (data.length > 1) {
      Logger.log('   First event: ' + data[1][0]); // Event ID
    } else {
      Logger.log('⚠️  No events found (only headers)');
    }
  } catch (e) {
    Logger.log('❌ Cannot read data: ' + e.toString());
    return;
  }
  
  // Test 5: Test validateBooking function
  Logger.log('\n🧪 Test 5: Test validateBooking()');
  try {
    const config = getConfiguration();
    const sheet = getSheet(config.SCHEDULED_EVENTS_SHEET);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      Logger.log('⚠️  Cannot test - no events in sheet');
      Logger.log('   Add events to "Scheduled Events" sheet first!');
      return;
    }
    
    const testEventId = data[1][0]; // First event ID
    Logger.log('   Testing with event ID: ' + testEventId);
    
    const result = BookingService.validateBooking(testEventId, 1);
    
    Logger.log('✅ validateBooking() WORKS!');
    Logger.log('   Result: ' + JSON.stringify(result));
    
  } catch (e) {
    Logger.log('❌ validateBooking() FAILED: ' + e.toString());
    Logger.log('   This is your problem!');
  }
  
  Logger.log('\n' + '='.repeat(50));
  Logger.log('🏁 DIAGNOSTIC COMPLETE');
}

