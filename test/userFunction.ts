/* eslint-disable node/no-unpublished-import */
import {Application} from 'express';
import {UserInput, UserWithoutPasswordRole} from '../src/types/DBTypes';
import request from 'supertest';
import {LoginResponse} from '../src/types/MessageTypes';
import randomstring from 'randomstring';

const login = (
  url: string | Application,
  input: {email: string; password: string},
): Promise<LoginResponse> => {
  console.log('input: ', input);
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Login($credentials: Credentials!) {
          login(credentials: $credentials) {
            message
            token
            user {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          credentials: input,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response: ', response.body);
          const user = input;
          const userData = response.body.data.login;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.email).toBe(user.email);
          resolve(response.body.data.login);
        }
      });
  });
};

const postUser = (
  url: string | Application,
  user: UserInput,
): Promise<UserWithoutPasswordRole> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($user: UserInput!) {
          register(user: $user) {
            message
            user {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          user: user,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response.body :', response.body);
          const userData = response.body.data.register;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(user.user_name);
          expect(userData.user.email).toBe(user.email);
          resolve(response.body.data.register);
        }
      });
  });
};

const putUser = (
  url: string | Application,
  token: string,
): Promise<UserWithoutPasswordRole> => {
  const newValue = 'Test Loser ' + randomstring.generate(7);
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUser($user: UserModify!) {
          updateUser(user: $user) {
            message
            user {
              email
              id
              user_name
            }
            token
          }
        }`,
        variables: {
          user: {
            user_name: newValue,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response.body: ', response.body);
          const userData = response.body.data.updateUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(newValue);
          resolve(response.body.data.updateUser);
        }
      });
  });
};

const deleteUser = (
  url: string | Application,
  token: string,
): Promise<UserWithoutPasswordRole> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser {
          deleteUser {
            message
            user {
              id
              email
              user_name
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          resolve(response.body.data.deleteUser);
        }
      });
  });
};

const deleteUserAsAdmin = (
  url: string | Application,
  token: string,
  id: string,
): Promise<UserWithoutPasswordRole> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser($deleteUserAsAdminId: ID!) {
          deleteUserAsAdmin(id: $deleteUserAsAdminId) {
            message
            user {
              email
              id
              user_name
            }
          }
        }`,
        variables: {
          deleteUserAsAdminId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response.body: ', response.body);
          const userData = response.body.data.deleteUserAsAdmin;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          resolve(response.body.data.deleteUserAsAdmin);
        }
      });
  });
};

const getUsers = (
  url: string | Application,
): Promise<UserWithoutPasswordRole[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: '{users{id user_name email}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('user_name');
          expect(users[0]).toHaveProperty('email');
          resolve(response.body.data.users);
        }
      });
  });
};

const getUser = (
  url: string | Application,
  id: string,
): Promise<UserWithoutPasswordRole> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query UserById($userByIdId: ID!) {
          userById(id: $userByIdId) {
            user_name
            id
            email
          }
        }`,
        variables: {
          userByIdId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.userById;
          expect(user.id).toBe(id);
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          resolve(response.body.data.userById);
        }
      });
  });
};
export {
  postUser,
  login,
  putUser,
  deleteUser,
  deleteUserAsAdmin,
  getUsers,
  getUser,
};
