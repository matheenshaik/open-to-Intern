const express = require("express");
const router = express.Router();
const collegeController = require("../controller/collegeController") 
const internController = require("../controller/internController") 

router.post("/functionup/colleges", collegeController.colleges )
router.post("/functionup/interns", internController.intern)
router.get("/functionup/collegeDetails", internController.getCollegeDetails)


module.exports = router