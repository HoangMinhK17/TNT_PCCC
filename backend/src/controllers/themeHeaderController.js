import ThemeHeader from "../models/ThemeHeader.js";
import AuditLog from "../models/AuditLog.js";

export const getThemeHeader = async (req, res) => {
    try {
        const themeHeader = await ThemeHeader.findOne().lean();
        res.status(200).json(themeHeader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateThemeHeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const oldThemeHeader = await ThemeHeader.findById(req.params.id);
        const allowedFields = [
            "background_color", "text_color", "text_size"
        ];

        const oldUpdateValues = {};
        const newUpdateValues = {};

        allowedFields.forEach(field => {
            if (oldThemeHeader[field] !== req.body[field]) {
                oldUpdateValues[field] = oldThemeHeader[field];
                newUpdateValues[field] = req.body[field];
            }
        });

        const themeHeader = await ThemeHeader.findByIdAndUpdate(req.params.id,
            req.body, { new: true });

        if (Object.keys(newUpdateValues).length > 0) {
            await AuditLog.create({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: req.params.id,
                recordName: "Cấu hình theme header",
                userId: req.user.id,
                oldValues: oldUpdateValues,
                newValues: newUpdateValues,
            });
        }
        res.status(200).json(themeHeader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createThemeHeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const themeHeader = await ThemeHeader.create(req.body);
        res.status(200).json(themeHeader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}