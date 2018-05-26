const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const userSchema = mongoose.Schema({
    _id: ObjectId,
    userid: {type:String, required: true, trim: true},
    password: {type:String, required: true, trim: true},
    email: {type: String, required: true},
    name: {type:String, required: true, trim: true},
    address : {type:String, required: true},
    role: {type: String, default:'user'}
},
    {collection: 'users'}
);

module.exports = mongoose.model('User', userSchema);