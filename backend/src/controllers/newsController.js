import News from "../models/News.js";
import AuditLog from "../models/AuditLog.js";

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
        const { name, name_en, slug, title, title_en, description, description_en, 
            image, date, status, categoryNewsId } = req.body;
        const existingProduct = await News.findOne({ slug, isDeleted: false });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const news = await News.create({ name, name_en, slug, title, title_en, description,
             description_en, image, date, status, categoryNewsId });
        await AuditLog.create({
            action: "create",
            module: "Tin tức",
            recordId: news._id,
            recordName: news.name,
            userId: req.user.id,
        });
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
        const { name, name_en, slug, title, title_en, description, description_en, image, date,
            status, categoryNewsId } = req.body;
        const existingProduct = await News.findOne({ slug, isDeleted: false, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const oldData = await News.findById(req.params.id);
        const news = await News.findByIdAndUpdate(req.params.id, {
            name, name_en, slug, title,
            title_en, description, description_en, image, date, status, categoryNewsId
        },
            { new: true });
        const cleanForCompare = (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === "string") {
                const trimmed = val.trim();
                if (trimmed === "" || trimmed === "<p><br></p>") return null;
                return trimmed.replace(/\r\n/g, '\n');
            }
            if (typeof val === "boolean") return val;
            if (typeof val === "number") return val;
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
        const updateFields = ["name", "name_en", "slug", "title", "title_en", "description",
            "description_en", "image", "date", "status", "categoryNewsId"];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                const oldValClean = JSON.stringify(cleanForCompare(oldDataObj[field]));
                const newValClean = JSON.stringify(cleanForCompare(req.body[field]));

                if (oldValClean !== newValClean) {
                    if (["description", "description_en"].includes(field)) {
                        oldValues[field] = "Đã thay đổi nội dung";
                        newValues[field] = "Đã cập nhật nội dung mới";
                    } else {
                        oldValues[field] = cleanForCompare(oldDataObj[field]);
                        newValues[field] = cleanForCompare(req.body[field]);
                    }
                }
            }
        });

        if (Object.keys(oldValues).length > 0) {
            await AuditLog.create({
                action: "update",
                module: "Tin tức",
                recordId: news._id,
                recordName: news.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
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
        await AuditLog.create({
            action: "delete",
            module: "Tin tức",
            recordId: news._id,
            recordName: news.name,
            userId: req.user.id,
        });
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

