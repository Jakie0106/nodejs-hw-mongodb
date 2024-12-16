import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

// Явно указываем путь к файлу .env
dotenv.config({ path: '../.env' });

console.log('ENABLE_CLOUDINARY:', process.env.ENABLE_CLOUDINARY);
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

if (process.env.ENABLE_CLOUDINARY === 'true') {
  cloudinary.v2.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('Cloudinary is enabled and configured.');

  (async () => {
    try {
      const result = await cloudinary.v2.uploader.upload(
        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
        { public_id: 'test_image', secure: true },
      );

      console.log('Cloudinary upload result:', result);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
    }
  })();
} else {
  console.log('Cloudinary is disabled.');
}
