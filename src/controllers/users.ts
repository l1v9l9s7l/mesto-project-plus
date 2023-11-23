import { Request, Response } from 'express';
import { IUserRequest } from '../utils/types';
import User from '../models/user';
import { VALIDATION_ERROR, CAST_ERROR } from '../utils/const';
import {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, CREATED, DONE,
} from '../utils/errors';

// Нашли всех пользователей по схеме User
export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => { res.status(DONE.code).send({ data: users }); }) // Отправляем данные польз-ей
  .catch(() => res.status(INTERNAL_SERVER_ERROR.code)
    .send({ message: INTERNAL_SERVER_ERROR.message }));

export const getUserById = (req: IUserRequest, res: Response) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        res.status(DONE.code).send(user);
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message.getUser });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.cardDelete });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};

export const createUser = (req: Request, res: Response) => {
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.status(CREATED.code).send(user))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.userCreate });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};

export const updateUser = (req: IUserRequest, res: Response) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.status(DONE.code).send(user);
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message.updateUserInfo });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.userUpdate });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};

export const updateUserAvatar = (req: IUserRequest, res: Response) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.status(DONE.code).send(user);
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.avatarUpdate });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};
