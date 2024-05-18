import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";




export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role:user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};


// import userModel from "../models/userModel.js";

// Get all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      countTotal: users.length,
      message: "All Users",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting users",
      error: error.message,
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId for deletion:", userId); // Add this line for debugging
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // If user exists, delete it
    await userModel.findByIdAndDelete(userId);
    console.log("User deleted successfully"); // Add this line for debugging
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
  }
};



// Update user details
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, address, role } = req.body;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.role = role || user.role;

    // Save the updated user
    await user.save();

    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Error updating user", error: error.message });
  }
};



// authController.js

// Import userModel and other necessary modules

// Function to get a user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Check if the userId is provided
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    // Find the user by ID in the database
    const user = await userModel.findById(userId);
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Return the user data
    res.status(200).json({ success: true, message: "User found", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
  }
};

// Other controller functions

