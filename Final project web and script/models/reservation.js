// mongodb
var mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
  groupSize: { type: Number, required: true, min: 1 },
  arrivalTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
