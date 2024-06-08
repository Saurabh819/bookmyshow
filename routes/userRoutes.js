const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const {isAuthenticated,authorizeRoles} = require('../config/helper')


//Users Routes

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/bulkInsert", userController.registerUsersBulk);
router.post("/bulkInsertopt",userController.registerUsersBulk);
router.get("/allusers",[isAuthenticated,authorizeRoles('admin')],userController.getAllUsers);
router.get("/singleuser/:id", [isAuthenticated,authorizeRoles('admin')],userController.singleUser);
router.patch("/updateUser/:id", userController.updateUser);
router.post("/forgetPassword",userController.forgetPassword);
router.get("/logout",isAuthenticated,userController.logout);




module.exports = router;
