import AuditLog from "../models/AuditLog.js";
import CategoryProduct from "../models/CategoryProduct.js";
import Product from "../models/Product.js";

const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false, status: "active" })
            .sort({ displayOrder: 1, createdAt: 1 })
            .select("name name_en title title_en image slug status")
            .populate({
                path: "categoryId", select: "name_en name slug status",
                match: { status: "active" }
            })
            .lean();

        const filteredProducts = products.filter(p => p.categoryId !== null);
        res.status(200).json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, categoryId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { isDeleted: false };
        if (name) {
            const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.name = { $regex: escapeRegex(name), $options: "i" };
        }
        if (categoryId && categoryId !== "null" && categoryId !== "undefined") {
            filter.categoryId = categoryId;
        }

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ displayOrder: 1, createdAt: 1 })
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
        const { name, name_en, title, title_en, description, description_en, image,
            technical, technical_en, categoryId, slug, status } = req.body;
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existingProduct = await Product.findOne({ slug, isDeleted: false });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }

        const product = await Product.create({
            name, name_en, title, title_en, description,
            description_en, image, technical, technical_en, categoryId, slug, status
        });
        await AuditLog.create({
            action: "create",
            module: "Sản phẩm",
            recordId: product._id,
            recordName: product.name,
            userId: req.user.id,
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, name_en, title, title_en, description, description_en, image,
            technical, technical_en, categoryId, slug, status } = req.body;
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existingProduct = await Product.findOne({ slug, isDeleted: false, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const oldProduct = await Product.findById(req.params.id);

        const allowedFields = ["name", "name_en", "title", "title_en", "description",
            "description_en", "image", "technical", "technical_en", "categoryId",
            "slug", "status"];
        const oldValues = {};
        const newValues = {};
        const oldProductObj = oldProduct.toObject();

        const cleanForCompare = (val) => {
            if (val === null || val === undefined) return null;
            if (Array.isArray(val)) return val.map(cleanForCompare);
            if (typeof val === 'object') {
                if (val instanceof Date) return val.toISOString();
                if (val.toString && /^[0-9a-fA-F]{24}$/.test(val.toString())) {
                    return val.toString();
                }
                const newObj = {};
                for (const key in val) {
                    if (key !== '_id' && key !== 'id') {
                        newObj[key] = cleanForCompare(val[key]);
                    }
                }
                return newObj;
            }
            return val;
        };

        const computeArrayDiff = (oldArr, newArr) => {
            const oldDiff = [];
            const newDiff = [];
            const maxLength = Math.max(oldArr.length, newArr.length);
            for (let i = 0; i < maxLength; i++) {
                const o = oldArr[i];
                const n = newArr[i];
                const cleanO = cleanForCompare(o);
                const cleanN = cleanForCompare(n);
                if (JSON.stringify(cleanO) !== JSON.stringify(cleanN)) {
                    if (o !== undefined)
                        oldDiff.push({ _index: i, ...(cleanO && typeof cleanO === 'object' ? cleanO : { value: cleanO }) });
                    if (n !== undefined)
                        newDiff.push({ _index: i, ...(cleanN && typeof cleanN === 'object' ? cleanN : { value: cleanN }) });
                }
            }
            return { oldDiff, newDiff };
        };

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'technical' || field === 'technical_en') {
                    const oldArr = Array.isArray(oldProductObj[field]) ? oldProductObj[field] : [];
                    const newArr = Array.isArray(req.body[field]) ? req.body[field] : [];
                    const { oldDiff, newDiff } = computeArrayDiff(oldArr, newArr);
                    if (oldDiff.length > 0 || newDiff.length > 0) {
                        oldValues[field] = oldDiff;
                        newValues[field] = newDiff;
                    }
                } else {
                    const oldValClean = cleanForCompare(oldProductObj[field]);
                    const newValClean = cleanForCompare(req.body[field]);

                    if (JSON.stringify(oldValClean) !== JSON.stringify(newValClean)) {
                        oldValues[field] = oldValClean;
                        newValues[field] = newValClean;
                    }
                }
            }
        });

        if ('categoryId' in oldValues || 'categoryId' in newValues) {
            if (oldValues.categoryId) {
                const oldCat = await CategoryProduct.findById(oldValues.categoryId);
                if (oldCat) oldValues.categoryId = oldCat.name;
            }
            if (newValues.categoryId) {
                const newCat = await CategoryProduct.findById(newValues.categoryId);
                if (newCat) newValues.categoryId = newCat.name;
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {
            name, name_en, title, title_en, description,
            description_en, image, technical, technical_en,
            categoryId, slug, status
        }, { new: true });
        
        if (Object.keys(oldValues).length > 0) {
            await AuditLog.create({
                action: "update",
                module: "Sản phẩm",
                recordId: product._id,
                recordName: product.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true },
            { new: true });
        await AuditLog.create({
            action: "delete",
            module: "Sản phẩm",
            recordId: product._id,
            recordName: product.name,
            userId: req.user.id,
        });
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

        const product = await Product.findOne(query)
            .populate({ path: "categoryId", select: "name slug name_en status" })
            .lean();

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

        const category = await CategoryProduct.findOne({
            _id: req.params.categoryId,
            isDeleted: false, status: "active"
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const filter = { categoryId: category._id, isDeleted: false, status: "active" };
        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({
                path: "categoryId",
                select: "name slug name_en"
            })
            .skip(skip)
            .limit(limit)
            .sort({ displayOrder: 1, createdAt: 1 })
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
        if (req.user.role !== "admin" && req.user.role !== "staff") {
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
            .sort({ displayOrder: 1, createdAt: 1 })
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
        const escapeRegex = (text) => {
            return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        };
        const name = req.params.name;
        const escapeName = escapeRegex(name);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            $or: [
                { name: { $regex: escapeName, $options: "i" } },
                { name_en: { $regex: escapeName, $options: "i" } }
            ],
            isDeleted: false,
            status: "active"
        };

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate({ path: "categoryId", select: "name slug name_en" })
            .skip(skip)
            .limit(limit)
            .sort({ displayOrder: 1, createdAt: 1 })
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
        if (req.user.role !== "admin" && req.user.role !== "staff") {
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
            .sort({ displayOrder: 1, createdAt: 1 })
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

const updateProductOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Danh sách không hợp lệ" });
        }
        const bulkOps = items.map(({ id, displayOrder }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { displayOrder } }
            }
        }));
        await Product.bulkWrite(bulkOps);
        await AuditLog.create({
            action: "update",
            module: "Sản phẩm",
            recordId: null,
            recordName: "Sắp xếp thứ tự sản phẩm",
            userId: req.user.id,
        });
        res.status(200).json({ message: "Cập nhật thứ tự thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getPublicProducts, createProduct, updateProduct, deleteProduct,
    getPublicProductById, getPublicProductByCategoryId, getProductByName,
    getProductForManage, getProductByCategoryIdForManage, getProductByNameForManage,
    updateProductOrder
};