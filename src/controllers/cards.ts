import { Request, Response } from 'express';
import { ICardRequest } from '../utils/types';
import Card from '../models/card';
import { VALIDATION_ERROR, CAST_ERROR } from '../utils/const';
import {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, DONE, FORBIDDEN,
} from '../utils/errors';

// Нашли все карточки по схеме Card
export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => { res.status(200).send({ data: cards }); }) // Отправляем данные карточек
  .catch(() => res.status(INTERNAL_SERVER_ERROR.code)
    .send({ message: INTERNAL_SERVER_ERROR.message }));

export const createCard = (req: ICardRequest, res: Response) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user?._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.cardCreate });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};

export const deleteCard = (req: ICardRequest, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card && card.owner.toString() === req.user?._id) {
        return res.status(DONE.code).send(DONE.message.deleteCard);
      } if (card?.owner.toString() !== req.user?._id) {
        return res.status(FORBIDDEN.code).send({ message: FORBIDDEN.message.card });
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message.cardDelete });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.cardDelete });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
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
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(DONE.code).send({ data: card });
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message.actionLikeCard });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.cardDelete });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};

export const deleteCardLike = (req: ICardRequest, res: Response) => {
  const id = req.params.cardId;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(
    id,
    // $pull убирает элемент из массива, если он там есть
    { $pull: { likes: owner } },
    // Опции обновления. new: true - указывает что функция дожна возвращать обновленный объект а
    // "runValidators: true" указывает,что необходимо выполнять валидацию данных перед обновлением
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(DONE.code).send({ data: card });
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message.actionLikeCard });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.cardDelete });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};
