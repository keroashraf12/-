import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  address: {
    type: String
  },
  companyName: {
    type: String
  },
  taxNumber: {
    type: String
  },
  balance: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Supplier', supplierSchema);
