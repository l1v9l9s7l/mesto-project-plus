import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { regexUrl } from '../utils/const';
import { TUser } from '../utils/types';

interface UserModel extends Model<TUser> {
  findUserByCredentials:
  // eslint-disable-next-line no-unused-vars
  (email: string, password: string) => Promise<Document<unknown, any, TUser>>
}

const userSchema = new mongoose.Schema<TUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // принимает значение поля (v) и проверяет что это email, если нет, выводим message
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы.
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто', // Если данные не были переданы, будет использоваться как значение по умолчанию
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => regexUrl.test(v),
      message: 'Некорректный url',
    },
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    // попытаемся найти пользователя по почте
    // this — это модель User.
    return this.findOne({ email }).select('+password') // .select('+password') - т.к. по умолчанию
    // в userSchema мы отключили возврат хеша пароля а здесь он нам нужен, включим его в выборку
      .then((user: TUser | null) => {
        // не нашёлся — отклоняем промис
        if (!user) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        // нашёлся — сравниваем хеши
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) { // отклоняем промис
              return Promise.reject(new Error('Неправильные почта или пароль'));
            }
            return user;
          });
      });
  },
);

export default mongoose.model<TUser, UserModel>('user', userSchema);
