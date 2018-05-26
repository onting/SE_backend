const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, trim: true},
    catalog: {type: String, required: true, trim: true},
    platform: {type: String, required: true, trim: true},
    provider: {type: String, required: false},
    price: {type: Number, required: true, min:0},
    stock: {type: Number, default: 1, min:0},
    total_sell: {type: Number, default: 0, min: 0},
    reviews: [{
        user_name: {type: String, required: true, trim: true},
        content: String,
        rate: {type: Number, required: true}
    }]
},
    {collection: 'products'}
);

module.exports = mongoose.model('Product', productSchema);