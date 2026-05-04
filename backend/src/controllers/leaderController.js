import AuditLog from "../models/AuditLog.js";
import Leader from "../models/Leader.js";

export const getAllLeaders = async (req, res) => {
    try {
        const leaders = await Leader.find({ status: "active", isDeleted: false }).lean();
        res.status(200).json(leaders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllLeadersForManagement = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const leaders = await Leader.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await Leader.countDocuments({ isDeleted: false });
        res.status(200).json({ leaders, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const findLeaderByName = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const leaders = await Leader.find({ name: { $regex: req.params.name, $options: "i" }, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await Leader.countDocuments({ name: { $regex: req.params.name, $options: "i" }, isDeleted: false });
        res.status(200).json({ leaders, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createLeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const leader = new Leader(req.body);
        await leader.save();
        await AuditLog.create({
            module: "Lãnh đạo",
            recordId: leader._id,
            recordName: leader.name,
            action: "create",
            userId: req.user.id,
        });
        res.status(200).json(leader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateLeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldData = await Leader.findById(req.params.id);
        const oldValues = {};
        const newValues = {};
        const updateFields = [
            "name", "name_en", "position", "position_en", "image"
            , "description", "description_en", "status"
        ];
        updateFields.forEach(field => {
            if (oldData[field] !== req.body[field]) {
                oldValues[field] = oldData[field];
                newValues[field] = req.body[field];
            }
        });
        const leader = await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (Object.keys(oldValues).length > 0) {
            await AuditLog.create({
                module: "Lãnh đạo",
                recordId: leader._id,
                recordName: leader.name,
                action: "update",
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
        res.status(200).json(leader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteLeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const leader = await Leader.findByIdAndUpdate(req.params.id, { isDeleted: true });
        await AuditLog.create({
            module: "Lãnh đạo",
            recordId: leader._id,
            recordName: leader.name,
            action: "delete",
            userId: req.user.id,
        });
        res.status(200).json(leader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
