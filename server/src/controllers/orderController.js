import { Order } from '../models/Order.js';

export let memoryOrders = [
  {
    _id: 'ord_demo_001',
    orderNumber: 'BWC-ORD-89210',
    customerInfo: { name: 'Ayesha Khan', email: 'ayesha.k@example.com', phone: '+92 300 1234567' },
    orderItems: [
      {
        title: 'Gul-e-Rana Royal Kundan & Pearl Necklace Set',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
        price: 320,
        quantity: 1,
        selectedColor: 'Royal Gold & Ivory'
      }
    ],
    shippingAddress: { street: 'Main Gulberg Galleria, Suite 402', city: 'Lahore', state: 'Punjab', postalCode: '54000', country: 'Pakistan' },
    totalPrice: 320,
    isPaid: true,
    paidAt: new Date().toISOString(),
    orderStatus: 'Handcrafting',
    trackingNumber: 'TCS-99102948',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      customerInfo,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalPrice,
      paymentResult
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const orderNumber = 'BWC-ORD-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const order = new Order({
        orderNumber,
        user: req.user ? req.user._id : null,
        customerInfo: customerInfo || {
          name: req.user ? req.user.name : 'Valued Patron',
          email: req.user ? req.user.email : 'patron@example.com',
          phone: '+92 300 0000000'
        },
        orderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentResult,
        orderStatus: 'Processing',
        trackingNumber: 'BWC-EXP-' + Math.floor(1000 + Math.random() * 9000)
      });

      const createdOrder = await order.save();
      memoryOrders.unshift(createdOrder.toObject());
      return res.status(201).json(createdOrder);
    } catch (dbErr) {
      const memOrder = {
        _id: 'ord_' + Date.now(),
        orderNumber,
        customerInfo: customerInfo || {
          name: req.user ? req.user.name : 'Valued Patron',
          email: req.user ? req.user.email : 'patron@example.com',
          phone: '+92 300 0000000'
        },
        orderItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
        isPaid: true,
        paidAt: new Date().toISOString(),
        orderStatus: 'Processing',
        trackingNumber: 'BWC-EXP-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString()
      };
      memoryOrders.unshift(memOrder);
      return res.status(201).json(memOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      if (orders.length > 0) return res.json(orders);
    } catch (dbErr) {}

    const myMems = memoryOrders.filter(o => o.user === req.user._id || o.customerInfo?.email === req.user.email);
    res.json(myMems.length > 0 ? myMems : memoryOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (order) return res.json(order);
    } catch (dbErr) {}

    const memOrder = memoryOrders.find(o => o._id === id || o.orderNumber === id);
    if (memOrder) return res.json(memOrder);

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      if (orders.length > 0) return res.json(orders);
    } catch (dbErr) {}

    res.json(memoryOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber } = req.body;

    try {
      const updated = await Order.findByIdAndUpdate(
        id,
        { orderStatus, trackingNumber },
        { new: true }
      );
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const index = memoryOrders.findIndex(o => o._id === id || o.orderNumber === id);
    if (index !== -1) {
      memoryOrders[index].orderStatus = orderStatus || memoryOrders[index].orderStatus;
      if (trackingNumber) memoryOrders[index].trackingNumber = trackingNumber;
      return res.json(memoryOrders[index]);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
