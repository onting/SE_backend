const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, trim: true, unique: true},
    catalog: {type: String, required: true, trim: true},
    platform: {type: String, required: true, trim: true},
    provider: {type: String, required: false},
    release_date: {type: Date, default: Date.now()},
    price: {type: Number, required: true, min:0},
    stock: {type: Number, default: 1, min:0},
    total_sell: {type: Number, default: 0, min: 0},
    img: {data: Buffer, contentType: String},
    imgSub: {data: Buffer, contentType: String},
    reviews: [{
        _id: mongoose.Schema.Types.ObjectId,
        email: {type: String, required: true, trim: true},
        content: String,
        rate: {type: Number, default: 5, min: 1}
    }]
},
    {collection: 'products'}
);

module.exports = mongoose.model('Product', productSchema);