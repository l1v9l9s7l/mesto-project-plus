import mongoose from 'mongoose';
import { TCard } from '../utils/types';
import { regexUrl } from '../utils/const';

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
    validate: {
      validator: (v: string) => regexUrl.test(v),
      message: 'Некорректный url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('card', cardSchema);
