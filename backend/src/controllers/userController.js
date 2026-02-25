import User from "../models/User.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        res.status(200).json("get all users");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { createUser, getAllUsers };