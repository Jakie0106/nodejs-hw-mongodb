import mongoose from 'mongoose';

const id = '67463aaccc4b62f3aa015f53';

if (mongoose.Types.ObjectId.isValid(id)) {
  console.log('ID is valid');
} else {
  console.log('ID is invalid');
}
