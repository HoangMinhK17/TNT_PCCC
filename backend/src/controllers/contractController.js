import Contract from "../models/Contact.js";

 const getContractsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Contract.countDocuments({isDeleted : false});
        const contracts = await Contract.find({isDeleted : false}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({contracts, total, totalPage: Math.ceil(total / limit), currentPage: page});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const getContractById = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const createContract = async (req, res) => {
    try {
        const contract = new Contract(req.body);
        await contract.save();
        res.status(201).json(contract);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const updateContract = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const deleteContract = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contract = await Contract.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json({ message: "Contract deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findContractByNameOrPhone = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const search = req.body.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Contract.countDocuments({ $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }], isDeleted: false });
        const contracts = await Contract.find({ $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }], isDeleted: false }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({contracts, total, totalPage: Math.ceil(total / limit), currentPage: page});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const filterByStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Contract.countDocuments({ status: req.body.status, isDeleted: false });
        const contracts = await Contract.find({ status: req.body.status, isDeleted: false }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({contracts, total, totalPage: Math.ceil(total / limit), currentPage: page});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getContractsForManage, getContractById, createContract, updateContract, deleteContract, findContractByNameOrPhone, filterByStatus };