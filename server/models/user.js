const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type:String, required: true, trim: true},
    password: {type:String, required: true, trim: true},
    email: {type: String, required: true},
    first_name: {type:String, required: true, trim: true},
    last_name: {type: String, required: true, trim: true},
    role: {type: String, default:'user'}
},
    {collection: 'users'}
);

module.exports = mongoose.model('User', userSchema);