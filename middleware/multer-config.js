const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set unique file names
  },
});

const upload = multer({ storage });

module.exports = upload;
