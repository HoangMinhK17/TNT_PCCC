import Product from "../models/Product.js";

const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false, status: "active" })
            .sort({ createdAt: -1 })
            .select("name name_en title title_en image slug status")
            .populate({ path: "categoryId", select: "name_en name slug status", match: { status: "active" } })
            .lean();

        const filteredProducts = products.filter(p => p.categoryId !== null);
        res.status(200).json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, categoryId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { isDeleted: false };
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (categoryId && categoryId !== "null" && categoryId !== "undefined") {
            filter.categoryId = categoryId;
        }

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate({ path: "categoryId", select: "name slug status" })
            .skip(skip)
            .limit(limit)
            .lean();

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

const createProduct = async (req, res) => {
    try {
        const { name, name_en, title, title_en, description, description_en, image, technical, technical_en, categoryId, slug, status } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }

        const product = await Product.create({ name, name_en, title, title_en, description, description_en, image, technical, technical_en, categoryId, slug, status });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, name_en, title, title_en, description, description_en, image, technical, technical_en, categoryId, slug, status } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existingProduct = await Product.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, { name, name_en, title, title_en, description, description_en, image, technical, technical_en, categoryId, slug, status }, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const mongoose = await import('mongoose');
        const query = mongoose.isValidObjectId(id)
            ? { $or: [{ _id: id }, { slug: id }], isDeleted: false }
            : { slug: id, isDeleted: false };

        const product = await Product.findOne(query).populate({ path: "categoryId", select: "name slug name_en" });

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

        const filter = { categoryId: req.params.categoryId, isDeleted: false, status: "active" };
        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug name_en" })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

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

const getProductByCategoryIdForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { categoryId: req.params.categoryId, isDeleted: false };
        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug name_en" })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

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
            $or: [
                { name: { $regex: name, $options: "i" } },
                { name_en: { $regex: name, $options: "i" } }
            ],
            isDeleted: false,
            status: "active"
        };

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug name_en" })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

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

const getProductByNameForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const name = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            name: { $regex: name, $options: "i" },
            isDeleted: false,
        };

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug" })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

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

export { getPublicProducts, createProduct, updateProduct, deleteProduct, getPublicProductById, getPublicProductByCategoryId, getProductByName, getProductForManage, getProductByCategoryIdForManage, getProductByNameForManage };    