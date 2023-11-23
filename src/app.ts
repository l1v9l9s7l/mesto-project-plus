import express from 'express'; // подключаем express
import mongoose from 'mongoose'; // подключаем mongoose, подключаем express
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { IUserRequest } from './utils/types';
import { DEFAULT_DB_URL } from './utils/const';

const { PORT = 3000 } = process.env;
const app = express(); // создаем приложение методом экспресс
app.use(express.json()); // Разбирает тело запроса и преобразует его в объект JS

app.use((req: IUserRequest, res, next) => { // Мидлвар добавляющий в каждый запрос объект user
  req.user = {
    _id: '6558c620400ff2d4f9281a01', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

// Обработка несуществующих роутов
app.use((req, res) => {
  res.status(404).render('404');
});

mongoose.connect(DEFAULT_DB_URL) // подключаемся к серверу MongoDB
  .then(() => console.log('Connected to mestodb'))
  .catch((err) => console.error('Error DB:', err.message));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
}); // Если всё работает, консоль покажет, какой порт приложение слушает
