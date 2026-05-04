import CategoryProduct from "../models/CategoryProduct.js";
import AuditLog from "../models/AuditLog.js";

const getCategoryProducts = async (req, res) => {
    try {
        const categoryProducts = await CategoryProduct.find({ isDeleted: false, status: "active" })
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(categoryProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryProductForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalCategoryProduct = await CategoryProduct.countDocuments({ isDeleted: false });
        const categoryProducts = await CategoryProduct.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        res.status(200).json({
            categoryProducts,
            totalPages: Math.ceil(totalCategoryProduct / limit),
            totalCategoryProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategoryProduct = async (req, res) => {
    try {
        const { name, name_en, slug } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (slug) {
            const categoryProduct = await CategoryProduct.findOne({ slug: slug, isDeleted: false });
            if (categoryProduct) {
                return res.status(400).json({ message: "Slug already exists" });
            }
        }
        const categoryProduct = await CategoryProduct.create({ name, name_en, slug });
        await AuditLog.create({
            action: "create",
            module: "Danh mục sản phẩm",
            recordId: categoryProduct._id,
            recordName: categoryProduct.name,
            userId: req.user.id,
        });
        return res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategoryProduct = async (req, res) => {
    try {
        const { name, name_en, slug, status } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existingProduct = await CategoryProduct.findOne({ slug, isDeleted: false, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const oldCategoryProduct = await CategoryProduct.findById(req.params.id);

        const allowedFields = ["name", "name_en", "slug", "status"];

        const oldValues = {};
        const newValues = {};

        allowedFields.forEach(field => {
            if (
                req.body[field] !== undefined &&
                req.body[field] !== oldCategoryProduct[field]
            ) {
                oldValues[field] = oldCategoryProduct[field];
                newValues[field] = req.body[field];
            }
        });
        const categoryProduct = await CategoryProduct
            .findByIdAndUpdate(req.params.id, { name, name_en, slug, status }, { new: true });
        if (Object.keys(oldValues).length > 0) {
            await AuditLog.create({
                action: "update",
                module: "Danh mục sản phẩm",
                recordId: categoryProduct._id,
                recordName: categoryProduct.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
        return res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategoryProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const categoryProduct = await CategoryProduct
            .findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        await AuditLog.create({
            action: "delete",
            module: "Danh mục sản phẩm",
            recordId: categoryProduct._id,
            recordName: categoryProduct.name,
            userId: req.user.id
        });
        return res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryProductById = async (req, res) => {
    try {
        const categoryProduct = await CategoryProduct.findById(req.params.id).lean();
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryProductBySearch = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { searchTerm } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalCategoryProduct = await CategoryProduct
            .countDocuments({ name: { $regex: searchTerm, $options: "i" }, isDeleted: false });
        const categoryProduct = await CategoryProduct
            .find({ name: { $regex: searchTerm, $options: "i" }, isDeleted: false })
            .sort({ createdAt: -1 })
            .select("name slug status")
            .skip(skip)
            .limit(limit)
            .lean();
        res.status(200).json({
            categoryProduct,
            totalPages: Math.ceil(totalCategoryProduct / limit),
            totalCategoryProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getCategoryProducts, getCategoryProductForManage, createCategoryProduct,
    updateCategoryProduct, deleteCategoryProduct, getCategoryProductById,
    getCategoryProductBySearch
};