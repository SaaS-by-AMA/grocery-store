// controllers/productController.js
import Product from "../models/Product.js";
import mongoose from "mongoose";
import slugify from "slugify";


 
export const addProduct = async (req, res) => {
  try {
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (parseErr) {
      console.log('Product data parse error:', parseErr);
      return res.status(400).json({ success: false, message: 'Invalid product data.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const imagesUrl = req.files.map(f => f.path);
    const name = (productData.name || "").trim();
    const description = Array.isArray(productData.description) ? productData.description : [];
    const category = productData.category;
    const price = Number(productData.price);
    const offerPrice = Number(productData.offerPrice);

    if (!name || description.length === 0 || !category || isNaN(price) || isNaN(offerPrice)) {
      return res.status(400).json({ success: false, message: 'Missing or invalid product fields.' });
    }

    const newProduct = await Product.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      category,
      price,
      offerPrice,
      image: imagesUrl,
      inStock: true
    });

    res.json({ success: true, message: "Product Added", product: newProduct });
  } catch (error) {
    console.dir(error, { depth: null });
    if (error.errors) {
      Object.values(error.errors).forEach(e => {
        console.log('Validation error:', e.message);
      });
    }
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


// Get Product : /api/product/list
export const productList = async (req, res)=> {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get single Product : /api/product/id
export const productById = async (req, res)=> {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Missing id" });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=> {
  try {
    const { id, inStock } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Missing id" });
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, message: "Missing product id" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const updates = {};
    const allowed = ['name', 'category', 'price', 'offerPrice', 'inStock', 'description'];

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.name) updates.slug = slugify(String(updates.name), { lower: true, strict: true });
    if (updates.price != null && Number(updates.price) < 0) return res.status(422).json({ success: false, message: "Price must be >= 0" });
    if (updates.offerPrice != null && Number(updates.offerPrice) < 0) return res.status(422).json({ success: false, message: "Offer price must be >= 0" });

    const updated = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true });
    res.json({ success: true, message: "Product updated", product: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, message: "Missing product id" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
