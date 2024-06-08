const express = require("express");
const router = express.Router();
const MovieController = require("../controller/movieController");
const helper = require('../config/helper')


//Movie Roures==

router.post("/addMovie", MovieController.addMovie);
router.get("/getAllMovie", MovieController.getAllMovie);
router.patch("/updateMovie/:id", MovieController.updateMovie);
// router.delete("/deleteMovie/:id", MovieController.deleteMovie);


module.exports = router;
