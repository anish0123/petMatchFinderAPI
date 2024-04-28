import {GraphQLError} from 'graphql';
import adoptionApplicationModel from '../models/adoptionApplication';
import {AdoptionApplication} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import animalModel from '../models/animalModel';

export default {
  Query: {
    adoptionApplications: async () => {
      return await adoptionApplicationModel.find();
    },
    adoptionApplicationById: async (
      _parent: undefined,
      args: {application_id: string},
    ) => {
      const application = await adoptionApplicationModel.findById(
        args.application_id,
      );
      if (!application) {
        throw new GraphQLError('Application not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return application;
    },
    adoptionApplicationsByAdopter: async (
      _parent: undefined,
      args: {adopterId: string},
    ) => {
      const applications = await adoptionApplicationModel.find({
        adopter: args.adopterId,
      });
      if (applications.length === 0) {
        throw new GraphQLError('No applications found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return applications;
    },
    adoptionApplicationsByAnimal: async (
      _parent: undefined,
      args: {animalId: string},
    ) => {
      const applications = await adoptionApplicationModel.find({
        animal: args.animalId,
      });
      if (applications.length === 0) {
        throw new GraphQLError('No applications found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return applications;
    },
  },
  Mutation: {
    addAdoptionApplication: async (
      _parent: undefined,
      args: {input: Omit<AdoptionApplication, '_id'>},
      context: MyContext,
    ) => {
      args.input.appliedDate = new Date();
      console.log('args: ', args);
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      if (context.userdata.user.role === 'lister') {
        throw new GraphQLError('Listers cannot adopt animals', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }
      const animal = await animalModel.findById(args.input.animal);
      if (animal?.adoptionStatus === 'adopted') {
        throw new GraphQLError('Animal already adopted', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }
      args.input.adopter = context.userdata.user._id;
      const newAdoptionApplication = await adoptionApplicationModel.create(
        args.input,
      );
      if (!newAdoptionApplication) {
        throw new Error('Error adding application');
      }
      return newAdoptionApplication;
    },
    modifyAdoptionApplication: async (
      _parent: undefined,
      args: {id: string; input: Omit<AdoptionApplication, '_id'>},
      context: MyContext,
    ): Promise<AdoptionApplication> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, owner: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.owner;
      }
      const adoptionApplication =
        await adoptionApplicationModel.findOneAndUpdate(filter, args.input, {
          new: true,
        });
      if (!adoptionApplication) {
        throw new Error('Error modifying application');
      }
      return adoptionApplication;
    },
    deleteAdoptionApplication: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<AdoptionApplication> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, owner: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.owner;
      }
      const deletedApplication =
        await adoptionApplicationModel.findOneAndDelete(filter);
      if (!deletedApplication) {
        throw new Error('Error deleting application');
      }
      return deletedApplication;
    },
  },
};
