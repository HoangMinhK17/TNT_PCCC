import ThemeFooter from "../models/ThemeFooter.js";

const getThemeFooter = async (req, res) => {
    try {
        const themeFooter = await ThemeFooter.findOne();
        res.status(200).json(themeFooter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateThemeFooter = async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        const themeFooter = await ThemeFooter.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(themeFooter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const createThemeFooter = async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const themeFooter = await ThemeFooter.create(req.body);
        res.status(201).json(themeFooter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getThemeFooter, updateThemeFooter, createThemeFooter };