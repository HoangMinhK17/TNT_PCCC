import AuditLog from "../models/AuditLog.js";

const getAuditLogs = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalAuditLogs = await AuditLog.countDocuments();
        const auditLogs = await AuditLog.find()
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

const getAuditLogsByUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalAuditLogs = await AuditLog.countDocuments({ userId: req.user._id });
        const auditLogs = await AuditLog.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select("action module recordId userId oldValues newValues createdAt")
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

const getAuditLogsByModule = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalAuditLogs = await AuditLog.countDocuments({ module: req.params.module });
        const auditLogs = await AuditLog.find({ module: req.params.module })
            .sort({ createdAt: -1 })
            .select("action module recordId userId oldValues newValues createdAt")
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

export { getAuditLogs, getAuditLogsByUser, getAuditLogsByModule };