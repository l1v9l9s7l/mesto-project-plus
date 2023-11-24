import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  const { JWT_SECRET = '3d2b817067b356355745da78651af18f0c754aae7b11fab7878ee6ef3975f0dc' } = process.env;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
