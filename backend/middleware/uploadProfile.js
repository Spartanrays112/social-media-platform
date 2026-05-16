import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/profile",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadProfile = multer({ storage });

export default uploadProfile;
