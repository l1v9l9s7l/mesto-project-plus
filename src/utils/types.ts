import mongoose from 'mongoose';
import { Request } from 'express';

export type TUser = {
  name: string,
  email: string,
  password: string,
  about: string,
  avatar: string
}

export type TCard = {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: mongoose.Schema.Types.ObjectId[],
  createdAt: Date
}

export interface IUserRequest extends Request {
  user?: {
    _id: string
  }
}

export interface ICardRequest extends Request {
  user?: {
    _id: string
  }
}

export interface IError extends Error {
  statusCode: number;
  code?: number;
}
