import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import { IUserRequest } from '../utils/types';
import User from '../models/user';
import { VALIDATION_ERROR, CAST_ERROR } from '../utils/const';
import {
  BAD_REQUEST, NOT_FOUND, CREATED, DONE, CONFLICT,
} from '../utils/errors';
import ConflictError from '../errors/ConflictError';

const { JWT_SECRET = '3d2b817067b356355745da78651af18f0c754aae7b11fab7878ee6ef3975f0dc' } = process.env;

// Нашли всех пользователей по схеме User
export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => { res.status(DONE.code).send({ data: users }); }) // Отправляем данные польз-ей
  .catch(next);

export const getUserById = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        res.status(DONE.code).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message.getUser);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const getUserMe = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        res.status(DONE.code).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message.getUser);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => bcrypt
  .hash(req.body.password, 10)
  .then((hash) => User.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  }))
  .then((user) => res.status(CREATED.code).send(user))
  .catch((err) => {
    if (err.name === VALIDATION_ERROR) {
      next(new BadRequestError(err.message));
    } else if (err.code === CONFLICT.code) {
      next(new ConflictError(CONFLICT.message.user));
    } else {
      next(err);
    }
  });

export const updateUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.status(DONE.code).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message.getUser);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new BadRequestError(BAD_REQUEST.message.userUpdate));
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: IUserRequest, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.status(DONE.code).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message.getUser);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new BadRequestError(BAD_REQUEST.message.avatarUpdate));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }); // создадим токен
      res.send({ token }); // вернём токен
    })
    .catch(next);
};
