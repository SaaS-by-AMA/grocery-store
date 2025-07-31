import Product from "../models/Product.js"

export const addProduct = async (req, res) => {
  try {
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch(parseErr) {
      console.log('Product data parse error:', parseErr);
      return res.status(400).json({ success: false, message: 'Invalid product data.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    // Coerce and validate types
    const imagesUrl = req.files.map(f => f.path);
    const name = productData.name;
    const description = Array.isArray(productData.description) ? productData.description : [];
    const category = productData.category;
    const price = Number(productData.price);
    const offerPrice = Number(productData.offerPrice);

    // Extra validation, optional
    if (!name || !description.length || !category || isNaN(price) || isNaN(offerPrice)) {
      return res.status(400).json({ success: false, message: 'Missing or invalid product fields.' });
    }

    const newProduct = await Product.create({
      name,
      description,
      category,
      price,
      offerPrice,
      image: imagesUrl
    });

    res.json({ success: true, message: "Product Added", product: newProduct });
  } catch (error) {
    console.dir(error, { depth: null });
    // Print Mongoose errors
    if (error.errors) {
      Object.values(error.errors).forEach(e => {
        console.log('Validation error:', e.message);
      });
    }
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Get Product : /api/product/list
export const productList = async (req, res)=>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
