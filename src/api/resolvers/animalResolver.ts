import { GraphQLError } from 'graphql';
import animalModel from '../models/animalModel'
import { Animal, coordinates } from '../../types/DBTypes';
import { MyContext } from '../../types/MyContext';

export default {
  Query: {
    animals: async () => {
      return await animalModel.find()
    },
    animalById: async(_parent: undefined, args: {animal_id: string}) => {
      const animal = await animalModel.findById(args.animal_id);
      if(!animal) {
        throw new GraphQLError('Cat not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return animal;
    },
    animalsByOwner: async(_parent: undefined, args: {ownerId: string}) => {
      const animals = await animalModel.find({owner: args.ownerId});
      if(animals.length === 0) {
        throw new GraphQLError('No cats found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return animals;
    },
    animalsByArea: async(_parent: undefined, args: {topRight: coordinates, bottomLeft: coordinates}) => {
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
    }
  },
  Mutation: {
    addAnimal: async(_parent: undefined, args: {animal: Omit<Animal, "_id">}, context: MyContext): Promise<Animal> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      args.animal.owner = context.userdata.user._id;
      const newAnimal = await animalModel.create(args.animal);
      if(!newAnimal) {
        throw new Error('Error adding animal');
      }
      return newAnimal;
    },
    modifyAnimal: async(_parent: undefined, args: {id: string; input: Omit<Animal, "_id">}, context: MyContext): Promise<Animal> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, owner: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.owner;
      }
      const updatedAnimal = await animalModel.findOneAndUpdate(filter, args.input, {new: true});
      if(!updatedAnimal) {
        throw new GraphQLError('Cat not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return updatedAnimal;
    },
    deleteAnimal: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<Animal> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, owner: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.owner;
      }
      const deletedCat = await animalModel.findOneAndDelete(filter);
      if (!deletedCat) {
        throw new Error('Cat not found');
      }
      return deletedCat;
    },
  }
}
