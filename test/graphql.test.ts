import mongoose from 'mongoose';
import {getNotFound} from './testFunction';
import app from '../src/app';
import {LoginResponse} from '../src/types/MessageTypes';
import {UserInput} from '../src/types/DBTypes';
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

  it('should delete first user', async () => {
    await deleteUser(app, userData.token);
  });

  it('should delete second user by admin', async () => {
    await deleteUserAsAdmin(app, adminData.token, userData2.user.id);
  });
});
