const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const VectorSchema = new Schema({
    type: Number,
    values: {
        type: [Number],
        validate: {
            validator: v => len(v) == 100
        }
    }
}, { _id: false });

const DealW2vSchema = new Schema({
    _id: Number,
    words: [String],
    vectorizedWords: VectorSchema
}, { collection: 'dealw2v' });

module.exports = require('../connection').model('DealW2v', DealW2vSchema);