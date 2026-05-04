import AuditLog from "../models/AuditLog.js";
import IntroductCompany from "../models/IntroductCompany.js";

const createIntroductCompany = async (req, res) => {
    try {
        const { name, name_en, title, description, image, mission, vision, coreValues } = req.body;
        const introductCompany = await IntroductCompany
            .create({ name, name_en, title, description, image, mission, vision, coreValues });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateIntroductCompany = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const oldData = await IntroductCompany.findById(id);
        if (!oldData) {
            return res.status(404).json({ message: "Not found" });
        }

        const oldObj = oldData.toObject();

        const updates = {};
        const oldValues = {};
        const newValues = {};

        const compare = (newVal, oldVal) => {
            return JSON.stringify(newVal) === JSON.stringify(oldVal);
        };

        const build = (newData, oldData, prefix = "") => {
            Object.keys(newData).forEach(key => {
                const newVal = newData[key];
                const oldVal = oldData?.[key];
                const path = prefix ? `${prefix}.${key}` : key;

                if (newVal === undefined) return;

                if (
                    typeof newVal === "object" &&
                    !Array.isArray(newVal) &&
                    newVal !== null
                ) {
                    build(newVal, oldVal || {}, path);
                }
                else if (Array.isArray(newVal)) {
                    if (!compare(newVal, oldVal)) {
                        updates[path] = newVal;
                        oldValues[path] = oldVal;
                        newValues[path] = newVal;
                    }
                }
                else {
                    const n = typeof newVal === "string" ? newVal.trim() : newVal;
                    const o = typeof oldVal === "string" ? oldVal?.trim() : oldVal;

                    if (n !== o) {
                        updates[path] = newVal;
                        oldValues[path] = oldVal;
                        newValues[path] = newVal;
                    }
                }
            });
        };

        build(req.body, oldObj);

        if (Object.keys(updates).length === 0) {
            return res.status(200).json(oldData);
        }

        const introductCompany = await IntroductCompany.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        await AuditLog.create({
            module: "Giới thiệu",
            recordId: id,
            recordName: introductCompany.name,
            action: "update",
            oldValues,
            newValues,
            userId: req.user.id,
        });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteIntroductCompany = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findByIdAndDelete(id);
        const auditLog = new AuditLog({
            module: "Giới thiệu",
            recordId: id,
            recordName: introductCompany.name,
            action: "delete",
            userId: req.user._id,
        });
        await auditLog.save();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIntroductCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const introductCompany = await IntroductCompany.findById(id).lean();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMissionVision = async (req, res) => {
    try {
        const { id } = req.params;
        const { mission, vision } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const oldData = await IntroductCompany.findById(id);
        if (!oldData) {
            return res.status(404).json({ message: "Not found" });
        }

        const oldObj = oldData.toObject();

        const updates = {};
        const oldValues = {};
        const newValues = {};

        const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

        const build = (newData, oldData, prefix = "") => {
            Object.keys(newData || {}).forEach(key => {
                const newVal = newData[key];
                const oldVal = oldData?.[key];
                const path = prefix ? `${prefix}.${key}` : key;

                if (newVal === undefined) return;

                if (
                    typeof newVal === "object" &&
                    newVal !== null &&
                    !Array.isArray(newVal)
                ) {
                    build(newVal, oldVal || {}, path);
                }
                else {
                    const n = typeof newVal === "string" ? newVal.trim() : newVal;
                    const o = typeof oldVal === "string" ? oldVal?.trim() : oldVal;

                    if (n !== o) {
                        updates[path] = newVal;
                        oldValues[path] = oldVal;
                        newValues[path] = newVal;
                    }
                }
            });
        };

        if (mission) build(mission, oldObj.mission, "mission");
        if (vision) build(vision, oldObj.vision, "vision");

        if (Object.keys(updates).length === 0) {
            return res.status(200).json(oldData);
        }

        const introductCompany = await IntroductCompany.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        await AuditLog.create({
            module: "Giới thiệu",
            recordId: id,
            recordName: introductCompany.name,
            action: "update",
            userId: req.user.id,
            oldValues,
            newValues,
        });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCoreValuesCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, title_en, description, description_en, image, date } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const oldDoc = await IntroductCompany.findOne({
            "coreValues._id": id
        });

        if (!oldDoc) {
            return res.status(404).json({ message: "Not found" });
        }

        const oldCoreValue = oldDoc.coreValues.id(id);

        const updatedDoc = await IntroductCompany.findOneAndUpdate(
            { "coreValues._id": id },
            {
                $set: {
                    "coreValues.$.title": title,
                    "coreValues.$.title_en": title_en,
                    "coreValues.$.description": description,
                    "coreValues.$.description_en": description_en,
                    "coreValues.$.image": image,
                    "coreValues.$.date": date,
                }
            },
            { new: true }
        );

        const updatedCoreValue = updatedDoc.coreValues.id(id);

        const allowedFields = ["title", "title_en", "description", "description_en", "image", "date"];
        const oldValues = {};
        const newValues = {};

        allowedFields.forEach(field => {
            if (oldCoreValue[field] !== updatedCoreValue[field]) {
                oldValues[field] = oldCoreValue[field];
                newValues[field] = updatedCoreValue[field];
            }
        });

        if (Object.keys(oldValues).length > 0) {
            await AuditLog.create({
                module: "Thành tựu",
                recordId: updatedDoc._id,
                recordName: updatedCoreValue?.title,
                action: "update",
                userId: req.user.id,
                oldValues,
                newValues,
            });
        }
        res.status(200).json(updatedDoc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCoreValuesCompany = async (req, res) => {
    try {
        const { parentId, title, title_en, description, description_en, image, date } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!parentId) return res.status(400).json({ message: "parentId is required" });
        const introductCompany = await IntroductCompany.findByIdAndUpdate(
            parentId,
            { $push: { coreValues: { title, title_en, description, description_en, image, date } } },
            { new: true }
        );
        await AuditLog.create({
            module: "Thành tựu",
            recordId: parentId,
            recordName: introductCompany.coreValues[introductCompany.coreValues.length - 1].title,
            action: "create",
            userId: req.user.id,
        });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCoreValuesCompany = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const introductCompany = await IntroductCompany.findOneAndUpdate(
            { "coreValues._id": id },
            { $pull: { coreValues: { _id: id } } },
            { new: false }
        );
        await AuditLog.create({
            module: "Thành tựu",
            recordId: introductCompany._id,
            recordName: introductCompany.coreValues[introductCompany.coreValues.length - 1].title,
            action: "delete",
            userId: req.user.id,
        });
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllIntroductCompany = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find().lean();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIntroductCompany = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find()
            .select("name name_en title description image ")
            .lean();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMissionVision = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find()
            .select("mission vision")
            .lean();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCoreValues = async (req, res) => {
    try {
        const introductCompany = await IntroductCompany.find()
            .select("coreValues")
            .lean();
        res.status(200).json(introductCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createIntroductCompany, getAllIntroductCompany, getIntroductCompany, getMissionVision
    , getCoreValues, getIntroductCompanyById, updateIntroductCompany
    , deleteIntroductCompany, updateMissionVision, updateCoreValuesCompany
    , addCoreValuesCompany, deleteCoreValuesCompany
};
