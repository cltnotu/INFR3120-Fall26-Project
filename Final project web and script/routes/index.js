// express and mongodb
var express = require('express');
var mongoose = require('mongoose');
var Reservation = require('../models/reservation');
var router = express.Router();
const { isSlotFree, createBooking } = require('../services/calendar');

router.get('/', async function(req, res, next) {
  try {
    var reservations = [];
    var databaseReady = mongoose.connection.readyState === 1;

    if (databaseReady) {
      reservations = await Reservation.find().sort({ createdAt: -1 }).lean();
    }

    console.log('Reservation saved');
    console.log('Database:', mongoose.connection.name);
    console.log('Collection:', Reservation.collection.name);

    res.render('index', {
      title: 'Home',
      reservations: reservations,
      databaseReady: databaseReady
    });
  } catch (error) {
    next(error);
  }
});

router.get('/survey', function(req, res, next) {
  res.render('survey', {
    title: 'Reserve a Table',
    error: null
  });
});

router.post('/survey', async function(req, res, next) {
  var groupSize = Number(req.body.groupSize);
  var arrivalTime = typeof req.body.arrivalTime === 'string' ? req.body.arrivalTime.trim() : '';
  var arrivalDate = req.body.arrivalDate;
  var guestName = req.body.guestName || 'Guest';

  // 1. Basic validation
  if (!Number.isSafeInteger(groupSize) || groupSize < 1 ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime) || !arrivalDate) {
    return res.status(400).render('survey', {
      title: 'Reserve a Table',
      error: 'Please enter a valid name, date, number of guests, and arrival time.'
    });
  }

  // 2. Format the date and time for Google Calendar
  const startDateTime = new Date(`${arrivalDate}T${arrivalTime}:00`).toISOString();
  const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(); // 1 hour later

  try {
    // 3. Check Google Calendar
    const free = await isSlotFree(startDateTime, endDateTime);
    if (!free) {
      return res.status(400).render('survey', {
        title: 'Reserve a Table',
        error: 'Sorry, that time slot is already booked. Please pick another.'
      });
    }

    // 4. Create the calendar event
    await createBooking(guestName, groupSize, startDateTime, endDateTime);

    // 5. Save to MongoDB
    if (mongoose.connection.readyState === 1) {
      await Reservation.create({
        groupSize: groupSize,
        arrivalTime: arrivalTime
      });
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('survey', {
      title: 'Reserve a Table',
      error: 'Could not connect to the calendar. Please try again later.'
    });
  }
});


module.exports = router;
