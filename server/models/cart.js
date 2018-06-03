const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type:String, required: true},
    order_list: [{
        product_id: ObjectId,
        amount: {type: Number, default: 1, min: 1}
    }]
},
    {collection: 'carts'}
);

module.exports = mongoose.model('Cart', cartSchema);