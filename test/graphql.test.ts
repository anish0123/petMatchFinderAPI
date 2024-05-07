import mongoose from 'mongoose';
import {getNotFound} from './testFunction';
import app from '../src/app';
import {LoginResponse, UploadResponse} from '../src/types/MessageTypes';
import {Animal, Category, UserInput} from '../src/types/DBTypes';
import {
  deleteUser,
  deleteUserAsAdmin,
  getUser,
  getUsers,
  login,
  postUser,
  putUser,
} from './userFunction';
import randomstring from 'randomstring';
import {deleteCategory, postCategory, putCategory} from './categoryFunction';
import {
  deleteAnimal,
  getAnimal,
  getAnimalByOwner,
  getAnimals,
  postAnimal,
  postFile,
  putAnimal,
} from './animalFunction';

const uploadApp = process.env.UPLOAD_URL as string;

describe('Testing graphql api for Pet Match Finder app', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  let userData: LoginResponse;
  let userData2: LoginResponse;
  let adminData: LoginResponse;
  let category: Category;

  const testUser: UserInput = {
    user_name: 'testUser' + randomstring.generate(5),
    email: randomstring.generate(5) + '@test.fi',
    password: 'testPassword',
  };

  const testUser2: UserInput = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
  };

  const adminUser: Partial<UserInput> = {
    email: 'admin@metropolia.fi',
    password: '12345',
  };

  it('should create a new user', async () => {
    await postUser(app, testUser);
  });

  it('should create another user', async () => {
    await postUser(app, testUser2);
  });

  it('should login first user', async () => {
    const input = {
      email: testUser.email!,
      password: testUser.password!,
    };
    userData = await login(app, input);
  });

  it('should login second user', async () => {
    const input = {
      email: testUser2.email,
      password: testUser2.password,
    };
    userData2 = await login(app, input);
  });

  it('should login admin user', async () => {
    const input = {
      email: adminUser.email!,
      password: adminUser.password!,
    };
    adminData = await login(app, input);
  });

  it('should update first user', async () => {
    await putUser(app, userData.token);
  });

  it('should return all users', async () => {
    await getUsers(app);
  });

  it('should return single user', async () => {
    await getUser(app, userData.user.id);
  });

  it('should add category', async () => {
    category = await postCategory(app, adminData.token);
  });

  it('should update category', async () => {
    await putCategory(app, adminData.token, category.id);
  });

  let uploadData: UploadResponse;
  let animal: Animal;

  it('should add animal', async () => {
    uploadData = await postFile(uploadApp, userData.token);
    const animalInput: Omit<Animal, 'id' | 'owner'> = {
      adoptionStatus: 'available',
      animal_name: 'testAnimal',
      birthdate: new Date('2010-10-10'),
      category: category.id,
      description: 'testDescription',
      weight: 10,
      price: 100,
      listedDate: new Date(),
      location: uploadData.data.location,
      image: uploadData.data.filename,
      gender: 'male',
    };
    animal = await postAnimal(app, animalInput, adminData.token!);
  });

  it('should update the animal', async () => {
    await putAnimal(app, animal.id, adminData.token);
  });

  it('should return all animals', async () => {
    await getAnimals(app);
  });

  it('should return single animal', async () => {
    await getAnimal(app, animal.id);
  });

  it('should return animals by owner', async () => {
    await getAnimalByOwner(app, adminData.user.id);
  });

  it('should delete animal', async () => {
    await deleteAnimal(app, adminData.token, animal.id);
  });

  it('should delete category', async () => {
    await deleteCategory(app, adminData.token, category.id);
  });

  it('should delete first user', async () => {
    await deleteUser(app, userData.token);
  });

  it('should delete second user by admin', async () => {
    await deleteUserAsAdmin(app, adminData.token, userData2.user.id);
  });
});
