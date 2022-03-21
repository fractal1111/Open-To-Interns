const express = require('express');
const router = express.Router();
const Controller= require("../allControllers/allController")

router.post("/functionup/college",Controller.createCollege)
router.post("/functionup/intern", Controller.createIntern)
router.get("/functionup/collegeDetails", Controller.getDetails)

module.exports = router;