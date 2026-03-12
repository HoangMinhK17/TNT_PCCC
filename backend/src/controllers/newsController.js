import News from "../models/News.js";

export const getNews = async (req, res) => {
    try {
        const news = await News.find({ status: "active", isDeleted: false }).sort({ createdAt: -1 }).
            select("name date title image slug ").populate("categoryNewsId", "name");
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalNews = await News.countDocuments({ isDeleted: false });
        const news = await News.find({ isDeleted: false }).sort({ createdAt: -1 }).
            select("name date title image slug description status").populate("categoryNewsId", "name").skip(skip).limit(limit);
        res.status(200).json({
            news,
            totalPages: Math.ceil(totalNews / limit),
            currentPage: page
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

   
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateNews = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
    
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
            
        const news = await News.findOne(query).select("name date title image description content slug ").populate("categoryNewsId", "name");
        
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
            .select("name date title image description slug ")
            .populate("categoryNewsId", "name");

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
            .select("name date title image description slug status ")
            .populate("categoryNewsId", "name");

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
            .select("name date title image description slug")
            .populate("categoryNewsId", "name");

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
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { searchTerm } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            name: { $regex: searchTerm, $options: "i" },
            isDeleted: false,
            status: "active"
        };

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name date title image slug")
            .populate("categoryNewsId", "name");

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

