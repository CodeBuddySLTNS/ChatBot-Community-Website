const express = require("express");
const router = express.Router();
const { views } = require("../controllers/views-controller");

router.get("/views", views);

module.exports = router;
