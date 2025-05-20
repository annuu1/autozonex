const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  phone:{
    type:String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
