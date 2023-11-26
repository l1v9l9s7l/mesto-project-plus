import { Router } from 'express';
import {
  updateUser, updateUserAvatar, getUsers, getUserById, getUserMe,
} from '../controllers/users';

import { updateUserAvatarValidation, updateUserProfileValidation, getUserByIdValidation } from '../validators/userValidators';

const userRouter = Router();

userRouter.get('/users', getUsers); // Роут получения пользователей
userRouter.get('/users/:userId', getUserByIdValidation, getUserById); // Роут получения пользователя по _id
userRouter.get('/users/me', getUserMe); // Роут получения информации своего профиля
userRouter.patch('/users/me', updateUserProfileValidation, updateUser); // Роут обновления профиля
userRouter.patch('/users/me/avatar', updateUserAvatarValidation, updateUserAvatar); // Роут обновления аватара профиля

export default userRouter;
