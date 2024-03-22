const express = require("express");
const overviewService = require("../services/overviewService");

const router = express.Router();

router.route("/").get(overviewService.getOverview);

module.exports = router;
