import CategoryNew from "../models/CategoryNews.js";
import AuditLog from "../models/AuditLog.js";

export const getCategoryNews = async (req, res) => {
    try {
        const categoryNew = await CategoryNew.find({ status: "active", isDeleted: false })
            .sort({ displayOrder: 1, createdAt: 1 })
            .select("name slug status name_en")
            .lean();
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategoryNewsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalCategoryNew = await CategoryNew.countDocuments({ isDeleted: false });
        const categoryNew = await CategoryNew.find({ isDeleted: false })
            .sort({ displayOrder: 1, createdAt: 1 })
            .select("name slug status name_en")
            .skip(skip)
            .limit(limit)
            .lean();
        res.status(200).json({
            categoryNew,
            totalPages: Math.ceil(totalCategoryNew / limit),
            currentPage: page,
            totalCategoryNew
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategoryNewsForManageForm = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const categoryNew = await CategoryNew.find({})
            .sort({ displayOrder: 1, createdAt: 1 })
            .select("name slug status name_en isDeleted")
            .lean();
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const searchCategoryNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalCategoryNew = await CategoryNew.countDocuments({
            name: { $regex: req.params.name, $options: "i" },
            isDeleted: false
        });
        const categoryNew = await CategoryNew.find({
            name: { $regex: req.params.name, $options: "i" },
            isDeleted: false
        })
            .sort({ displayOrder: 1, createdAt: 1 })
            .select("name slug status name_en")
            .skip(skip)
            .limit(limit)
            .lean();
        res.status(200).json({
            categoryNew,
            totalPages: Math.ceil(totalCategoryNew / limit),
            currentPage: page,
            totalCategoryNew
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createCategoryNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, slug, status, name_en } = req.body;
        const existingProduct = await CategoryNew.findOne({ slug, isDeleted: false });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const categoryNew = await CategoryNew.create({ name, slug, status, name_en });
        await AuditLog.create({
            action: "create",
            module: "Danh mục tin tức",
            recordId: categoryNew._id,
            recordName: categoryNew.name,
            userId: req.user.id,
        });
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategoryNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, slug, status, name_en } = req.body;
        const existingProduct = await CategoryNew.findOne({ slug, isDeleted: false, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const oldData = await CategoryNew.findById(req.params.id);
        const categoryNew = await CategoryNew.findByIdAndUpdate(
            req.params.id, { name, slug, status, name_en }, { new: true }
        );
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

        const oldDataObj = oldData.toObject();
        const oldValues = {};
        const newValues = {};
        const updateFields = ["name", "name_en", "slug", "status"];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                const oldValClean = JSON.stringify(cleanForCompare(oldDataObj[field]));
                const newValClean = JSON.stringify(cleanForCompare(req.body[field]));

                if (oldValClean !== newValClean) {
                    oldValues[field] = cleanForCompare(oldDataObj[field]);
                    newValues[field] = cleanForCompare(req.body[field]);
                }
            }
        });
        if (Object.keys(oldValues).length > 0) {
            await AuditLog.create({
                action: "update",
                module: "Danh mục tin tức",
                recordId: categoryNew._id,
                recordName: categoryNew.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategoryNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const categoryNew = await CategoryNew
            .findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        await AuditLog.create({
            action: "delete",
            module: "Danh mục tin tức",
            recordId: categoryNew._id,
            recordName: categoryNew.name,
            userId: req.user.id,
        });
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategoryNewsOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
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
        await CategoryNew.bulkWrite(bulkOps);
        await AuditLog.create({
            action: "update",
            module: "Danh mục tin tức",
            recordId: null,
            recordName: "Sắp xếp thứ tự danh mục tin tức",
            userId: req.user.id,
        });
        res.status(200).json({ message: "Cập nhật thứ tự thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
