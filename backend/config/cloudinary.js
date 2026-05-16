import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("CLOUDINARY UPLOAD STARTING for file:", file.originalname);
    const isPDF = file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')
    
    return {
      folder: 'medify_materials',
      resource_type: 'auto',
      access_mode: 'public'
    }
  }
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
