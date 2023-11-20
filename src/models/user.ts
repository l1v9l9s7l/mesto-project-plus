import mongoose from 'mongoose';
import { TUser } from '../utils/types';

const userSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', userSchema);
