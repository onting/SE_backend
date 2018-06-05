const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type:String, required: true},
    order_list: Array
},
    {collection: 'carts'}
);

module.exports = mongoose.model('Cart', cartSchema);