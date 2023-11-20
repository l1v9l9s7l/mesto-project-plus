import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { VALIDATION_ERROR, CAST_ERROR } from '../utils/const';
import { BAD_REQUEST } from '../utils/errors';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { NOT_FOUND } from '../utils/errors';
import { IUserRequest } from 'utils/types';
// import bcrypt from 'bcryptjs';


export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({}) //Нашли всех пользователей по схеме User
.then((users) => {res.status(200).send({data:users})}) //Отправляем данные пользователей
.catch(next); //Переходим к следующему мидлвару при ошибке

export const getUserById = (req: IUserRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  return User.findById(id)
  .orFail(() => new NotFoundError(NOT_FOUND.message.getUser))
  .then((user) => {
    if (!user) {
      throw new NotFoundError(NOT_FOUND.message.getUser);
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === CAST_ERROR) {
      next(new NotFoundError(NOT_FOUND.message.getUser));
    }
    if (err.name === VALIDATION_ERROR) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
User.create({
  name: req.body.name,
  about: req.body.about,
  avatar: req.body.avatar
})
.then((user) => res.status(201).send(user))
.catch((err) => {
  if (err.name === VALIDATION_ERROR) {
    next(new BadRequestError(BAD_REQUEST.message.cardCreate));
  } else {
    next(err);
  }
});
}

export const updateUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(req.user?._id, { name: req.body.name, about: req.body.about})
  .orFail(() => new NotFoundError(NOT_FOUND.message.getUser))
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    if (err.name === VALIDATION_ERROR) {
      next(new BadRequestError(BAD_REQUEST.message.userUpdate));
    } else {
      next(err);
    }
  });
}

export const updateUserAvatar = (req: IUserRequest, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(req.user?._id, { avatar: req.body.avatar})
  .orFail(() => new NotFoundError(NOT_FOUND.message.getUser)) //если операция User.findByIdAndUpdate не найдет пользователя для обновления, то метод orFail Если поиск пользователя провалится сгенерирует ошибку
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    if (err.name === VALIDATION_ERROR) {
      next(new BadRequestError(BAD_REQUEST.message.cardCreate));
    } else {
      next(err);
    }
  });
}




