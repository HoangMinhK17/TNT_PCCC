import WhyChooseService from "../models/WhyChooseService.js";

export const createWhyChooseService = async (req, res) => {
    try {
        const { title, description, icon } = req.body;
        const whyChooseService = new WhyChooseService({ title, description, icon });
        await whyChooseService.save();
        res.status(201).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWhyChooseService = async (req, res) => {
    try {
        const whyChooseService = await WhyChooseService.find({ isDeleted: false }).select("title description icon");
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateWhyChooseService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon } = req.body;
        const whyChooseService = await WhyChooseService.findByIdAndUpdate(id, { title, description, icon }, { new: true });
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteWhyChooseService = async (req, res) => {
    try {
        const { id } = req.params;
        const whyChooseService = await WhyChooseService.findByIdAndDelete(id);
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};