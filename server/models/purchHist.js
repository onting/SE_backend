const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const purchHistSchema = mongoose.Schema({
    _id: ObjectId,
    email: {type: String, required: true},
    product_id: ObjectId,
    payment_method: String,
    amount: {type: Number, default: 1, min: 1},
    address: String,
    purchase_date: Date,
    receive_date: mongoose.Schema.Types.Mixed
},
    {collection: 'purchHists'}
);

module.exports = mongoose.model('PurchHists', purchHistSchema);