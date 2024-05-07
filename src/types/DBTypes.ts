import {Point} from 'geojson';
import mongoose, {Document} from 'mongoose';

type Category = {
  _id: mongoose.Types.ObjectId;
  category_name: string;
};

type Animal = Partial<Document> & {
  animal_name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  birthdate: Date;
  owner: mongoose.Types.ObjectId;
  gender: 'male' | 'female';
  image: string;
  price: number;
  location: Point;
  weight: number;
  listedDate: Date;
  adoptionStatus: 'adopted' | 'available';
};

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

type Rating = Partial<Document> & {
  rating: number;
  ratedBy: mongoose.Types.ObjectId;
  ratedTo: mongoose.Types.ObjectId;
  description: string;
  ratedDate: Date;
};

type AdoptionApplication = Partial<Document> & {
  animal: mongoose.Types.ObjectId;
  adopter: mongoose.Types.ObjectId;
  description: string;
  appliedDate: Date;
  applicationStatus: 'pending' | 'approved' | 'rejected';
};

type TokenContent = {
  token: string;
  user: UserWithoutPassword;
};

type UserWithoutPassword = Omit<User, 'password'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

type coordinates = {
  lat: number;
  lng: number;
};

type LocationInput = {
  topRight: coordinates;
  bottomLeft: coordinates;
};

export {
  Category,
  Animal,
  User,
  AdoptionApplication,
  TokenContent,
  UserInput,
  UserWithoutPassword,
  UserWithoutPasswordRole,
  coordinates,
  LocationInput,
  Rating,
};
