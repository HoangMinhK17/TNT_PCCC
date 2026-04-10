import IntroductCompany from "../models/IntroductCompany.js";

const createIntroductCompany = async (req, res) => {
    try {
        const { name, title, description, image, mission, vision, coreValues } = req.body;
        const introductCompany = await IntroductCompany.create({ name, title, description, image, mission, vision, coreValues });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateIntroductCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, description, image } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findByIdAndUpdate(id, { name, title, description, image }, { new: true });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteIntroductCompany = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findByIdAndDelete(id);
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIntroductCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const introductCompany = await IntroductCompany.findById(id);
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMissionVision = async (req, res) => {
    try {
        const { id } = req.params;
        const { mission, vision } = req.body;
        console.log("role", req.user.role);
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findByIdAndUpdate(id, { mission, vision }, { new: true });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCoreValuesCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, date } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findOneAndUpdate(
            { "coreValues._id": id },
            {
                $set: {
                    "coreValues.$.title": title,
                    "coreValues.$.description": description,
                    "coreValues.$.image": image,
                    "coreValues.$.date": date,
                }
            },
            { new: true }
        );
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCoreValuesCompany = async (req, res) => {
    try {
        const { parentId, title, description, image, date } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!parentId) return res.status(400).json({ message: "parentId is required" });
        const introductCompany = await IntroductCompany.findByIdAndUpdate(
            parentId,
            { $push: { coreValues: { title, description, image, date } } },
            { new: true }
        );
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCoreValuesCompany = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findOneAndUpdate(
            { "coreValues._id": id },
            { $pull: { coreValues: { _id: id } } },
            { new: true }
        );
        res.status(200).json(introductCompany);
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

export { createIntroductCompany, getAllIntroductCompany, getIntroductCompany, getMissionVision, getCoreValues, getIntroductCompanyById, updateIntroductCompany, deleteIntroductCompany, updateMissionVision, updateCoreValuesCompany, addCoreValuesCompany, deleteCoreValuesCompany };
