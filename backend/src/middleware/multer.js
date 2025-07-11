import multer from "multer";
import path from "path"


// Simple local storage
// const storage = multer.diskStorage({
//             destination: (req, file, cb) => {
//                         cb(null, "uploads/");
//             },
//             filename: (req, file, cb) => {
//                         cb(null, Date.now() + path.extname(file.originalname));// now it becomes a unique name
//             }
// })

// Using memory storage so files are not saved on disk

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;