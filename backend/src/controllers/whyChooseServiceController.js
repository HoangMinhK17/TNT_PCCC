import WhyChooseService from "../models/WhyChooseService.js";

export const createWhyChooseService = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { title, description, icon, status } = req.body;
        const whyChooseService = new WhyChooseService({ title, description, icon, status });
        await whyChooseService.save();
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWhyChooseService = async (req, res) => {
    try {
        const whyChooseService = await WhyChooseService.find({ isDeleted: false, status: "active" }).select("title description icon").sort({ createdAt: -1 });
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateWhyChooseService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const { title, description, icon, status } = req.body;
        const whyChooseService = await WhyChooseService.findByIdAndUpdate(id, { title, description, icon, status }, { new: true });
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteWhyChooseService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const whyChooseService = await WhyChooseService.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        res.status(200).json(whyChooseService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWhyChooseServiceForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalWhyChooseService = await WhyChooseService.countDocuments({ isDeleted: false });
        const whyChooseService = await WhyChooseService.find({ isDeleted: false }).select("title description icon status").skip(skip).limit(limit);
        res.status(200).json({
            whyChooseService,
            totalPages: Math.ceil(totalWhyChooseService / limit),
            currentPage: page,
            totalWhyChooseService
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchWhyChooseService = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalWhyChooseService = await WhyChooseService.countDocuments({ isDeleted: false });
        const { name } = req.query;
        const whyChooseService = await WhyChooseService.find({ title: { $regex: name, $options: "i" }, isDeleted: false })
            .select("title description icon status")
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            whyChooseService,
            totalPages: Math.ceil(totalWhyChooseService / limit),
            currentPage: page,
            totalWhyChooseService
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
