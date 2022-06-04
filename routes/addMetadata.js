const express = require("express");

const router = express.Router();

router.get("/addMetadata/:id", (req, res) => {
    res.render("addMetadata");
});

module.exports = router;