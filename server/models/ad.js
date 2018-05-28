const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    num: {type: Number, require: true, unique: true},
    img: {data: Buffer, contentType: String}
}
);

module.exports = mongoose.model('Ad', adSchema);