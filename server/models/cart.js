const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type:String, require:true},
    product_id: {type:ObjectId, required: true},
    payment_method: {type:String, required: true, trim: true},
    amount: {type:Number, default:1},
    address: {type: String}
},
    {collection: 'carts'}
);

module.exports = mongoose.model('Cart', cartSchema);