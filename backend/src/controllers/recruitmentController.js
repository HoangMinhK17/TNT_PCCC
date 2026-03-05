import Recruitment from "../models/Recruitment.js";

export const getRecruiments = async (req, res) => {
    try {
        const recruiments = await Recruitment.find({ status: "active", isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json(recruiments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRecruiment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const recruiment = new Recruitment(req.body);
        await recruiment.save();
        res.status(201).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRecruiment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const recruiment = await Recruitment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRecruiment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const recruiment = await Recruitment.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecruimentsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRecruiments = await Recruitment.countDocuments({ isDeleted: false });
        const recruiments = await Recruitment.find({ isDeleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });
        res.status(200).json({
            recruiments,
            totalRecruiments,
            totalPages: Math.ceil(totalRecruiments / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecruimentsByName = async (req, res) => {
    try {
        const name = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRecruiments = await Recruitment.countDocuments({ name: { $regex: name, $options: "i" }, isDeleted: false });
        const recruiments = await Recruitment.find({ name: { $regex: name, $options: "i" }, isDeleted: false }).skip(skip).limit(limit);
        res.status(200).json({
            recruiments,
            totalRecruiments,
            totalPages: Math.ceil(totalRecruiments / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

