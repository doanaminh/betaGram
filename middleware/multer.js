const multer = require("multer");
const path = require("path");

// ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== '.heif'  && 

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    console.log(ext);
    if (ext !== '.hevc' && ext !== '.h.264' && ext !== '.mp4') {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
