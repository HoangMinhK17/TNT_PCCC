import CategoryNew from "../models/CategoryNews.js";

export const getCategoryNews = async (req, res) => {
    try {
        const categoryNew = await CategoryNew.find({ status: "active", isDeleted: false }).sort({ createdAt: -1 }).select("name slug status");
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createCategoryNews = async (req, res) => {
    try {

        const categoryNew = await CategoryNew.create(req.body);
        res.status(201).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategoryNews = async (req, res) => {
    try {
        const categoryNew = await CategoryNew.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategoryNews = async (req, res) => {
    try {
        const categoryNew = await CategoryNew.findByIdAndDelete(req.params.id);
        res.status(200).json(categoryNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
