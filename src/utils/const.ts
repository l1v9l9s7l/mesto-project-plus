export const DEFAULT_DB_URL = 'mongodb://localhost:27017/mestodb'; // Адрес подключения к БД

// Ошибки
export const VALIDATION_ERROR = 'ValidationError';
export const CAST_ERROR = 'CastError';

// Описание ошибок
export const USER_ERR_NAME = 'Имя пользователя должно быть от 2 до 30 символов';
export const USER_ERR_ABOUT = 'Описание должно быть от 2 до 200 символов';
export const USER_ERR_EMAIL_EMPTY = 'E-mail должен быть введен';
export const USER_ERR_EMAIL = 'Не корректно задан e-mail';
export const USER_ERR_AVATAR = 'URL аватара указано не корректно';
export const USER_ERR_PASSWORD_EMPTY = 'Пароль должен быть введен';
export const USER_ERR_PASSWORD_LEN = 'Длина пароля должна быть не меньше 6 символов';

export const regexUrl = /^(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/;
