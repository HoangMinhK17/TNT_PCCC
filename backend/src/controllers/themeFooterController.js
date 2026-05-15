import ThemeFooter from "../models/ThemeFooter.js";
import AuditLog from "../models/AuditLog.js";

const getThemeFooter = async (req, res) => {
    try {
        const themeFooter = await ThemeFooter.findOne().lean();
        res.status(200).json(themeFooter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateThemeFooter = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const { id } = req.params;
        const oldData = await ThemeFooter.findById(id).lean();
        const allowUpdateField = [
            "background_color", "text_title", "text_p", "text_a",
            "contact_text", "icon_color"
        ];
        const oldValues = {};
        const newValues = {};
        for (const field of allowUpdateField) {
            if (req.body[field] !== undefined) {
                const isEqual = JSON.stringify(oldData[field]) === JSON.stringify(req.body[field]);
                if (!isEqual) {
                    oldValues[field] = oldData[field];
                    newValues[field] = req.body[field];
                }
            }
        }
        const themeFooter = await ThemeFooter.findByIdAndUpdate(id, req.body, { new: true });
        if (Object.keys(newValues).length > 0) {
            await AuditLog.create({
                module: "Cấu hình hệ thống",
                action: "update",
                recordId: id,
                recordName: "Cấu hình theme footer",
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
        res.status(200).json(themeFooter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const createThemeFooter = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const themeFooter = await ThemeFooter.create(req.body);
        res.status(200).json(themeFooter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getThemeFooter, updateThemeFooter, createThemeFooter };