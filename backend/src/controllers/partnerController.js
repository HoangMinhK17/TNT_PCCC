import Partner from "../models/Partner.js";

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({ status: "active", isDeleted: false }).select("name image");
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPartner = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const partner = new Partner(req.body);
        await partner.save();
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePartner = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePartner = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const partner = await Partner.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPartnersForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const partners = await Partner.find({ isDeleted: false }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("name image status");
        const total = await Partner.countDocuments({ isDeleted: false });
        res.status(200).json({ partners, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPartnerByName = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const partners = await Partner.find({ name: { $regex: req.params.name, $options: "i" }, isDeleted: false }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("name image status");
        const total = await Partner.countDocuments({ name: { $regex: req.params.name, $options: "i" }, isDeleted: false });
        res.status(200).json({ partners, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
