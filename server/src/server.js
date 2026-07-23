import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { Product } from './models/Product.js';
import { initialProducts } from './seeders/seedData.js';

dotenv.config();

const app = express();

// Security & Utility Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Bint-e-Waheed Collection Luxury API Server',
    timestamp: new Date().toISOString()
  });
});

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize DB & Seed Data
connectDB().then(async (connected) => {
  if (connected) {
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[Seed] Database empty. Populating Bint-e-Waheed Collection products...');
        await Product.insertMany(initialProducts);
        console.log('[Seed] 8 Luxury Handmade Jewelry & Bag items seeded successfully!');
      }
    } catch (e) {
      console.warn('[Seed Warning] DB insert skipped:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`👑 BINT-E-WAHEED COLLECTION API SERVER READY`);
    console.log(`📍 Endpoint: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
});
