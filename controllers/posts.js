const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
require("dotenv").config({ path: "./config/.env" });

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeedGuest: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed-guest.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // getSpray: async (req, res) => {
  //   try {
  //     const posts = await Post.find().sort({ createdAt: "desc" }).lean();
  //     res.render("spray.ejs", { posts: posts, user: req.user });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  getPost: async (req, res) => {
    try {
      // DATE CONVERTER
      Date.prototype.yyyymmdd = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
      
        return [this.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
               ].join('');
      };

      const post = await Post.findById(req.params.id);
      const comment = await Comment.find({post: req.params.id}).sort({
        createdAt: 'asc'
      }).lean();
      res.render("post.ejs", { post: post, user: req.user, comment: comment });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {resource_type: 'video'});

      // jpeg heif => jpg
      if (result.secure_url.toLowerCase().endsWith('heic' || 'png' || 'jpeg' || 'heif' || 'jpg')) {
        result.secure_url = result.secure_url.replace(/heic|png|jpeg|heif|jpg$/i, 'jpg');
      } else if (result.secure_url.toLowerCase().endsWith('hevc' || 'h.264' || 'mp4')) {
        result.secure_url = result.secure_url.replace(/heic|h.264|mp4$/i, 'mp4');
      }

      await Post.create({
        media: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect(`/feed`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
