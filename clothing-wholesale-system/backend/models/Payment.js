import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['شراء', 'بيع'],
    required: true
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel',
    required: true
  },
  relatedModel: {
    type: String,
    enum: ['Supplier', 'Customer'],
    required: true
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'invoiceModel'
  },
  invoiceModel: {
    type: String,
    enum: ['PurchaseInvoice', 'SalesInvoice']
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['نقدي', 'تحويل بنكي', 'شيك', 'بطاقة ائتمان'],
    default: 'نقدي'
  },
  date: {
    type: Date,
    default: Date.now
  },
  referenceNumber: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
