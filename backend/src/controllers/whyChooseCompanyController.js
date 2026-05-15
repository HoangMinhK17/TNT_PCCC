import WhyChooseCompany from "../models/WhyChooseCompany.js";

export const getWhyChooseCompany = async (req, res) => {
    try {
        const whyChooseCompany = await WhyChooseCompany.find({ status: "active", isDeleted: false })
            .select("benefits whyChooseUs")
            .sort({ createdAt: -1 });
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createWhyChooseCompany = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.create(req.body);
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateWhyChooseCompany = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.findByIdAndUpdate(
            req.params.id, req.body, { new: true });
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteWhyChooseCompany = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.findByIdAndUpdate(
            req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getWhyChooseCompanyForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.find({ isDeleted: false })
            .select("benefits whyChooseUs status")
            .sort({ createdAt: -1 });
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

