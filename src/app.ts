import express from 'express'; // подключаем express
import mongoose from 'mongoose'; // подключаем mongoose, подключаем express
import { errors } from 'celebrate';
import { IUserRequest } from './utils/types';
import { requestLogger, errorLogger } from './middlewares/logger';
import { DEFAULT_DB_URL } from './utils/const';
import {
  createUser, updateUser, updateUserAvatar, getUsers,
} from './controllers/users';
import {
  createCard, getCards, deleteCard, putCardLike, deleteCardLike,
} from './controllers/cards';

const { PORT = 3000 } = process.env;
const app = express(); // создаем приложение методом экспресс
app.use(requestLogger); // Применяем логгер ко всем обработчикам роутов
app.use(express.json()); // Разбирает тело запроса и преобразует его в объект JS

app.use((req: IUserRequest, res, next) => { // Мидлвар добавляющий в каждый запрос объект user
  req.user = {
    _id: '6558c620400ff2d4f9281a01', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.get('/users', getUsers); // Роут получения пользователей
app.get('/users/:userId', getUsers); // Роут получения пользователя по _id
app.post('/users', createUser); // Роут создания пользователя
app.get('/cards', getCards); // Роут получения карточек
app.post('/cards', createCard); // Роут создания карточки
app.delete('/cards:cardId', deleteCard); // Роут удаления карточки по идентификатору
app.patch('/users/me', updateUser); // Роут обновления профиля
app.patch('/users/me/avatar', updateUserAvatar); // Роут обновления аватара
app.put('/cards/:cardId/likes', putCardLike); // Роут добавления лайка карточки
app.delete('/cards/:cardId/likes', deleteCardLike); // Роут удаления лайка карточки

app.use(errorLogger); // подключаем логер ошибок после обработчиков роутов и до обработчика ошибок
app.use(errors());

mongoose.connect(DEFAULT_DB_URL) // подключаемся к серверу MongoDB
  .then(() => console.log('Connected to mestodb'))
  .catch((err) => console.error('Error DB:', err.message));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
}); // Если всё работает, консоль покажет, какой порт приложение слушает
