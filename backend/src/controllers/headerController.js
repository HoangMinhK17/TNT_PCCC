import Header from "../models/Header.js";

export const createHeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const header = await Header.create(req.body);
        res.status(201).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllHeader = async (req, res) => {
    try {
        const header = await Header.find({ status: "active" });
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getAllHeaderForShowHome = async (req, res) => {
    try {
        const header = await Header.find({ show_home: "active" });
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateHeader = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const header = await Header.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getAllForManagement = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Header.countDocuments();

        const header = await Header.find().skip(skip).limit(limit);
        res.status(200).json({ header, total, totalPage: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const findHeaderByName = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const name = req.params.name?.trim() || "";

        const query = {
            $or: [
                { name_en: { $regex: name, $options: "i" } },
                { name_vn: { $regex: name, $options: "i" } }
            ]
        };

        const total = await Header.countDocuments(query);
        const header = await Header.find(query).skip(skip).limit(limit);

        res.status(200).json({
            header,
            total,
            totalPage: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


