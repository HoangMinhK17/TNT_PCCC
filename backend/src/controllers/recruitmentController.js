import Recruitment from "../models/Recruitment.js";

export const getRecruiments = async (req, res) => {
    try {
        const recruiments = await Recruitment.find({ status: "active"});
        res.status(200).json(recruiments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRecruiment = async (req, res) => {
    try {
        const recruiment = new Recruitment(req.body);
        await recruiment.save();
        res.status(201).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRecruiment = async (req, res) => {
    try {
        const recruiment = await Recruitment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRecruiment = async (req, res) => {
    try {
        const recruiment = await Recruitment.findByIdAndDelete(req.params.id);
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};