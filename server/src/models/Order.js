import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        selectedColor: { type: String, default: '' },
        selectedMaterial: { type: String, default: '' }
      }
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Pakistan' }
    },
    shippingMethod: { type: String, default: 'Express Luxury Delivery' },
    paymentMethod: { type: String, default: 'Stripe Credit Card / Digital Wallet' },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Handcrafting', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    trackingNumber: { type: String, default: '' },
    estimatedDelivery: { type: String, default: '3-5 Business Days' }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
