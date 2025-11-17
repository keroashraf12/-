import express from 'express';
import SalesInvoice from '../models/SalesInvoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all sales invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await SalesInvoice.find()
      .populate('customer', 'name phone')
      .populate('items.product', 'name code')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await SalesInvoice.findById(req.params.id)
      .populate('customer')
      .populate('items.product');
    if (!invoice) {
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new sales invoice
router.post('/', async (req, res) => {
  const session = await SalesInvoice.startSession();
  session.startTransaction();

  try {
    const invoice = new SalesInvoice(req.body);

    // Update product quantities
    for (const item of invoice.items) {
      const product = await Product.findById(item.product);
      if (product.quantity < item.quantity) {
        throw new Error(`المخزون غير كافي للمنتج: ${product.name}`);
      }

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    // Update customer balance
    await Customer.findByIdAndUpdate(
      invoice.customer,
      { $inc: { balance: invoice.remainingAmount } },
      { session }
    );

    const newInvoice = await invoice.save({ session });
    await session.commitTransaction();

    const populatedInvoice = await SalesInvoice.findById(newInvoice._id)
      .populate('customer', 'name phone')
      .populate('items.product', 'name code');

    res.status(201).json(populatedInvoice);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Update sales invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await SalesInvoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer', 'name phone').populate('items.product', 'name code');

    if (!invoice) {
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete sales invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await SalesInvoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }
    res.json({ message: 'تم حذف الفاتورة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
