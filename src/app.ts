import express from 'express'; //подключаем express
import mongoose from 'mongoose'; //подключаем mongoose
import bcrypt from 'bcryptjs'; // импортируем bcrypt
import { Request, Response } from 'express';
import {requestLogger, errorLogger} from './middlewares/logger'
import {errors} from 'celebrate'


const animals:{[key: string]: any} = {
  dog: {
    type1: 'chihuahua',
    type2: 'bloodhound',
    type3: 'german shepherd'
  },
  cat: {
    type1: 'abyssinian',
    type2: 'dwelf',
    type3: 'highlander'
  }
};

console.log(animals)

const { PORT = 3000 } = process.env;

const app = express(); //создаем приложение методом экспресс
app.use(requestLogger) // Применяем логгер ко всем обработчикам роутов
mongoose.connect('mongodb://localhost:27017/mydb'); // подключаемся к серверу MongoDB
app.get('/', (req: Request, res: Response) => {
  res.status(200).send(
    `<html>
    <body>
        <p>Ответ на сигнал из далёкого космоса</p>
    </body>
    </html>`
  );
});;

app.use(errorLogger); // подключаем логер ошибок после обработчиков роутов и до обработчика ошибок
app.use(errors());


app.listen(PORT, () => {
  console.log(animals.dog.type1)
console.log(`App listening on port ${PORT}`) }) // Если всё работает, консоль покажет, какой порт приложение слушает

