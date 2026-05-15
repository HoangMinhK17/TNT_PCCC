import Partner from "../models/Partner.js";
import AuditLog from "../models/AuditLog.js";

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({ status: "active", isDeleted: false })
            .sort({ createdAt: -1 })
            .select("name image")
            .lean();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPartner = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const partner = new Partner(req.body);
        await partner.save();
        const auditLog = new AuditLog({
            module: "Đối tác",
            action: "create",
            recordId: partner._id,
            recordName: partner.name,
            userId: req.user.id
        });
        await auditLog.save();
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePartner = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldData = await Partner.findById(req.params.id);
        const allowUpdateField = ["name", "image", "status"];
        const updatedData = {};
        const oldValues = {};
        const newValues = {};
        for (const field of allowUpdateField) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
                if (oldData[field] !== req.body[field]) {
                    oldValues[field] = oldData[field];
                    newValues[field] = req.body[field];
                }
            }
        }
        const partner = await Partner.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (Object.keys(oldValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Đối tác",
                action: "update",
                recordId: partner._id,
                recordName: partner.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePartner = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const partner = await Partner.findByIdAndUpdate(req.params.id,
            { isDeleted: true },
            { new: true });
        const auditLog = new AuditLog({
            module: "Đối tác",
            action: "delete",
            recordId: partner._id,
            recordName: partner.name,
            userId: req.user.id
        });
        await auditLog.save();
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPartnersForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const partners = await Partner.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name image status")
            .lean();
        const total = await Partner.countDocuments({ isDeleted: false });
        res.status(200).json({
            partners,
            total,
            totalPage: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPartnerByName = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const partners = await Partner.find({
            name: { $regex: req.params.name, $options: "i" },
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name image status")
            .lean();
        const total = await Partner
            .countDocuments({
                name: { $regex: req.params.name, $options: "i" },
                isDeleted: false
            });
        res.status(200).json({
            partners,
            total,
            totalPage: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
