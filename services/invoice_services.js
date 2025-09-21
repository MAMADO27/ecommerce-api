const asyncHandler = require('express-async-handler');
const PDF_document = require('pdfkit');
const Order = require('../modules/order_module');

// Generate invoice PDF and stream it to response
exports.get_invoice = asyncHandler(async (req, res, next) => {
  const orderId = req.params.orderId;

  // هات الأوردر + اليوزر + المنتجات
  const order = await Order.findById(orderId)
    .populate('user', 'name email')
    .populate('cart_items.product', 'title price');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

  const doc = new PDF_document();
  doc.pipe(res);

  // عنوان الفاتورة
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();

  // بيانات العميل
  doc.fontSize(14).text(`Customer: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);
  doc.text(`Date: ${order.createdAt.toDateString()}`);
  doc.moveDown();

  // تفاصيل المنتجات
  let total = 0;
  order.cart_items.forEach((item, i) => {
  const lineTotal = item.price * item.quantity;
  total += lineTotal;
  doc.text(
    `${i + 1}. ${item.product.title} - ${item.quantity} x $${item.price} = $${lineTotal}`
  );
});

  // الإجمالي
  doc.moveDown();
  doc.fontSize(16).text(`Total: $${total}`, { align: 'right' });

  doc.end();
});