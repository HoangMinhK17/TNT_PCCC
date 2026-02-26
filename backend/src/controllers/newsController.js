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

export const createNews = async (req, res) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}

export const getNewsById = async (req, res) => {
    try {
        const news = await News.findOne({ _id: req.params.id, status: "active", isDeleted: false }).select("name date title image description content slug ").populate("categoryNewsId", "name");
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

export const getNewsByName = async (req, res) => {
    try {
        const { name } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            name: { $regex: name, $options: "i" },
            status: "active",
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
        const { searchTerm } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            name: { $regex: searchTerm, $options: "i" },
            status: "active",
            isDeleted: false
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

