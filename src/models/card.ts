import mongoose from 'mongoose';
import { TCard } from '../utils/types';

const cardSchema = new mongoose.Schema<TCard>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Card', cardSchema);
