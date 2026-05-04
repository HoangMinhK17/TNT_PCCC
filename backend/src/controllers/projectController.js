import Project from "../models/Project.js";
import AuditLog from "../models/AuditLog.js";

const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalProjects = await Project.countDocuments({ isDeleted: false, status: "active" });
        const projects = await Project.find({ isDeleted: false, status: "active" })
            .select("name name_en image date slug description description_en year")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

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

const getProjectsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalProjects = await Project.countDocuments({ isDeleted: false });
        const projects = await Project.find({ isDeleted: false })
            .select("name name_en title title_en image date slug description description_en status year")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

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
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, name_en, slug, title, title_en, description, description_en, image, date } = req.body;
        const existingProduct = await Project.findOne({ slug, isDeleted: false });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const project = await Project.create({
            name, name_en, slug, title, title_en,
            description, description_en, image, date
        });

        const auditLog = new AuditLog({
            module: "Dự án",
            action: "create",
            recordId: project._id,
            recordName: project.name,
            userId: req.user.id,
        });

        await auditLog.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, name_en, slug, title, title_en, description, description_en, image, date,
            status } = req.body;
        const existingProduct = await Project.findOne({ slug, isDeleted: false, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const projectOld = await Project.findById(req.params.id);
        const cleanForCompare = (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === "string") {
                const trimmed = val.trim();
                if (trimmed === "" || trimmed === "<p><br></p>") return null;
                return trimmed.replace(/\r\n/g, '\n');
            }
            if (typeof val === "boolean") return val;
            if (typeof val === "number") return val;
            if (Array.isArray(val)) return val.map(cleanForCompare);
            if (typeof val === 'object') {
                if (val instanceof Date) return val.toISOString();
                if (val.toString && /^[0-9a-fA-F]{24}$/.test(val.toString()))
                    return val.toString();
                const newObj = {};
                for (const key in val) {
                    if (key !== '_id' && key !== 'id') {
                        newObj[key] = cleanForCompare(val[key]);
                    }
                }
                return newObj;
            }
            return val;
        };

        const oldValues = {};
        const newValues = {};
        const updateFields = [
            "name", "name_en", "slug", "title", "title_en",
            "description", "description_en", "image", "date", "status"
        ];
        const projectOldObj = projectOld.toObject();
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                const oldValClean = JSON.stringify(cleanForCompare(projectOldObj[field]));
                const newValClean = JSON.stringify(cleanForCompare(req.body[field]));
                if (oldValClean !== newValClean) {
                    if (["description", "description_en"].includes(field)) {
                        oldValues[field] = "(Đã thay đổi nội dung, không hiển thị vì quá dài)";
                        newValues[field] = "(Đã cập nhật nội dung mới)";
                    } else {
                        oldValues[field] = cleanForCompare(projectOldObj[field]);
                        newValues[field] = cleanForCompare(req.body[field]);
                    }
                }
            }
        });
        const projectNew = await Project.findByIdAndUpdate(
            req.params.id,
            {
                name, name_en, slug, title, title_en, description, description_en, image, date,
                status
            },
            { new: true }
        );

        if (Object.keys(oldValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Dự án",
                action: "update",
                recordId: projectNew._id,
                recordName: projectNew.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }
        res.status(200).json(projectNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const project = await Project.findByIdAndUpdate(req.params.id, { isDeleted: true },
            { new: true });
        const auditLog = new AuditLog({
            module: "Dự án",
            action: "delete",
            recordId: project._id,
            recordName: project.name,
            userId: req.user.id,
        });
        await auditLog.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const id = req.params.id;
        const mongoose = await import('mongoose');
        const query = mongoose.isValidObjectId(id)
            ? { $or: [{ _id: id }, { slug: id }], isDeleted: false }
            : { slug: id, isDeleted: false };

        const project = await Project.findOne(query)
            .select("name name_en slug title title_en description description_en image date status")
            .lean();
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectByName = async (req, res) => {
    try {
        const name = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            name: { $regex: name, $options: "i" },
            isDeleted: false,
        };

        const totalProjects = await Project.countDocuments(filter);
        const projects = await Project.find(filter)
            .select("name name_en title title_en image date slug description description_en status year")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

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

export {
    getProjects, getProjectsForManage, createProject, updateProject, deleteProject,
    getProjectById, getProjectByName
};