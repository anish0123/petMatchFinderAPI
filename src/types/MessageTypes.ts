import {UserWithoutPasswordRole} from './DBTypes';

type MessageResponse = {
  message: string;
};

type LoginResponse = {
  message: string;
  token: string;
  user: UserWithoutPasswordRole;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};
type UserResponse = MessageResponse & {
  user: UserWithoutPasswordRole;
};

export {MessageResponse, ErrorResponse, LoginResponse, UserResponse};
