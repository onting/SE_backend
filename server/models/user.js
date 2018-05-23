const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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