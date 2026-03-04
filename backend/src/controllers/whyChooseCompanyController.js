import WhyChooseCompany from "../models/WhyChooseCompany.js";

export const getWhyChooseCompany = async (req, res) => {
    try {
        const whyChooseCompany = await WhyChooseCompany.find().select("benefits whyChooseUs");
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const createWhyChooseCompany = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.create(req.body);
        res.status(201).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateWhyChooseCompany = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteWhyChooseCompany = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const whyChooseCompany = await WhyChooseCompany.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(whyChooseCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
