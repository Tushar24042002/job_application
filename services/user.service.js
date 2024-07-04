// user.service.js
import { findAllUsers, findUserByEmail, saveUser } from "../repository/user.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

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



export const generateToken = async (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  }
  const token = jwt.sign(data, jwtSecretKey);
  res.send(token);
}

export const validateToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(req.headers)
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized - JWT must be provided');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).send({ isLoggedIn: true })
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
}



export const login = async (req, res) => {
  try {
    const user = await findUserByEmail(req);
    if (!user) {
      return res.status(400).send("user not found");
    } else if (await bcrypt.compare(req.body.password, user.password)) {
      const tokenPayload = {
        id: user.id,
      };
      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
      res.status(201).json({
        status: true,
        message: 'User Logged In!',
        data: {
          accessToken,
        },
      });
    } else {
      const err = new Error('Wrong Password!');
      err.status = 400;
      throw err;
    }
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};



export const getCurrentUser = async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(req.headers)
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized - JWT must be provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    return res.status(500).send(error);
    // throw new Error('Invalid JWT' , error);
  }
};