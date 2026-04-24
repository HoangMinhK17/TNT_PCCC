import Contact from "../models/Contact.js";
import AuditLog from "../models/AuditLog.js";

const getContactsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Contact.countDocuments({ isDeleted: false });
        const contacts = await Contact.find({ isDeleted: false })
            .populate("productId", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ contacts, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getContactById = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contact = await Contact.findById(req.params.id)
            .populate("productId", "name slug");
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { repliedMessage, status } = req.body;
        const contactOld = await Contact.findById(req.params.id).lean();
        const contact = await Contact.findByIdAndUpdate(req.params.id, { repliedMessage, status }, { new: true });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        const allowedFields = ["repliedMessage", "status"];
        const newValues = {};
        const oldValues = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined && req.body[field] !== contactOld[field]) {
                newValues[field] = req.body[field];
                oldValues[field] = contactOld[field];
            }
        });
        if (Object.keys(newValues).length > 0 && status !== "pending") {
        const auditLog = new AuditLog({
            module: "Liên hệ", 
            action: "update",
            recordId: contact._id,
            recordName: contact.name,
            userId: req.user.id,
            oldValues,
            newValues,
        });
        await auditLog.save();
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contact = await Contact.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        const auditLog = new AuditLog({
            module: "Liên hệ",
            action: "delete",
            recordId: contact._id,
            recordName: contact.name,
            userId: req.user.id,
        });
        await auditLog.save();
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findContactByNameOrPhone = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const search = req.body.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Contact.countDocuments({ $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }], isDeleted: false });
        const contacts = await Contact.find({ $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }], isDeleted: false })
            .populate("productId", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ contacts, total, totalPage: Math.ceil(total / limit), currentPage: page });
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
        const total = await Contact.countDocuments({ status: req.body.status, isDeleted: false });
        const contacts = await Contact.find({ status: req.body.status, isDeleted: false })
            .populate("productId", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ contacts, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getContactsForManage, getContactById, createContact, updateContact, deleteContact, findContactByNameOrPhone, filterByStatus };