const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.post("/createComment", commentController.createComment);

//req.params.id used in routes
//mayan way
// router.delete("/deleteComment/:postid/:commentid",commentController.deleteComment)

module.exports = router;