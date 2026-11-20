const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

async function isSlotFree(startTime, endTime) {
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime,
        timeMax: endTime,
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
      },
    });
    const busySlots = response.data.calendars[process.env.GOOGLE_CALENDAR_ID].busy;
    return busySlots.length === 0;
  } catch (error) {
    console.error('Error checking calendar availability:', error);
    throw error;
  }
}

async function createBooking(name, groupSize, startTime, endTime) {
  try {
    const event = {
      summary: `TableUp Booking - ${name} (${groupSize} guests)`,
      description: `Party size: ${groupSize}`,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
    };
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

module.exports = { isSlotFree, createBooking };