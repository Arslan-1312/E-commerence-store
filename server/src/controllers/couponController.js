import { Coupon } from '../models/Coupon.js';

export const memoryCoupons = [
  {
    _id: 'cpn_1',
    code: 'LUXURY10',
    discountType: 'percentage',
    discountAmount: 10,
    minOrderAmount: 100,
    isActive: true,
    expirationDate: '2027-12-31'
  },
  {
    _id: 'cpn_2',
    code: 'BWCROYAL',
    discountType: 'fixed',
    discountAmount: 50,
    minOrderAmount: 250,
    isActive: true,
    expirationDate: '2027-12-31'
  }
];

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount = 0 } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const cleanCode = code.toUpperCase().trim();

    try {
      const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
      if (coupon) {
        if (orderAmount < coupon.minOrderAmount) {
          return res.status(400).json({
            message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon.`
          });
        }
        return res.json(coupon);
      }
    } catch (dbErr) {}

    const memCoupon = memoryCoupons.find(c => c.code === cleanCode && c.isActive);
    if (memCoupon) {
      if (orderAmount < memCoupon.minOrderAmount) {
        return res.status(400).json({
          message: `Minimum order amount of $${memCoupon.minOrderAmount} required for coupon ${cleanCode}.`
        });
      }
      return res.json(memCoupon);
    }

    res.status(404).json({ message: 'Invalid or expired coupon code' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
