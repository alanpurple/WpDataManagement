const mongoose = require('./set-mongoose');
module.exports = mongoose.createConnection('mongodb://localhost:27017/wprec', { useNewUrlParser: true });