import { NOT_FOUND } from '../utils/errors';

export default class NotFoundError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND.code;
  }
}
