import mongoose from 'mongoose';
import {AdoptionApplication} from '../../types/DBTypes';

/**
 * Schema for adoption application
 */
const adoptionApplicationModel = new mongoose.Schema<AdoptionApplication>({
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Adopter is required.'],
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animals',
    required: [true, 'Animal is required.'],
  },
  description: {
    type: String,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
  appliedDate: {
    type: Date,
    required: [true, 'Applied date is required.'],
  },
  applicationStatus: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    required: true,
  },
});

export default mongoose.model<AdoptionApplication>(
  'AdoptionApplication',
  adoptionApplicationModel,
);
