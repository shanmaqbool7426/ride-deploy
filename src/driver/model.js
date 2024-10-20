import mongoose from 'mongoose'

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['driver', 'passenger'],
    // default: 'driver'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  vehicle: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  }],
  rating: {
    type: Number,
    default: 5.0
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  wallet: {
    type: String,
  },
  driverImage: {
    type: String, // Assuming the image URL or path is stored as a string
    required: true
  },
  idCardFront: {
    type: String,
    required: true
  },
  idCardBack: {
    type: String,
    required: true
  },
  drivingLicenseFront: {
    type: String,
    required: true
  },
  drivingLicenseBack: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

driverSchema.index({ location: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
