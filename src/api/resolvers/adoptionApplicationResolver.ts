import {GraphQLError} from 'graphql';
import adoptionApplicationModel from '../models/adoptionApplication';
import {AdoptionApplication} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import animalModel from '../models/animalModel';
/**
 * Resolver for adoption application
 */
export default {
  Query: {
    adoptionApplications: async () => {
      return await adoptionApplicationModel.find();
    },
    adoptionApplicationById: async (_parent: undefined, args: {id: string}) => {
      try {
        const application = await adoptionApplicationModel.findById(args.id);
        if (!application) {
          throw new GraphQLError('Application not found', {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        return application;
      } catch (error) {
        console.error(error);
      }
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
  },
  Mutation: {
    addAdoptionApplication: async (
      _parent: undefined,
      args: {input: Omit<AdoptionApplication, '_id'>},
      context: MyContext,
    ): Promise<{message: string; adoptionApplication: AdoptionApplication}> => {
      args.input.applicationStatus = 'pending';
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const animal = await animalModel.findById(args.input.animal);
      if (animal?.adoptionStatus === 'adopted') {
        throw new GraphQLError('Animal already adopted', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }
      if (animal?.owner.id === context.userdata.user._id) {
        throw new GraphQLError('Owner can not adopt animal', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }
      args.input.adopter = context.userdata.user._id;
      const previousApplication = await adoptionApplicationModel.findOne({
        adopter: args.input.adopter,
        animal: args.input.animal,
      });
      if (previousApplication) {
        throw new GraphQLError('Application can not be adopted twice', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }
      const newAdoptionApplication = await adoptionApplicationModel.create(
        args.input,
      );
      if (!newAdoptionApplication) {
        throw new Error('Error adding application');
      }
      return {
        message: 'adoption application created',
        adoptionApplication: newAdoptionApplication,
      };
    },
    modifyAdoptionApplication: async (
      _parent: undefined,
      args: {id: string; input: Omit<AdoptionApplication, '_id'>},
      context: MyContext,
    ): Promise<{message: string; adoptionApplication: AdoptionApplication}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {code: 'UNAUTHENTICATED'},
        });
      }
      const filter = {_id: args.id, adopter: context.userdata.user._id};
      if (context.userdata.user.role === 'admin') {
        delete filter.adopter;
      }
      if (
        args.input.applicationStatus &&
        args.input.applicationStatus !== 'pending' &&
        context.userdata.user.role !== 'admin'
      ) {
        const application = await adoptionApplicationModel.findById(args.id);
        const animal = await animalModel.findById(application?.animal);
        if (animal?.owner._id.toString() !== context.userdata.user._id) {
          throw new GraphQLError('User not authorized', {
            extensions: {code: 'UNAUTHORIZED'},
          });
        }
        delete filter.adopter;
      }
      const adoptionApplication =
        await adoptionApplicationModel.findOneAndUpdate(filter, args.input, {
          new: true,
        });
      if (!adoptionApplication) {
        throw new Error('Error modifying application');
      }
      if (adoptionApplication.applicationStatus === 'approved') {
        const animal = await animalModel.findById(adoptionApplication.animal);
        if (animal) {
          animal.adoptionStatus = 'adopted';
          await animal.save();
        }
        const applications = await adoptionApplicationModel.find({
          animal: animal?._id,
        });
        applications.forEach(async (application) => {
          if (application._id.toString() !== args.id) {
            application.applicationStatus = 'rejected';
            await application.save();
          }
        });
      }
      return {
        message: 'adoption application updated',
        adoptionApplication: adoptionApplication,
      };
    },
    deleteAdoptionApplication: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      try {
        if (!context.userdata) {
          throw new GraphQLError('User not authenticated', {
            extensions: {code: 'UNAUTHENTICATED'},
          });
        }
        const filter = {_id: args.id, adopter: context.userdata.user._id};
        if (context.userdata.user.role === 'admin') {
          delete filter.adopter;
        }
        const deletedApplication =
          await adoptionApplicationModel.findOneAndDelete(filter);
        if (!deletedApplication) {
          throw new Error('Error deleting application');
        }
        return {
          message: 'adoption application deleted',
          adoptionApplication: deletedApplication,
        };
      } catch (error) {
        console.error(error);
      }
    },
  },
};
