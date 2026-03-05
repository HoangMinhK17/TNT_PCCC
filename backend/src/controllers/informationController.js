import Information from "../models/Information.js";

const getInformation = async (req, res) => {
    try {
        const information = await Information.find().select("name title phone address email  timeWork");
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const getImageInformation = async (req, res) => {
    try {
        const information = await Information.find().select("name backgroundImage logo favicon");
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getContactInformation = async (req, res) => {
    try {
        const information = await Information.find().select("socialLinks");
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.find();
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.create(req.body);
        res.status(201).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            title: req.body.title,
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
            timeWork: req.body.timeWork
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const upadateImageInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.findByIdAndUpdate(req.params.id, {
            backgroundImage: req.body.backgroundImage,
            logo: req.body.logo,
            favicon: req.body.favicon
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateContractInformation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const information = await Information.findByIdAndUpdate(req.params.id, {
            socialLinks: req.body.socialLinks
        }, { new: true });
        if (!information) {
            return res.status(404).json({ message: "Information not found" });
        }
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getInformation, getImageInformation, getContactInformation,getAllInformation, createInformation, updateInformation, upadateImageInformation, updateContractInformation };