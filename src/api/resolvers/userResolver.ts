import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';
import {
  AdoptionApplication,
  Animal,
  User,
  UserInput,
  UserWithoutPasswordRole,
} from '../../types/DBTypes';
import fetchData from '../../lib/fetchData';
import {MessageResponse} from '../../types/MessageTypes';

export default {
  Animal: {
    owner: async (parent: Animal): Promise<UserWithoutPasswordRole> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('No auth url set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + parent.owner,
      );
      user.id = user._id;
      return user;
    },
  },
  AdoptionApplication: {
    adopter: async (
      parent: AdoptionApplication,
    ): Promise<UserWithoutPasswordRole> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('No auth url set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + parent.adopter,
      );
      user.id = user._id;
      return user;
    },
  },
  Query: {
    users: async () => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('No auth url set in .env file');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');
      users.forEach((user) => {
        user.id = user._id;
      });
      return users;
    },
    userById: async (_parent: undefined, args: {id: string}) => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('No auth url set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + args.id,
      );
      user.id = user._id;
      return user;
    },
    checkToken: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (context.userdata) {
        context.userdata.user.id = context.userdata?.user._id;
      }

      const response = {
        message: 'Token is valid',
        token: context.userdata?.token,
        user: context.userdata?.user,
      };
      return response;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {user: User},
    ): Promise<{message: string; user: UserWithoutPasswordRole}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('No auth url set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };
      const registerResponse = await fetchData<
        MessageResponse & {data: UserWithoutPasswordRole}
      >(process.env.AUTH_URL + '/users', options);
      console.log('registerResponse: ', registerResponse);
      return {user: registerResponse.data, message: registerResponse.message};
    },
    login: async (
      _parent: undefined,
      args: {credentials: {email: string; password: string}},
    ): Promise<
      MessageResponse & {token: string; user: UserWithoutPasswordRole}
    > => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('No auth url set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.credentials),
      };
      const loginResponse = await fetchData<
        MessageResponse & {token: string; user: UserWithoutPasswordRole}
      >(process.env.AUTH_URL + '/auth/login', options);
      loginResponse.user.id = loginResponse.user._id;
      return loginResponse;
    },
    updateUser: async (
      _parent: undefined,
      args: {user: UserInput},
      context: MyContext,
    ) => {
      try {
        if (!context.userdata) {
          throw new GraphQLError('User not authenticated', {
            extensions: {code: 'UNAUTHENTICATED'},
          });
        }
        const options = {
          method: 'PUT',
          headers: {
            'CONTENT-TYPE': 'application/json',
            Authorization: 'Bearer ' + context.userdata.token,
          },
          body: JSON.stringify(args.user),
        };
        const user = await fetchData<
          MessageResponse & {data: UserWithoutPasswordRole}
        >(process.env.AUTH_URL + '/users', options);
        console.log('user: ', user);
        return user;
      } catch (error) {
        console.log('error: ', error);
      }
    },
    deleteUser: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ): Promise<{message: string; data: UserWithoutPasswordRole}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + context.userdata.token,
        },
      };
      const user = await fetchData<
        MessageResponse & {data: UserWithoutPasswordRole}
      >(process.env.AUTH_URL + '/users', options);
      return user;
    },
    deleteUserAsAdmin: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; data: UserWithoutPasswordRole}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      if (context.userdata.user.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {code: 'UNAUTHORIZED'},
        });
      }
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + context.userdata.token,
        },
      };
      const user = await fetchData<
        MessageResponse & {data: UserWithoutPasswordRole}
      >(process.env.AUTH_URL + `/users/${args.id}`, options);
      return user;
    },
  },
};
