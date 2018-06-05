const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true, trim: true},
    nickname: {type:String, required: true, trim: true},
    post_code: {type: String, required: true},
    address : {type:String, required: true},
    address_detail: {type: String, default: ''},
    phone: {type:String, required: true},
    role: {type: Boolean, default: false}
},
    {collection: 'users'}
);

module.exports = mongoose.model('User', userSchema);