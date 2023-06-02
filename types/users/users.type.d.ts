import { User } from '@prisma/client';
export type GetMeResponse = User;
export type CreateUserResponse = User;
export type UpdateUserResponse = User;
export type GetUserResponse = Omit<User, 'email'>;
