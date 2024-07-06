// user.repository.js
import User from "../models/User.js";
import bcrypt from "bcrypt";





// Function to save a user
export const saveUser = async ({ name, email, password, role }) => {
    password = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password, role });
    return user;
}
export const findAllUsers = async () => {
    const users = await User.findAll();
    return users;
}

export const findUserByEmail = async(req)=>{
    const email = req.body.email;
    if (!email) {
      throw new Error('Email is required');
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
}