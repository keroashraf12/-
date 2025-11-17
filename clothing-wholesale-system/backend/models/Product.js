import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  color: {
    type: String
  },
  description: {
    type: String
  },
  purchasePrice: {
    type: Number,
    required: true,
    default: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0
  },
  minQuantity: {
    type: Number,
    default: 10
  },
  unit: {
    type: String,
    default: 'قطعة'
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
