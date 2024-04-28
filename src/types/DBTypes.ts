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
  location: Point;
  weight: number;
  listedDate: Date;
  adoptionStatus: 'adopted' | 'available';
};

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'adopter' | 'lister' | 'admin';
  streetAddress: string;
  postalCode: String;
  city: string;
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
};
