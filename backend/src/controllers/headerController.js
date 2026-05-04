import Header from "../models/Header.js";
import AuditLog from "../models/AuditLog.js";

export const createHeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const header = await Header.create(req.body);
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllHeader = async (req, res) => {
    try {
        const header = await Header.find({ status: "active" }).lean();
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllHeaderForShowHome = async (req, res) => {
    try {
        const header = await Header.find({ show_home: "active" }).lean();
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateHeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const oldData = await Header.findById(req.params.id).lean();
        const allowUpdateField = ["name_en", "name_vn", "status", "show_home"];
        const oldValues = {};
        const newValues = {};
        const stripMongoIds = (val) => {
            if (Array.isArray(val)) return val.map(stripMongoIds);
            if (val && typeof val === 'object') {
                const { _id, __v, ...rest } = val;
                return Object.fromEntries(Object.entries(rest)
                    .map(([k, v]) => [k, stripMongoIds(v)]));
            }
            return val;
        };
        for (const field of allowUpdateField) {
            if (req.body[field] !== undefined) {
                const isEqual = JSON.stringify(stripMongoIds(oldData[field]))
                    === JSON.stringify(req.body[field]);
                if (!isEqual) {
                    oldValues[field] = oldData[field];
                    newValues[field] = req.body[field];
                }
            }
        }
        const header = await Header.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (Object.keys(newValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: req.params.id,
                recordName: "Quản lý Header",
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllForManagement = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Header.countDocuments();

        const header = await Header.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        res.status(200).json({
            header,
            total,
            totalPage: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const findHeaderByName = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const name = req.params.name?.trim() || "";

        const query = {
            $or: [
                { name_en: { $regex: name, $options: "i" } },
                { name_vn: { $regex: name, $options: "i" } }
            ]
        };

        const total = await Header.countDocuments(query);
        const header = await Header.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            header,
            total,
            totalPage: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


