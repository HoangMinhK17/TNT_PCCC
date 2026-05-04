import Recruitment from "../models/Recruitment.js";
import AuditLog from "../models/AuditLog.js";

export const getRecruiments = async (req, res) => {
    try {
        const recruiments = await Recruitment.find({ status: "active", isDeleted: false })
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(recruiments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRecruiment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (req.body.slug) {
            const existingProduct = await Recruitment.findOne({
                slug: req.body.slug,
                isDeleted: false
            });
            if (existingProduct) {
                return res.status(400).json({ message: "Slug already exists" });
            }
        }
        const recruiment = new Recruitment(req.body);
        await recruiment.save();
        const auditLog = new AuditLog({
            module: "Tuyển dụng",
            action: "create",
            recordId: recruiment._id,
            recordName: recruiment.name,
            userId: req.user.id,
        });
        await auditLog.save();
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRecruiment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (req.body.slug) {
            const existingProduct = await Recruitment.findOne({
                slug: req.body.slug,
                isDeleted: false,
                _id: { $ne: req.params.id }
            });
            if (existingProduct) {
                return res.status(400).json({ message: "Slug already exists" });
            }
        }
        const oldData = await Recruitment.findById(req.params.id);
        const allowedFields = [
            "name", "name_en", "level", "level_en", "location", "location_en",
            "salary", "salary_en", "time", "time_en", "slug", "status",
            "requirements", "requirements_en"
        ];
        const oldValues = {};
        const newValues = {};
        const oldDataObj = oldData.toObject();

        const cleanForCompare = (val) => {
            if (val === null || val === undefined) return null;
            if (Array.isArray(val)) return val.map(cleanForCompare);
            if (typeof val === 'object') {
                if (val instanceof Date) return val.toISOString();
                if (val.toString && /^[0-9a-fA-F]{24}$/.test(val.toString())) {
                    return val.toString();
                }
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

        const computeArrayDiff = (oldArr, newArr) => {
            const oldDiff = [];
            const newDiff = [];
            const maxLength = Math.max(oldArr.length, newArr.length);
            for (let i = 0; i < maxLength; i++) {
                const o = oldArr[i];
                const n = newArr[i];
                const cleanO = cleanForCompare(o);
                const cleanN = cleanForCompare(n);
                if (JSON.stringify(cleanO) !== JSON.stringify(cleanN)) {
                    if (o !== undefined)
                        oldDiff.push({ _index: i, ...(cleanO && typeof cleanO === 'object' ? cleanO : { value: cleanO }) });
                    if (n !== undefined)
                        newDiff.push({ _index: i, ...(cleanN && typeof cleanN === 'object' ? cleanN : { value: cleanN }) });
                }
            }
            return { oldDiff, newDiff };
        };

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'requirements' || field === 'requirements_en') {
                    const oldArr = Array.isArray(oldDataObj[field]) ? oldDataObj[field] : [];
                    const newArr = Array.isArray(req.body[field]) ? req.body[field] : [];
                    const { oldDiff, newDiff } = computeArrayDiff(oldArr, newArr);
                    if (oldDiff.length > 0 || newDiff.length > 0) {
                        oldValues[field] = oldDiff;
                        newValues[field] = newDiff;
                    }
                } else {
                    const oldValClean = cleanForCompare(oldDataObj[field]);
                    const newValClean = cleanForCompare(req.body[field]);

                    if (JSON.stringify(oldValClean) !== JSON.stringify(newValClean)) {
                        oldValues[field] = oldValClean;
                        newValues[field] = newValClean;
                    }
                }
            }
        });

        const recruiment = await Recruitment.findByIdAndUpdate(req.params.id, req.body,
            { new: true });
        if (Object.keys(oldValues).length > 0 || Object.keys(newValues).length > 0) {
            const auditLog = new AuditLog({
                module: "Tuyển dụng",
                action: "update",
                recordId: recruiment._id,
                recordName: recruiment.name,
                userId: req.user.id,
                oldValues,
                newValues,
            });
            await auditLog.save();
        }
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRecruiment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const recruiment = await Recruitment.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        const auditLog = new AuditLog({
            module: "Tuyển dụng",
            action: "delete",
            recordId: recruiment._id,
            recordName: recruiment.name,
            userId: req.user.id,
        });
        await auditLog.save();
        res.status(200).json(recruiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecruimentsForManage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRecruiments = await Recruitment.countDocuments({ isDeleted: false });
        const recruiments = await Recruitment.find({ isDeleted: false })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            recruiments,
            totalRecruiments,
            totalPages: Math.ceil(totalRecruiments / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecruimentsByName = async (req, res) => {
    try {
        const name = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRecruiments = await Recruitment.countDocuments({
            name: { $regex: name, $options: "i" }, isDeleted: false
        });
        const recruiments = await Recruitment.find({
            name: { $regex: name, $options: "i" }, isDeleted: false
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            recruiments,
            totalRecruiments,
            totalPages: Math.ceil(totalRecruiments / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

