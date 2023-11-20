import { NextFunction, Request, Response } from 'express';
import { ICardRequest } from '../utils/types';
import Card from '../models/card';
import { VALIDATION_ERROR, CAST_ERROR } from '../utils/const';
import { BAD_REQUEST, NOT_FOUND } from '../utils/errors';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

// Нашли все карточки по схеме Card
export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => { res.status(200).send({ data: cards }); }) // Отправляем данные карточек
  .catch(next); // Переходим к следующему мидлвару при ошибке

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new BadRequestError(BAD_REQUEST.message.cardCreate));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message.cardDelete);
      }
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const putCardLike = (req: ICardRequest, res: Response) => {
  const id = req.params.cardId;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(
    id,
    // $addToSet Добавляет элемент в массив, если там его еще нет
    { $addToSet: { likes: owner } },
    // Опции обновления. new: true - указывает что функция дожна возвращать обновленный объект а
    // "runValidators: true" указывает, что необходимо выполнять валидацию данных перед обновлением
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message.actionLikeCard);
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => res.status(500).send(err));
};

export const deleteCardLike = (req: ICardRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(
    id,
    // $pull убирает элемент из массива, если он там есть
    { $pull: { likes: owner } },
    // Опции обновления. new: true - указывает что функция дожна возвращать обновленный объект а
    // "runValidators: true" указывает,что необходимо выполнять валидацию данных перед обновлением
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message.actionLikeCard);
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadRequestError(BAD_REQUEST.message.actionLikeCard));
      } else {
        next(err);
      }
    });
};
