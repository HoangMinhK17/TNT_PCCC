import News from "../models/News.js";

export const getNews = async (req, res) => {
    try {
        const news = await News.find({ status: "active", isDeleted: false })
            .sort({ createdAt: -1 })
            .select("name name_en date title title_en image slug ")
            .populate({ path: "categoryNewsId", select: "name name_en", match: { status: "active" } })
            .lean();
        const filteredNews = news.filter(item => item.categoryNewsId !== null);
        res.status(200).json(filteredNews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, categoryNewsId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false };
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (categoryNewsId && categoryNewsId !== "null" && categoryNewsId !== "undefined") {
            filter.categoryNewsId = categoryNewsId;
        }

        const totalNews = await News.countDocuments(filter);
        const news = await News.find(filter)
            .sort({ createdAt: -1 })
            .select("name name_en date title title_en image slug description description_en status")
            .populate("categoryNewsId", "name name_en")
            .skip(skip)
            .limit(limit)
            .lean();
        res.status(200).json({
            news,
            totalPages: Math.ceil(totalNews / limit),
            currentPage: page,
            totalNews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, name_en, slug, title, title_en, description, description_en, image, date, status, categoryNewsId } = req.body;
        const existingProduct = await News.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const news = await News.create({ name, name_en, slug, title, title_en, description, description_en, image, date, status, categoryNewsId });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, name_en, slug, title, title_en, description, description_en, image, date, status, categoryNewsId } = req.body;
        const existingProduct = await News.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const news = await News.findByIdAndUpdate(req.params.id, { name, name_en, slug, title, title_en, description, description_en, image, date, status, categoryNewsId }, { new: true });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const news = await News.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsById = async (req, res) => {
    try {
        const id = req.params.id;
        const mongoose = await import('mongoose');
        const query = mongoose.isValidObjectId(id)
            ? { $or: [{ _id: id }, { slug: id }], status: "active", isDeleted: false }
            : { slug: id, status: "active", isDeleted: false };

        const news = await News.findOne(query)
            .select("name name_en date title title_en image description description_en content slug ")
            .populate("categoryNewsId", "name name_en")
            .lean();
        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsByCategoryId = async (req, res) => {
    try {
        const { categoryNewsId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { categoryNewsId, status: "active", isDeleted: false };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name name_en date title title_en image description description_en slug ")
            .populate("categoryNewsId", "name name_en")
            .lean();

        const totalNews = await News.countDocuments(query);

        res.status(200).json({
            news,
            totalPages: Math.ceil(totalNews / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsByCategoryIdAdmin = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { categoryNewsId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { categoryNewsId, isDeleted: false };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name name_en date title title_en image description description_en slug status ")
            .populate("categoryNewsId", "name name_en")
            .lean();

        const totalNews = await News.countDocuments(query);

        res.status(200).json({
            news,
            totalPages: Math.ceil(totalNews / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsByName = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            name: { $regex: name, $options: "i" },
            isDeleted: false
        };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name name_en date title title_en image description description_en slug")
            .populate("categoryNewsId", "name name_en")
            .lean();

        const totalNews = await News.countDocuments(query);

        res.status(200).json({
            news,
            totalPages: Math.ceil(totalNews / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsBySearch = async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { name_en: { $regex: searchTerm, $options: "i" } }
            ],
            isDeleted: false,
            status: "active"
        };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name name_en date title title_en image slug")
            .populate("categoryNewsId", "name name_en")
            .lean();

        const totalNews = await News.countDocuments(query);

        res.status(200).json({
            news,
            totalPages: Math.ceil(totalNews / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

