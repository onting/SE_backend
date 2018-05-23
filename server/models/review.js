const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    topic: {type: String, required: true},
    content: {type: String, required: true},
    user: {type: String, required: true, trim: true},
    item: {type: String, required: true}, 
},
    {collection: 'review'}
);

module.exports = mongoose.model('review', reviewSchema);