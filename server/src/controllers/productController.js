import { Product } from '../models/Product.js';
import { initialProducts } from '../seeders/seedData.js';

// Memory catalog fallback store
export let memoryProducts = [...initialProducts];

export const getProducts = async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, material, sort } = req.query;

    try {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (subcategory && subcategory !== 'All') {
        query.subcategory = subcategory;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { materials: { $regex: search, $options: 'i' } }
        ];
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-low-high') sortOptions = { price: 1 };
      if (sort === 'price-high-low') sortOptions = { price: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };

      const products = await Product.find(query).sort(sortOptions);
      if (products.length > 0) {
        return res.json(products);
      }
    } catch (dbErr) {
      // Continue to memory fallback
    }

    // Memory filter algorithm
    let filtered = [...memoryProducts];

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (subcategory && subcategory !== 'All') {
      filtered = filtered.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }
    if (material) {
      filtered = filtered.filter(p => p.materials.some(m => m.toLowerCase().includes(material.toLowerCase())));
    }

    if (sort === 'price-low-high') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high-low') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    try {
      const product = await Product.findOne({ slug });
      if (product) return res.json(product);
    } catch (dbErr) {}

    const memProduct = memoryProducts.find(p => p.slug === slug || p._id === slug);
    if (memProduct) return res.json(memProduct);

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProductData = req.body;
    if (!newProductData.slug) {
      newProductData.slug = newProductData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    newProductData.sku = newProductData.sku || 'BWC-' + Date.now().toString().slice(-6);

    try {
      const created = await Product.create(newProductData);
      memoryProducts.unshift(created.toObject());
      return res.status(201).json(created);
    } catch (dbErr) {
      const memObj = {
        _id: 'prod_' + Date.now(),
        ...newProductData,
        rating: 5.0,
        numReviews: 1,
        inStock: true
      };
      memoryProducts.unshift(memObj);
      return res.status(201).json(memObj);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const index = memoryProducts.findIndex(p => p._id === id || p.slug === id);
    if (index !== -1) {
      memoryProducts[index] = { ...memoryProducts[index], ...updateData };
      return res.json(memoryProducts[index]);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Product.findByIdAndDelete(id);
    } catch (dbErr) {}

    memoryProducts = memoryProducts.filter(p => p._id !== id && p.slug !== id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
