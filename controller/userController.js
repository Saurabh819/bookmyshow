const express = require("express");
const app = express();
const { Op } = require('sequelize');

const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");




const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistUser = await User.findOne({ where: { email } });
    if (isExistUser) {
      return res.status(403).json({
        success: false,
        massage: "user Already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "user Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ where: { email } });
    if (!userData) {
      return res.status(400).json({
        success: false,
        massage: "Email or Password is Incorrect",
      });
    }
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Email or Password is Incorrect",
      });
    }

    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.status(200).json({
      success: true,
      message: "User Loggedin successfully",
      data: userData,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


const registerUsersBulk = async (req, res) => {
  try {
    const usersToRegister = req.body; // Assuming req.body is an array of user objects

    if (usersToRegister.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users to register.",
      });
    }

    // Extracting unique emails from the array of users
    const emails = usersToRegister.map((user) => user.email);

    // Checking if any user already exists with the provided emails
    const existingUsers = await User.findAll({ where: { email: { [Op.in]: emails } } });
    if (existingUsers.length > 0) {
      const existingEmails = existingUsers.map((user) => user.email);
      const duplicateEmails = existingEmails.join(", ");
      return res.status(403).json({
        success: false,
        message: `Users with the following emails already exist: ${duplicateEmails}`,
      });
    }

    // Hashing passwords for all users
    const usersWithHashedPasswords = await Promise.all(
      usersToRegister.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          username: user.username,
          email: user.email,
          password: hashedPassword,
        };
      })
    );

    // Bulk create users in the database
    const registeredUsers = await User.bulkCreate(usersWithHashedPasswords);

    return res.status(201).json({
      success: true,
      message: "Users Registered Successfully",
      data: registeredUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const registerUsersBulkOPT = async (req, res) => {
  try {
    const usersToRegister = req.body; // Assuming req.body is an array of user objects

    // Split users into smaller batches (e.g., batches of 100 users)
    const batchSize = 100;
    const userBatches = [];
    for (let i = 0; i < usersToRegister.length; i += batchSize) {
      userBatches.push(usersToRegister.slice(i, i + batchSize));
    }

    // Begin a transaction
    await sequelize.transaction(async (t) => {
      // Process each batch of users
      for (const batch of userBatches) {
        const emails = batch.map((user) => user.email);

        // Check for existing users
        const existingUsers = await User.findAll({
          where: { email: emails },
          transaction: t,
        });
        if (existingUsers.length > 0) {
          const existingEmails = existingUsers.map((user) => user.email);
          const duplicateEmails = existingEmails.join(", ");
          return res.status(403).json({
            success: false,
            message: `Users with the following emails already exist: ${duplicateEmails}`,
          });
        }

        // Hash passwords for the batch
        const usersWithHashedPasswords = await Promise.all(
          batch.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return {
              username: user.username,
              email: user.email,
              password: hashedPassword,
            };
          })
        );

        // Bulk create users in the database
        await User.bulkCreate(usersWithHashedPasswords, { transaction: t });
      }
    });

    return res.status(201).json({
      success: true,
      message: "Users Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let { page, limit } = req.query;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const size = parseInt(limit);
    const offset = (page - 1) * size;
    const users = await User.findAndCountAll({
      size,
      offset,
    });

    // const getAllUsers =findAllUsers.every(user => user instanceof User)
    // console.log(getAllUsers)
    return res.status(200).json({
      success: true,
      data: users.rows,
      totalPages: Math.ceil(users.count / size),
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const singleUser = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllUsers = await User.findOne({ where: { user_id:id } });
    // const getAllUsers =findAllUsers.every(user => user instanceof User)
    // console.log(getAllUsers)
    return res.status(200).json({
      success: true,
      message: "Get User",
      data: getAllUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const id = req.params.id;

    // Check if the user exists
    const existingUser = await User.findOne({ where: { user_id:id } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Hash the password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user with provided fields
    const updatedUser = await User.update(
      { username, email, password: hashedPassword },
      { where: { id } }
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const isExistUser = await User.findOne({ where: { id } });

    if (!isExistUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    const deleteUser = await User.destroy({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: isExistUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const logout = async (req,res) =>{
try {
  const authHeader = req.header('Authorization');
  const token = authHeader.split(' ')[1];
  await BlackListedToken.create({token});
  res.status(200).json({ message: 'Logout successful' });
} catch (error) {
  console.log(error)
  res.status(500).json({ message: error.message });
}
}
const forgetPassword = async (req, res) => {
  try {
    const {email}= req.body
    const findUser = await User.findOne({where:{email}});
    if (!findUser) {
      return { success: false, message: "User not found" };
    }

    const token = crypto.randomBytes(20).toString("hex");
    findUser.token = token;

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: "Saurabhg1500@gmail.com",
      to: req.body.email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Reset link sent to your email" };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerUsersBulk,
  singleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  registerUsersBulkOPT,
  forgetPassword,
  logout,
};
