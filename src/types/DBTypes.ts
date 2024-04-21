import {Point} from 'geojson';
import mongoose, {Document} from 'mongoose';

type Category = {
  _id: mongoose.Types.ObjectId;
  category_name: string;
};

type Animal = Partial<Document> & {
  animal_id: mongoose.Types.ObjectId;
  animal_name: string;
  category: mongoose.Types.ObjectId;
  birthdate: Date;
  owner: mongoose.Types.ObjectId;
  gender: 'male' | 'female';
  image: string;
  location: Point;
  weight: number;
};

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  streetAddress: string;
  postalCode: number;
  city: string;
};

type LoginUser = Omit<User, 'password'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};


type UserWithoutPassword = Omit<User, 'password'>;

type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

export {
  Category,
  Animal,
  User,
  TokenContent,
  LoginUser,
  UserWithoutPassword,
  UserWithoutPasswordRole,
};
