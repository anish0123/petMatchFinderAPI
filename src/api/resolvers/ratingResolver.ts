import {Socket, io} from 'socket.io-client';
import {ClientToServerEvents, ServerToClientEvents} from '../../types/Socket';
import {Rating} from '../../types/DBTypes';
import ratingModel from '../models/ratingModel';
import {GraphQLError} from 'graphql';
import {MyContext} from '../../types/MyContext';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}

// socket io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SOCKET_URL as string,
);

export default {
  Query: {
    ratings: async () => {
      try {
        console.log('ratings: ', await ratingModel.find());
        return await ratingModel.find();
      } catch (error) {
        console.error(error);
      }
    },
    ratingById: async (_parent: undefined, args: {id: string}) => {
      try {
        const rating = ratingModel.findById(args.id);
        if (!rating) {
          throw new GraphQLError('rating not found', {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        return rating;
      } catch (error) {
        console.error(error);
      }
    },
    ratingByRatingUser: async (_parent: undefined, args: {userId: string}) => {
      try {
        const ratings = await ratingModel.find({ratedBy: args.userId});
        if (ratings.length === 0) {
          throw new GraphQLError('ratings not found', {
            extensions: {code: 'NOT_FOUND'},
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    ratingByRatedToUser: async (_parent: undefined, args: {userId: string}) => {
      try {
        const ratings = await ratingModel.find({ratedTo: args.userId});
        if (ratings.length === 0) {
          throw new GraphQLError('ratings not found', {
            extensions: {code: 'NOT_FOUND'},
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  Mutation: {
    addRating: async (
      _parent: undefined,
      args: {rating: Omit<Rating, '_id'>},
      context: MyContext,
    ): Promise<{message: string; rating?: Rating}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      args.rating.ratedBy = context.userdata.user._id;
      const newRating = await ratingModel.create(args.rating);
      if (!newRating) {
        throw new Error('Error adding rating');
      }
      socket.emit('update', 'rating');
      return {message: 'Rating added', rating: newRating};
    },
    modifyRating: async (
      _parent: undefined,
      args: {id: string; rating: Omit<Rating, '_id'>},
      context: MyContext,
    ): Promise<{message: string; rating?: Rating}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, ratedBy: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.ratedBy;
      }
      const updatedRating = await ratingModel.findOneAndUpdate(
        filter,
        args.rating,
        {new: true},
      );
      if (!updatedRating) {
        throw new Error('Error adding rating');
      }
      socket.emit('update', 'rating');
      return {message: 'Rating added', rating: updatedRating};
    },
    deleteRating: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; rating?: Rating}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, ratedBy: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.ratedBy;
      }
      const deletedRating = await ratingModel.findOneAndDelete(filter);
      if (!deletedRating) {
        throw new Error('Cat not found');
      }
      return {message: 'Animal deleted', rating: deletedRating};
    },
  },
};
