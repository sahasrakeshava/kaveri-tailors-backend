const express = require("express");
const router = express.Router();
const { handleSearch } = require("../controller/search.controller");

// Define the search route
router.get("/search", handleSearch);

module.exports = router;
