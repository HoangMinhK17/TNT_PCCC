import Project from "../models/Project.js";

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isDeleted: false });
        res.status(200).json(projects);
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
        const { name, slug, title, description, image, date } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.id, { name, slug, title, description, image, date }, { new: true });
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

export { getProjects, createProject, updateProject, deleteProject };