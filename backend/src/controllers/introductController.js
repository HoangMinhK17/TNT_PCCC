import IntroductCompany from "../models/IntroductCompany.js";

const createIntroductCompany = async (req, res) => {
    try {
        const { name, title, description, image, mission, vision, coreValues } = req.body;
        const introductCompany = await IntroductCompany.create({ name, title, description, image, mission, vision, coreValues });
        res.status(201).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllIntroductCompany = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIntroductCompany = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find().select("name title description image ");
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMissionVision = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find().select("mission vision");
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getCoreValues = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find().select("coreValues");
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createIntroductCompany, getAllIntroductCompany, getIntroductCompany, getMissionVision, getCoreValues };
