import AuditLog from "../models/AuditLog.js";
import Information from "../models/Information.js";

const getInformation = async (req, res) => {
    try {
        const information = await Information.find()
            .select("name title phone address email  timeWork")
            .lean();
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getImageInformation = async (req, res) => {
    try {
        const information = await Information.find()
            .select("name backgroundImage logo favicon")
            .lean();
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getContactInformation = async (req, res) => {
    try {
        const information = await Information.find()
            .select("socialLinks chatConfig")
            .lean();
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.find().lean();
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.create(req.body);
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldData = await Information.findById(req.params.id).lean();
        const allowUpdateField = ["name", "title", "phone", "address", "email", "timeWork"];
        const updatedData = {};
        const oldValues = {};
        const newValues = {};
        for (const field of allowUpdateField) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
                const isEqual = JSON.stringify(oldData[field]) === JSON.stringify(req.body[field]);
                if (!isEqual) {
                    oldValues[field] = oldData[field];
                    newValues[field] = req.body[field];
                }
            }
        }
        const information = await Information.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            title: req.body.title,
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
            timeWork: req.body.timeWork
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }
        if (Object.keys(newValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: information._id,
                recordName: "Thông tin chung",
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const upadateImageInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldData = await Information.findById(req.params.id).lean();
        const allowUpdateField = ["name", "backgroundImage", "logo", "favicon"];
        const updatedData = {};
        const oldValues = {};
        const newValues = {};
        for (const field of allowUpdateField) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
                const isEqual = JSON.stringify(oldData[field]) === JSON.stringify(req.body[field]);
                if (!isEqual) {
                    oldValues[field] = oldData[field];
                    newValues[field] = req.body[field];
                }
            }
        }
        const information = await Information.findByIdAndUpdate(req.params.id, {
            backgroundImage: req.body.backgroundImage,
            logo: req.body.logo,
            favicon: req.body.favicon
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }
        if (Object.keys(newValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: information._id,
                recordName: "Logo & Banner",
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateContactInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldData = await Information.findById(req.params.id).lean();
        const allowUpdateField = ["socialLinks"];
        const oldValues = {};
        const newValues = {};

        const stripMongoIds = (val) => {
            if (Array.isArray(val)) return val.map(stripMongoIds);
            if (val && typeof val === 'object') {
                const { _id, __v, ...rest } = val;
                return Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, stripMongoIds(v)]));
            }
            return val;
        };

        for (const field of allowUpdateField) {
            if (req.body[field] !== undefined) {
                const isEqual = JSON.stringify(stripMongoIds(oldData[field])) === JSON.stringify(req.body[field]);
                if (!isEqual) {
                    oldValues[field] = oldData[field];
                    newValues[field] = req.body[field];
                }
            }
        }

        const information = await Information.findByIdAndUpdate(req.params.id, {
            socialLinks: req.body.socialLinks
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }

        if (Object.keys(newValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: req.params.id,
                recordName: "Mạng xã hội",
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }

        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateChatConfig = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldData = await Information.findById(req.params.id).lean();
        const allowUpdateField = ["chatConfig"];
        const oldValues = {};
        const newValues = {};

        const normalizeForCompare = (val) => {
            if (Array.isArray(val)) return val.map(normalizeForCompare);
            if (val && typeof val === 'object') {
                const { _id, __v, ...rest } = val;
                const sortedKeys = Object.keys(rest).sort();
                const result = {};
                for (const k of sortedKeys) {
                    result[k] = normalizeForCompare(rest[k]);
                }
                return result;
            }
            return val;
        };

        const getDiff = (oldObj, newObj, prefix) => {
            const keys = new Set([
                ...Object.keys(oldObj || {}).filter(k => k !== '_id' && k !== '__v'),
                ...Object.keys(newObj || {}).filter(k => k !== '_id' && k !== '__v')
            ]);

            for (const key of keys) {
                const oldVal = oldObj ? oldObj[key] : undefined;
                const newVal = newObj ? newObj[key] : undefined;
                const path = prefix ? `${prefix}.${key}` : key;

                if (oldVal && newVal && typeof oldVal === 'object' && typeof newVal === 'object'
                    && !Array.isArray(oldVal) && !Array.isArray(newVal)) {
                    getDiff(oldVal, newVal, path);
                } else {
                    const isEqual = JSON.stringify(normalizeForCompare(oldVal))
                        === JSON.stringify(normalizeForCompare(newVal));
                    if (!isEqual) {
                        oldValues[path] = oldVal;
                        newValues[path] = newVal;
                    }
                }
            }
        };

        if (req.body.chatConfig !== undefined) {
            getDiff(oldData.chatConfig || {}, req.body.chatConfig || {}, 'chatConfig');
        }

        const information = await Information.findByIdAndUpdate(req.params.id, {
            chatConfig: req.body.chatConfig
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }

        if (Object.keys(newValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: information._id,
                recordName: "Chatbox",
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }

        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    getInformation, getImageInformation, getContactInformation
    , getAllInformation, createInformation, updateInformation
    , upadateImageInformation, updateContactInformation, updateChatConfig
};