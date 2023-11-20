import { Request, Response } from 'express';
import { ICardRequest } from '../utils/types';
import Card from '../models/card';
import { VALIDATION_ERROR, CAST_ERROR } from '../utils/const';
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from '../utils/errors';
import NotFoundError from '../errors/NotFoundError';

// Нашли все карточки по схеме Card
export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => { res.status(200).send({ data: cards }); }) // Отправляем данные карточек
  .catch(() => res.status(INTERNAL_SERVER_ERROR.code)
    .send({ message: INTERNAL_SERVER_ERROR.message }));

export const createCard = (req: Request, res: Response) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
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

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message.cardDelete);
      }
    })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR.code)
      .send({ message: INTERNAL_SERVER_ERROR.message }));
};

export const putCardLike = (req: ICardRequest, res: Response) => {
  const id = req.params.cardId;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(
    id,
    // $addToSet Добавляет элемент в массив, если там его еще нет
    { $addToSet: { likes: owner } },
    // Опции обновления. new: true - указывает что функция дожна возвращать обновленный объект а
    // "runValidators: true" указывает что необходимо выполнять валидацию данных перед обновлением
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message.actionLikeCard);
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR.code)
      .send({ message: INTERNAL_SERVER_ERROR.message }));
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
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message.actionLikeCard });
      }
      return res.status(INTERNAL_SERVER_ERROR.code)
        .send({ message: INTERNAL_SERVER_ERROR.message });
    });
};
