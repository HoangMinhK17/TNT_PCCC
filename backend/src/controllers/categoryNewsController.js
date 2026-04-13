import CategoryNew from "../models/CategoryNews.js";

export const getCategoryNews = async (req, res) => {
    try {
        const categoryNew = await CategoryNew.find({ status: "active", isDeleted: false })
            .sort({ createdAt: -1 })
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
            .sort({ createdAt: -1 })
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

export const searchCategoryNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalCategoryNew = await CategoryNew.countDocuments({ name: { $regex: req.params.name, $options: "i" }, isDeleted: false });
        const categoryNew = await CategoryNew.find({ name: { $regex: req.params.name, $options: "i" }, isDeleted: false })
            .sort({ createdAt: -1 })
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
        const existingProduct = await CategoryNew.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const categoryNew = await CategoryNew.create({ name, slug, status, name_en });
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
        const existingProduct = await CategoryNew.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const categoryNew = await CategoryNew.findByIdAndUpdate(req.params.id, { name, slug, status, name_en }, { new: true });
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
        const categoryNew = await CategoryNew.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
