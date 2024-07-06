// user.service.js
import { findAllUsers, saveUser } from "../repository/user.repository.js";

// Function to handle user creation
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await saveUser({ name, email, password, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to handle fetching all users
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await findAllUsers();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
