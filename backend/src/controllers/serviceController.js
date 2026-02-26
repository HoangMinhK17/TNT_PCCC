import Service from "../models/Service.js";

const getPublicServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false };
        const totalServices = await Service.countDocuments(filter);
        const services = await Service.find(filter)
            .select("name image slug title status")
            .skip(skip)
            .limit(limit);

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
        const { name, description, title, image, slug, whyChooseUs} = req.body;
        const service = await Service.create({ name, description, title, image, slug, whyChooseUs });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicServiceById = async (req, res) => {
    try {
        const service = await Service.findOne({ _id: req.params.id, isDeleted: false });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getPublicServices, createService, getPublicServiceById };

