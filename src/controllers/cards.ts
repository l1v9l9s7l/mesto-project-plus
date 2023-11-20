import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { VALIDATION_ERROR , CAST_ERROR} from '../utils/const';
import { BAD_REQUEST } from '../utils/errors';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenError from '../errors/ForbiddenError';
import { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } from '../utils/errors';
import { ICardRequest } from 'utils/types';


export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({}) //Нашли все карточки по схеме Card
.then((cards) => {res.status(200).send({data:cards})}) //Отправляем данные карточек
.catch(next); //Переходим к следующему мидлвару при ошибке

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
  }

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.cardId
  Card.findByIdAndRemove(req.params.id)
  .then((card) => {
    if (!card) {
      throw new NotFoundError(NOT_FOUND.message.cardDelete);
    }
    if (card.owner.toString() !== id) {
      throw new ForbiddenError(FORBIDDEN.message.card);
    }
    return Card.findByIdAndDelete(id);
  })
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if (err.name === CAST_ERROR) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  });
}

export const putCardLike = (req: ICardRequest, res: Response) => {
  const id = req.params;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: owner } }, // $addToSet Добавляет элемент в массив, если там его еще нет
    { new: true, runValidators: true }, //Опции обновления. new: true - указывает что функция дожна возвращать обновленный объект а "runValidators: true" указывает, что необходимо выполнять валидацию данных перед обновлением.
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError(NOT_FOUND.message.actionLikeCard);
    } else {
      res.status(200).send({ data: card });
    }
  })
  .catch(err => res.status(500).send(err));
}

export const deleteCardLike = (req: ICardRequest, res: Response, next: NextFunction) => {
  const id = req.params;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: owner } }, // $pull убирает элемент из массива, если он там есть
    { new: true, runValidators: true }, //Опции обновления. new: true - указывает что функция дожна возвращать обновленный объект а "runValidators: true" указывает, что необходимо выполнять валидацию данных перед обновлением.
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
}