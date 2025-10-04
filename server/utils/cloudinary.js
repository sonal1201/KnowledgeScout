import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "docs",
      resource_type: "auto",
    });
    fs.unlinkSync(file.path);

    return result.secure_url; // 
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null; 
  }
};
