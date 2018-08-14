const mongoose = require('./set-mongoose');
const opts = { user: 'praha_read', pass: 'praha!@#', useNewUrlParser: true };
module.exports = mongoose.createConnection('mongodb://35.190.239.204:27017/praha', opts);