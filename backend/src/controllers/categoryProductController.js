import CategoryProduct from "../models/CategoryProduct.js";

const getCategoryProducts = async (req, res) => {
    try {
        const categoryProducts = await CategoryProduct.find({isDeleted : false});
        res.status(200).json(categoryProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategoryProduct = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const categoryProduct = await CategoryProduct.create({ name, slug });
        res.status(201).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategoryProduct = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const categoryProduct = await CategoryProduct.findByIdAndUpdate(req.params.id, { name, slug }, { new: true });
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategoryProduct = async (req, res) => {
    try {
        const categoryProduct = await CategoryProduct.findByIdAndDelete(req.params.id);
        res.status(200).json(categoryProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getCategoryProducts, createCategoryProduct, updateCategoryProduct, deleteCategoryProduct };