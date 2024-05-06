import {GraphQLError} from 'graphql';
import {Animal, Category} from '../../types/DBTypes';
import categoryModel from '../models/categoryModel';
import {MyContext} from '../../types/MyContext';
import animalModel from '../models/animalModel';
import {Socket, io} from 'socket.io-client';
import {ClientToServerEvents, ServerToClientEvents} from '../../types/Socket';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}
// socket io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SOCKET_URL,
);

export default {
  Animal: {
    category: async (parent: Animal): Promise<Category> => {
      const category = await categoryModel.findById(parent.category);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    },
  },
  Query: {
    categories: async () => {
      return await categoryModel.find().select(' -__v');
    },
    category: async (_parent: undefined, args: {id: string}) => {
      const category = await categoryModel.findById(args.id).select(' -__v');
      if (!category) {
        throw new GraphQLError('Category not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return category;
    },
  },
  Mutation: {
    addCategory: async (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>},
      context: MyContext,
    ): Promise<{message: string; category?: Category}> => {
      if (!context.userdata || context.userdata.user.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {code: 'UNAUTHORIZED'},
        });
      }
      const newCategory = await categoryModel.create(args.category);
      if (newCategory) {
        socket.emit('update', 'category');
        return {message: 'Category added', category: newCategory};
      } else {
        throw new Error('Category not added');
      }
    },
    modifyCategory: async (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>; id: string},
    ): Promise<{message: string; category?: Category}> => {
      const category = await categoryModel
        .findByIdAndUpdate(args.id, args.category, {
          new: true,
        })
        .select(' -__v');
      if (category) {
        socket.emit('update', 'modifyCategory');
        return {message: 'Category updated', category: category};
      } else {
        throw new Error('Category not updated');
      }
    },
    deleteCategory: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; category?: Category}> => {
      if (!context.userdata || context.userdata.user.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      // delete species and animals that belong to this category
      await animalModel.deleteMany({category: args.id});
      const category = await categoryModel
        .findByIdAndDelete(args.id)
        .select(' -__v');
      if (category) {
        socket.emit('update', 'deleteCategory');
        return {message: 'Category deleted', category: category};
      } else {
        throw new Error('Category not deleted');
      }
    },
  },
};
