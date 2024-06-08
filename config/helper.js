const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");
const twilio = require("twilio");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // if (!authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ message: 'Invalid Authorization header format' });
    // }

    const token = authHeader.split(" ")[1];

    // const blacklistedToken = await BlackListedToken.findOne({ where: { token } });

    // if (blacklistedToken) {
    //   return res.status(401).json({ message: 'Token is blacklisted' });
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
  
      return res
        .status(403)
        .json({ message: "Access denied, insufficient permissions" });
    }
    next();
  };
};
