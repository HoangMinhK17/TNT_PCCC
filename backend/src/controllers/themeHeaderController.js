import ThemeHeader from "../models/ThemeHeader.js";

export const getThemeHeader = async (req, res) => {
    try {
        const themeHeader = await ThemeHeader.findOne();
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
        const themeHeader = await ThemeHeader.findByIdAndUpdate(req.params.id, req.body, { new: true });
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