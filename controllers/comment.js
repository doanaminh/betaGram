const Comment = require("../models/Comment");

module.exports = {
    createComment: async (req, res) => {
      try {
        //TODO - add new properties to each document
        // const commentUser = await User.findById(req.user.id);
        //finding by id when we use req.user.id, 'User' is mongoose schema model searching
        //req.user is coming from the body, the browser
        await Comment.create({
          comment: req.body.comment,
          likes: 0,
          post: req.params.id,
          createdBy: req.user.userName,
          createdById: req.user.id
        });
        console.log("Comment has been added!");
        res.redirect("/post/"+req.params.id); //follow route go back to server js to start
        //req.params is coming from the path so /
      } catch (err) {
        console.error(err);
      }
    },
    deleteComment: async (req, res) => {
      try {
        await Comment.deleteOne({ _id: req.params.commentid })
        console.log("comment removed")
        res.redirect("/post/"+req.params.postid);
      } catch (err) {
        console.log(err);
      }
    }
  };