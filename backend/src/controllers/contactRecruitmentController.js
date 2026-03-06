import ContactRecruitment from "../models/ContactRecruitment.js";

const createContactRecruitment = async (req, res) => {
    try {
        const { name, email, phone, address, cv, recruitmentId } = req.body;
        const contactRecruitment = new ContactRecruitment({
            name,
            email,
            phone,
            address,
            cv,
            recruitmentId
        });
        await contactRecruitment.save();
        res.status(201).json({ message: "Liên hệ đã được gửi thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

const getContactRecruitment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await ContactRecruitment.countDocuments({ isDeleted: false });
        const contactRecruitment = await ContactRecruitment.find({ isDeleted: false }).populate('recruitmentId', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({ contactRecruitment, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

const getContactRecruitmentByNameOrPhone = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const search = req.params.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await ContactRecruitment.countDocuments({ $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }], isDeleted: false });
        const contactRecruitment = await ContactRecruitment.find({ $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }], isDeleted: false }).populate('recruitmentId', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({ contactRecruitment, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

const getContactRecruitmentByStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const status = req.params.status;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await ContactRecruitment.countDocuments({ status, isDeleted: false });
        const contactRecruitment = await ContactRecruitment.find({ status, isDeleted: false }).populate('recruitmentId', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({ contactRecruitment, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

const getContactRecruitmentById = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contactRecruitment = await ContactRecruitment.findById(req.params.id).populate('recruitmentId', 'name slug');
        res.status(200).json(contactRecruitment);
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

const updateContactRecruitment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, email, phone, address, cv, recruitmentId, status, note } = req.body;
        const contactRecruitment = await ContactRecruitment.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            address,
            cv,
            recruitmentId,
            status,
            note
        }, { new: true });
        res.status(200).json(contactRecruitment);
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

const deleteContactRecruitment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const contactRecruitment = await ContactRecruitment.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(contactRecruitment);
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
}

export { createContactRecruitment, getContactRecruitment, getContactRecruitmentByNameOrPhone, getContactRecruitmentByStatus, updateContactRecruitment, deleteContactRecruitment, getContactRecruitmentById }