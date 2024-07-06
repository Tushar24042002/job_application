// user.repository.js
import User from "../models/User.js";

// Function to save a user
export const saveUser = async ({ name, email, password, role }) => {
    const user = await User.create({ name, email, password, role });
    return user;
}

// Function to find all users
export const findAllUsers = async () => {
    const users = await User.findAll();
    return users;
}
