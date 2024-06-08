const express = require("express");
const app = express();
const { Op } = require('sequelize');

const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.registerAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const isExistAdmin = await Admin.findOne({ where: { email } });
      if (isExistAdmin) {
        return res.status(403).json({
          success: false,
          massage: "Admin Already exists",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await Admin.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
      });
  
      await newAdmin.save();
  
      return res.status(201).json({
        success: true,
        message: "Admin Registered Successfully",
        data: newAdmin,
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
  
  exports.loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const AdminData = await Admin.findOne({ where: { email } });
      if (!AdminData) {
        return res.status(400).json({
          success: false,
          massage: "Email or Password is Incorrect",
        });
      }
      const roles = [AdminData.role];
    const isValidRoles = roles.every(role => ["user", "admin"].includes(role)) && roles.includes("admin");


    if (!isValidRoles) {
        return res.status(400).json({
          success: false,
          message: "Invalid roles. Admin must have the 'admin' role and can optionally have the 'user' role.",
          data: null,
        });
      }
      const passwordMatch = await bcrypt.compare(password, AdminData.password);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message: "Email or Password is Incorrect",
        });
      }
  
      const token = jwt.sign(
        { id: AdminData.id, email: AdminData.email, role: AdminData.role },
        process.env.JWT_SECRET,
        { expiresIn: "6h" }
      );
  
      return res.status(200).json({
        success: true,
        message: "Admin Loggedin successfully",
        data: AdminData,
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

  exports.updateAdmin = async (req, res) => {
    try {
      const { Adminname, email, password } = req.body;
      const id = req.params.id;
  
      // Check if the Admin exists
      const existingAdmin = await Admin.findOne({ where: { id } });
      if (!existingAdmin) {
        return res.status(404).json({
          success: false,
          message: "Admin does not exist",
        });
      }
  
      // Hash the password if provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Update the Admin with provided fields
      const updatedAdmin = await Admin.update(
        { Adminname, email, password: hashedPassword },
        { where: { id } }
      );
  
      return res.status(200).json({
        success: true,
        message: "Admin updated successfully",
        data: updatedAdmin,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };
  
  exports.deleteAdmin = async (req, res) => {
    try {
      const id = req.params.id;
      const isExistAdmin = await Admin.findOne({ where: { id } });
  
      if (!isExistAdmin) {
        return res.status(404).json({
          success: false,
          message: "Admin does not exist",
        });
      }
      const deleteAdmin = await Admin.destroy({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
        data: isExistAdmin,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };