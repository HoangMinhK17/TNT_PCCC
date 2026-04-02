import CategoryProduct from "../models/CategoryProduct.js";

const getCategoryProducts = async (req, res) => {
    try {
        const categoryProducts = await CategoryProduct.find({isDeleted : false , status : "active"}).sort({ createdAt: -1 });
        res.status(200).json(categoryProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getCategoryProductForManage = async (req, res) => {
    try {
        const categoryProducts = await CategoryProduct.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json(categoryProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategoryProduct = async (req, res) => {
    try {
        const { name, slug } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if(slug){
            const categoryProduct =  await CategoryProduct.findOne({slug : slug});
            if(categoryProduct){
                return res.status(400).json({ message: "Slug already exists" });
            }
        }
        const categoryProduct = await CategoryProduct.create({ name, slug });
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategoryProduct = async (req, res) => {
    try {
        const { name, slug, status } = req.body;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const existingProduct = await CategoryProduct.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: "Slug already exists" });
        }
        const categoryProduct = await CategoryProduct.findByIdAndUpdate(req.params.id, { name, slug, status }, { new: true });
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategoryProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const categoryProduct = await CategoryProduct.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getCategoryProductById = async (req, res) => {
    try {
        const categoryProduct = await CategoryProduct.findById(req.params.id);
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getCategoryProducts, getCategoryProductForManage, createCategoryProduct, updateCategoryProduct, deleteCategoryProduct, getCategoryProductById };