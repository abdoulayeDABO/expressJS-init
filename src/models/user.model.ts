import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const capitalize = (v:any) => {
    return v.charAt(0).toUpperCase() + v.slice(1);
}

const userSchema = new Schema({
  uid: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  age: { type: Number },
  address: { type: String },
  phoneNumber: { type: String },
  accessToken: { type: String },
  resetToken: { type: String },
  activationToken: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  isActive: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String }
});

// Middleware to update the 'updatedAt' field on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});


// a setter
userSchema.path('name').set(function(v:any) {
    return capitalize(v);
  });

  
const User = mongoose.model('User', userSchema);

module.exports = User;
