import express from 'express'; // подключаем express
import mongoose from 'mongoose'; // подключаем mongoose, подключаем express
import { errors } from 'celebrate';
import { login, createUser } from './controllers/users';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { DEFAULT_DB_URL } from './utils/const';
import { NOT_FOUND } from './utils/errors';
import authMiddlware from './middlwares/auth';
import errorMiddleware from './middlwares/error';
import { requestLogger, errorLogger } from './middlwares/logger';

const { PORT = 3000 } = process.env;
const app = express(); // создаем приложение методом экспресс
app.use(express.json()); // Разбирает тело запроса и преобразует его в объект JS

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddlware); // защищаем все роуты кроме регистрации и логина

app.use(userRouter);
app.use(cardRouter);

// Обработка несуществующих роутов
app.use((req, res) => {
  res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message.getPage });
});

app.use(errorLogger);

app.use(errors());

app.use(errorMiddleware);

mongoose.connect(DEFAULT_DB_URL) // подключаемся к серверу MongoDB
  .then(() => console.log('Connected to mestodb'))
  .catch((err) => console.error('Error DB:', err.message));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
}); // Если всё работает, консоль покажет, какой порт приложение слушает
