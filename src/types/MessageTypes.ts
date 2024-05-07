import {Point} from 'geojson';
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
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    location: Point;
  };
};

export {
  MessageResponse,
  ErrorResponse,
  LoginResponse,
  UserResponse,
  UploadResponse,
};
