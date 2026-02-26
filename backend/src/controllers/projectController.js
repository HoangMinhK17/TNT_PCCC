import Project from "../models/Project.js";

const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalProjects = await Project.countDocuments({ isDeleted: false });
        const projects = await Project.find({ isDeleted: false })
            .select("name title image date slug description status year")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            projects,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / limit),
            totalProjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, slug, title, description, image, date } = req.body;
        const project = await Project.create({ name, slug, title, description, image, date });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { name, slug, title, description, image, date, status } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.id, { name, slug, title, description, image, date, status }, { new: true });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, isDeleted: false }).select("name slug title description image date status");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getProjects, createProject, updateProject, deleteProject, getProjectById };