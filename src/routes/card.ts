import { Router } from 'express';
import {
  createCard, getCards, deleteCard, putCardLike, deleteCardLike,
} from '../controllers/cards';
import { createCardValidation, getCardByIdValidation } from '../validators/cardValidators';

const cardRouter = Router();

cardRouter.get('/cards', getCards); // Роут получения карточек
cardRouter.post('/cards', createCardValidation, createCard); // Роут создания карточки
cardRouter.delete('/cards/:cardId', getCardByIdValidation, deleteCard); // Роут удаления карточки по идентификатору
cardRouter.put('/cards/:cardId/likes', getCardByIdValidation, putCardLike); // Роут добавления лайка карточки
cardRouter.delete('/cards/:cardId/likes', getCardByIdValidation, deleteCardLike); // Роут удаления лайка карточки

export default cardRouter;
