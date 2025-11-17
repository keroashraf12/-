import express from 'express';
import PurchaseInvoice from '../models/PurchaseInvoice.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';

const router = express.Router();

// Get all purchase invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find()
      .populate('supplier', 'name phone')
      .populate('items.product', 'name code')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get purchase invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findById(req.params.id)
      .populate('supplier')
      .populate('items.product');
    if (!invoice) {
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new purchase invoice
router.post('/', async (req, res) => {
  const session = await PurchaseInvoice.startSession();
  session.startTransaction();

  try {
    const invoice = new PurchaseInvoice(req.body);

    // Update product quantities
    for (const item of invoice.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } },
        { session }
      );
    }

    // Update supplier balance
    await Supplier.findByIdAndUpdate(
      invoice.supplier,
      { $inc: { balance: invoice.remainingAmount } },
      { session }
    );

    const newInvoice = await invoice.save({ session });
    await session.commitTransaction();

    const populatedInvoice = await PurchaseInvoice.findById(newInvoice._id)
      .populate('supplier', 'name phone')
      .populate('items.product', 'name code');

    res.status(201).json(populatedInvoice);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Update purchase invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('supplier', 'name phone').populate('items.product', 'name code');

    if (!invoice) {
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete purchase invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }
    res.json({ message: 'تم حذف الفاتورة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
