const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("GET for users");
})

// Show
router.get("/:id", (req, res) => {
    res.send("GET for user id");
})

// POST
router.post("/", (req, res) => {
    res.send("POST for users");
})

// DELETE
router.delete("/:id", (req, res) => {
    res.send("DELETE for user id");
})

module.exports = router;