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

export { getAuditLogs };