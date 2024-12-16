import cloudinary from 'cloudinary';
import fs from 'fs/promises';

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    console.log('Uploading file to Cloudinary:', file.path);
    const response = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
