import { CONFLICT } from '../utils/errors';

export default class ConflictError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT.code;
  }
}
