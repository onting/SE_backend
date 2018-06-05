const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const purchHistSchema = mongoose.Schema({
    _id: ObjectId,
    email: {type: String, required: true, trim: true},
    order_list: Array,
    payment_method: {type: String, required: true, trim: true},
    address: {type: String, required: true},
    address_detail: {type: String, default: ''},
    purchase_date: {type: Date, required: true},
    receive_date: Date,
    return: {type: Boolean, default: false}
},
    {collection: 'purchHists'}
);

module.exports = mongoose.model('PurchHist', purchHistSchema);