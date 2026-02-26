import Partner from "../models/Partner.js";

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({ status: "active"}).select("name image");
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPartner = async (req, res) => {
    try {
        const partner = new Partner(req.body);
        await partner.save();
        res.status(201).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
