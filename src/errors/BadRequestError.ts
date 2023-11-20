import { BAD_REQUEST } from '../utils/errors';

export default class BadRequestError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST.code;
  }
}
