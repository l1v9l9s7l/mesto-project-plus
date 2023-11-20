export const DONE = {
  code: 200,
  message: {
    all: 'Запрос выполнен.',
    deleteCard: 'Карточка удалена',
  },
};

export const CREATED = {
  code: 201,
  message: 'Пользователь создан.',
};

export const BAD_REQUEST = {
  code: 400,
  message: {
    userCreate: 'Переданы некорректные данные при создании пользователя.',
    cardCreate: 'Переданы некорректные данные при создании карточки.',
    userUpdate: 'Переданы некорректные данные при обновлении профиля',
    avatarUpdate: 'Переданы некорректные данные при обновлении аватара.',
    actionLikeCard: 'Переданы некорректные данные для постановки/снятии лайка.',
  },
};

export const AUTHORIZATION = {
  code: 401,
  message: {
    error: 'Неправильная почта или пароль',
    unValidToken: 'Некорректный токен',
    notToken: 'Отсутствует заголовок авторизации',
  },
};

export const FORBIDDEN = {
  code: 403,
  message: {
    card: 'Удалять не свои карточки запрещено',
  },
};

export const NOT_FOUND = {
  code: 404,
  message: {
    getUser: 'Пользователь по указанному _id не найден.',
    updateUserInfo: 'Переданы некорректные данные при обновлении профиля.',
    cardDelete: 'Карточка с указанным _id не найдена.',
    actionLikeCard: 'Передан несуществующий _id карточки.',
  },
};

export const CONFLICT = {
  code: 409,
  message: {
    user: 'Пользователь с таким email уже существует',
  },
};

export const INTERNAL_SERVER_ERROR = {
  code: 500,
  message: 'На сервере произошла ошибка.',
};
