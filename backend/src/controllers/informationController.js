import Information from "../models/Information.js";

const getInformation = async (req, res) => {
    try {
        const information = await Information.findOne({ status: "active", isDeleted: false }).select("name date title image description content slug ").populate("categoryNewsId", "name");
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createInformation = async (req, res) => {
    try {
        const information = await Information.create(req.body);
        res.status(201).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateInformation = async (req, res) => {
    try {
        const information = await Information.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteInformation = async (req, res) => {
    try {
        const information = await Information.findByIdAndDelete(req.params.id);
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getInformation, createInformation, updateInformation, deleteInformation };