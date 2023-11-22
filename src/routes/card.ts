import { Router } from 'express';
import {
  createCard, getCards, deleteCard, putCardLike, deleteCardLike,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/cards', getCards); // Роут получения карточек
cardRouter.post('/cards', createCard); // Роут создания карточки
cardRouter.delete('/cards/:cardId', deleteCard); // Роут удаления карточки по идентификатору
cardRouter.put('/cards/:cardId/likes', putCardLike); // Роут добавления лайка карточки
cardRouter.delete('/cards/:cardId/likes', deleteCardLike); // Роут удаления лайка карточки

export default cardRouter;
