const validator = require('validator');

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/feed");
    }
  },
  ensureCreate: function (req, res, next) {
    const validationErrors = [];

    if (validator.isEmpty(req.body.caption))
      validationErrors.push({ msg: "Please include a caption." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/spray");
    }

    return res.redirect('/profile')
  },
};
