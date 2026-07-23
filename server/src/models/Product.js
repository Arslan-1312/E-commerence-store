import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: ['Handmade Jewelry', 'Handmade Bags', 'Limited Edition Sets', 'Artisan Accessories']
    },
    subcategory: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 10 },
    images: [{ type: String, required: true }],
    materials: [{ type: String }],
    colors: [{ name: String, hex: String }],
    description: { type: String, required: true },
    craftDetails: { type: String, required: true },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    numReviews: { type: Number, default: 12 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
