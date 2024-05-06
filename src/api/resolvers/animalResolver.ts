import {GraphQLError} from 'graphql';
import animalModel from '../models/animalModel';
import {AdoptionApplication, Animal, coordinates} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import {Socket, io} from 'socket.io-client';
import {ClientToServerEvents, ServerToClientEvents} from '../../types/Socket';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}

// socket io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SOCKET_URL as string,
);

export default {
  AdoptionApplication: {
    animal: async (parent: AdoptionApplication): Promise<Animal> => {
      const animal = await animalModel.findById(parent.animal);
      if (!animal) {
        throw new Error('Animal not found');
      }
      return animal;
    },
  },
  Query: {
    animals: async () => {
      try {
        return await animalModel.find();
      } catch (error) {
        console.error(error);
      }
    },
    animalById: async (_parent: undefined, args: {id: string}) => {
      try {
        const animal = await animalModel.findById(args.id);
        if (!animal) {
          throw new GraphQLError('animal not found', {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        return animal;
      } catch (error) {
        console.log('error: ', error);
      }
    },
    animalsByOwner: async (_parent: undefined, args: {ownerId: string}) => {
      try {
        const animals = await animalModel.find({owner: args.ownerId});
        if (animals.length === 0) {
          throw new GraphQLError('No animals found', {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        return animals;
      } catch (error) {
        console.error('error: ', error);
      }
    },
    animalsByArea: async (
      _parent: undefined,
      args: {topRight: coordinates; bottomLeft: coordinates},
    ) => {
      const rightCorner = [args.topRight.lat, args.topRight.lng];
      const leftCorner = [args.bottomLeft.lat, args.bottomLeft.lng];

      const animals = await animalModel.find({
        location: {
          $geoWithin: {
            $box: [leftCorner, rightCorner],
          },
        },
      });
      if (animals.length === 0) {
        throw new GraphQLError('Cat not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return animals;
    },
  },
  Mutation: {
    addAnimal: async (
      _parent: undefined,
      args: {animal: Omit<Animal, '_id'>},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      args.animal.owner = context.userdata.user._id;
      const newAnimal = await animalModel.create(args.animal);
      if (!newAnimal) {
        throw new Error('Error adding animal');
      }
      socket.emit('update', 'animal');
      return {message: 'Animal added', animal: newAnimal};
    },
    modifyAnimal: async (
      _parent: undefined,
      args: {id: string; animal: Omit<Animal, '_id'>},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, owner: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.owner;
      }
      const updatedAnimal = await animalModel.findOneAndUpdate(
        filter,
        args.animal,
        {new: true},
      );
      if (!updatedAnimal) {
        throw new GraphQLError('Animal not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      socket.emit('update', 'modifyAnimal');
      return {message: 'Animal updated', animal: updatedAnimal};
    },
    deleteAnimal: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, owner: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.owner;
      }
      const deletedAnimal = await animalModel.findOneAndDelete(filter);
      if (!deletedAnimal) {
        throw new Error('Cat not found');
      }
      return {message: 'Animal deleted', animal: deletedAnimal};
    },
  },
};
