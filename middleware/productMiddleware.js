import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { filterFileName, filterEmailFromUniqueCharacter, getUserImagePath } from '../utility/createFolderUtil.js';

// Setup multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userEmail = req.user.email;
        const sanitizedUserEmail =  filterEmailFromUniqueCharacter(userEmail); // Assuming user is logged in and email is available in req.user
        const userDir = getUserImagePath(sanitizedUserEmail, file.originalname);
        
        
        // Ensure the user's directory exists
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Check if there is an existing image in the user's directory
        const files = fs.readdirSync(userDir);
        if (files && files.length > 0) {
            console.log(`Existing Image found in ${userDir}`);


            files.forEach(existingFile => {
                if (file === filterFileName(file.originalname)) {
                    console.log(`${file} file already exists in ${userDir}.`);
                    const filePath = path.join(userDir, file);
                    fs.unlinkSync(filePath); // Remove the existing file
                    console.log(`File ${file} has been removed from ${userDir}.`);
                }
            });
        }
        
        cb(null, userDir);  // Save to user-specific directory
    },
    filename: function (req, file, cb) {
        // Use the user's email as the filename, and keep the file extension from the original name
        const sanitizedFileName = filterFileName(file.originalname);
        cb(null, sanitizedFileName);  // Filename will be user_email + original file extension
    }
});

// Setup the multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Only allow image files
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png) are allowed'));
        }
    }
}).single('productImage');  // Limit to only one file upload

export default upload;
