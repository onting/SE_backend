const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const userSchema = mongoose.Schema({
    _id: ObjectId,
    userid: {type:String, required: true, trim: true},
    password: {type:String, required: true, trim: true},
    email: {type: String, required: true},
    name: {type:String, required: true, trim: true},
    address : {type:String, required: true},
    role: {type: String, default:'user'},
    cart: {
        product_id: {type:ObjectId, required: true},
        payment_method: {type:String, required: true, trim: true},
        amount: {type:Number, default:1},
        address: {type: String}
    }
},
    {collection: 'users'}
);

module.exports = mongoose.model('User', userSchema);