const express = require("express");
const router = express.Router();

const Controller = require("../controllers/iotController");
router.get('/project/',Controller.project);

module.exports = router;