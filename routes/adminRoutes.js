const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const helper = require('../config/helper')


//Users Routes

router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.patch("/updateUser/:id", adminController.updateAdmin);
router.delete("/updateUser/:id", adminController.deleteAdmin);




module.exports = router