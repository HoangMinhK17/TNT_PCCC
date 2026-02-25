import Product from "../models/Product.js";

const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false })
            .select("name title  image slug")
            .populate({ path: "categoryId", select: "name slug" });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, title, description, image, technical, categoryId, slug, status } = req.body;
        const product = await Product.create({ name, title, description, image, technical, categoryId, slug, status });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, title, description, image, technical, categoryId, slug, status } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, { name, title, description, image, technical, categoryId, slug, status }, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).where({ isDeleted: false }).populate({ path: "categoryId", select: "name slug" });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicProductByCategoryId = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { categoryId: req.params.categoryId, isDeleted: false };
        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug" })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductByName = async (req, res) => {
    try {
        const name = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            name: { $regex: name, $options: "i" },
            isDeleted: false
        };

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug" })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getPublicProducts, createProduct, updateProduct, deleteProduct, getPublicProductById, getPublicProductByCategoryId, getProductByName };    