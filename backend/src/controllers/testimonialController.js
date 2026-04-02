import Testimonial from "../models/Testimonial.js";

const getPublicTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({isDeleted: false , status: "active"})
            .select("name role company content rating avatar")
            .sort({ createdAt: -1 })

        res.status(200).json({
            testimonials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTestimonialsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false };
        const totalTestimonials = await Testimonial.countDocuments(filter);
        const testimonials = await Testimonial.find(filter)
            .select("name role company content rating avatar status")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            testimonials,
            totalPages: Math.ceil(totalTestimonials / limit),
            currentPage: page,
            totalTestimonials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTestimonial = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, role, company, content, rating, avatar } = req.body;
        const testimonial = await Testimonial.create({ name, role, company, content, rating, avatar });
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, role, company, content, rating, avatar, status } = req.body;
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { name, role, company, content, rating, avatar, status }, { new: true });
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchTestimonial = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { isDeleted: false };
        const totalTestimonials = await Testimonial.countDocuments(filter);
        const { name } = req.query;
        const testimonials = await Testimonial.find({ name: { $regex: name, $options: "i" }, isDeleted: false })
            .select("name role company content rating avatar status")
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            testimonials,
            totalPages: Math.ceil(totalTestimonials / limit),
            currentPage: page,
            totalTestimonials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findOne({ _id: req.params.id, isDeleted: false });
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getPublicTestimonials, createTestimonial, getPublicTestimonialById, updateTestimonial, deleteTestimonial, searchTestimonial, getTestimonialsForManage };
