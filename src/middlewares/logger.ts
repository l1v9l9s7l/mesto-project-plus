// импортируем нужные модули
import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

// //транспорт с ежедневной ротацией (передаем в массив transports при необходимости)
// const transport = new winston.transports.DailyRotateFile({
//   // указываем формат имени файла
//   filename: 'error-%DATE%.log',
//   // указываем шаблон для даты
//   datePattern: 'YYYY-MM-DD-HH',
//   // создает новый файл если старый превышает 20мб
//   maxSize: '20m',
//   // храним логи в зип врхиве для снижения веса
//   zippedArchive: true,
// //максимальное количество файлов или'14d',тогда будут хранится файлы только за последние 14 дней
//   maxFiles: 14,
// });

// создадим логер запросов
export const requestLogger = expressWinston.logger({
  // Массив в котором мы можем передавать различные транспорты для логов (консоль и request.log)
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(), // формат записи логов
});

// логер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }), // error.log - файл в который записываются ошибки
  ],
  format: winston.format.json(),
});
