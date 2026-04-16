import Service from "../models/Service.js";

const getPublicServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false, status: "active" };
        const totalServices = await Service.countDocuments(filter);
        const services = await Service.find(filter)
            .select("name name_en image slug title title_en status")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            services,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: page,
            totalServices
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getServicesForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false };
        const totalServices = await Service.countDocuments(filter);
        const services = await Service.find(filter)
            .select("name name_en image slug title title_en status description description_en")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            services,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: page,
            totalServices
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, name_en, description, description_en, title, title_en, image, slug, status } = req.body;
        const existingProduct = await Service.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const service = await Service.create({ name, name_en, description, description_en, title, title_en, image, slug, status });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, name_en, description, description_en, title, title_en, image, slug, status } = req.body;
        const existingProduct = await Service.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const service = await Service.findByIdAndUpdate(req.params.id, { name, name_en, description, description_en, title, title_en, image, slug, status }, { new: true });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const service = await Service.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { isDeleted: false };
        const totalServices = await Service.countDocuments(filter);
        const { name } = req.query;
        const services = await Service.find({ name: { $regex: name, $options: "i" }, isDeleted: false })
            .select("name name_en image slug title title_en status")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            services,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: page,
            totalServices
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicServiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const mongoose = await import('mongoose');
        const query = mongoose.isValidObjectId(id)
            ? { $or: [{ _id: id }, { slug: id }], isDeleted: false }
            : { slug: id, isDeleted: false };

        const service = await Service.findOne(query).lean();
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getPublicServices, createService, getPublicServiceById, updateService, deleteService, searchService, getServicesForManage };

