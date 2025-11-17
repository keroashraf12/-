import express from 'express';
import Payment from '../models/Payment.js';
import PurchaseInvoice from '../models/PurchaseInvoice.js';
import SalesInvoice from '../models/SalesInvoice.js';
import Supplier from '../models/Supplier.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('relatedTo')
      .populate('invoice')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payments by type
router.get('/type/:type', async (req, res) => {
  try {
    const payments = await Payment.find({ type: req.params.type })
      .populate('relatedTo')
      .populate('invoice')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  const session = await Payment.startSession();
  session.startTransaction();

  try {
    const payment = new Payment(req.body);

    // Update invoice payment status if invoice is specified
    if (payment.invoice) {
      const InvoiceModel = payment.invoiceModel === 'PurchaseInvoice'
        ? PurchaseInvoice
        : SalesInvoice;

      const invoice = await InvoiceModel.findById(payment.invoice);
      invoice.paidAmount += payment.amount;
      invoice.remainingAmount = invoice.total - invoice.paidAmount;

      if (invoice.remainingAmount <= 0) {
        invoice.status = 'مدفوع';
      } else if (invoice.paidAmount > 0) {
        invoice.status = 'جزئي';
      }

      await invoice.save({ session });
    }

    // Update supplier/customer balance
    const Model = payment.relatedModel === 'Supplier' ? Supplier : Customer;
    await Model.findByIdAndUpdate(
      payment.relatedTo,
      { $inc: { balance: -payment.amount } },
      { session }
    );

    const newPayment = await payment.save({ session });
    await session.commitTransaction();

    const populatedPayment = await Payment.findById(newPayment._id)
      .populate('relatedTo')
      .populate('invoice');

    res.status(201).json(populatedPayment);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'الدفعة غير موجودة' });
    }
    res.json({ message: 'تم حذف الدفعة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
