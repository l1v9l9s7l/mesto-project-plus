import { Router } from 'express';
import {
  createUser, updateUser, updateUserAvatar, getUsers, getUserById,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/users', getUsers); // Роут получения пользователей
userRouter.get('/users/:userId', getUserById); // Роут получения пользователя по _id
userRouter.post('/users', createUser); // Роут создания пользователя
userRouter.patch('/users/me', updateUser); // Роут обновления профиля
userRouter.patch('/users/me/avatar', updateUserAvatar); // Роут обновления аватара профиля

export default userRouter;
