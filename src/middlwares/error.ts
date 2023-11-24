import { NextFunction, Request, Response } from 'express';
import { IError } from '../utils/types';
import { INTERNAL_SERVER_ERROR } from '../utils/errors';

const error = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = INTERNAL_SERVER_ERROR.code, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR.code ? INTERNAL_SERVER_ERROR.message : message,
  });
  next();
};

export default error;
