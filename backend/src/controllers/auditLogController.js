import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";

const getAuditLogs = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchFilter = {};
        if (req.query.action) {
            matchFilter.action = req.query.action;
        }
        if (req.query.module) {
            matchFilter.module = req.query.module;
        }
        if (req.query.startDate || req.query.endDate) {
            matchFilter.createdAt = {};
            if (req.query.startDate) matchFilter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) matchFilter.createdAt.$lte = new Date(req.query.endDate);
        }

        if (req.query.search) {
            const keyword = req.query.search.trim();
            const regex = new RegExp(keyword, "i");
            const matchedUsers = await User.find({
                $or: [{ name: regex }, { email: regex }]
            }).select("_id").lean();
            const matchedIds = matchedUsers.map(u => u._id);
            matchFilter.userId = { $in: matchedIds };
        }

        const totalAuditLogs = await AuditLog.countDocuments(matchFilter);
        const auditLogs = await AuditLog.find(matchFilter)
            .sort({ createdAt: -1 })
            .select("action module recordName userId oldValues newValues createdAt")
            .populate({
                path: "userId",
                select: "name email"
            })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            auditLogs,
            totalPages: Math.ceil(totalAuditLogs / limit),
            currentPage: page,
            totalAuditLogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getModulFilter = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const modules = await AuditLog.distinct("module");
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getActionFilter = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const actions = await AuditLog.distinct("action");
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAuditLogs, getModulFilter, getActionFilter };