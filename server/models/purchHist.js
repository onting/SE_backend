const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const purchHistSchema = mongoose.Schema({
    _id: ObjectId,
    name: {type: String, reqruied: true},
    email: {type: String, required: true, trim: true},
    order_list: Array,
    phone: {type:String, required: true},
    payment_method: {type: String, required: true, trim: true},
    name_recv: {type: String},
    phone_recv: {type: String},
    post_code: {type: String, required: true},
    address: {type: String, required: true},
    address_detail: {type: String, default: ''},
    purchase_date: {type: Date, required: true},
    receive_date: Date,
    return: {type: Boolean, default: false}
},
    {collection: 'purchHists'}
);

module.exports = mongoose.model('PurchHist', purchHistSchema);