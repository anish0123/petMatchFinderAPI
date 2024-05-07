import mongoose from 'mongoose';
import {Animal} from '../../types/DBTypes';

const animalModel = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required.'],
  },
  weight: {
    type: Number,
    required: true,
    min: [0, 'Weight cannot be negative.'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative.'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Birthdate is required.'],
    max: [Date.now(), 'Birthdate cannot be in the future.'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Owner is required.'],
  },
  image: {
    type: String,
    required: [true, 'Image is required.'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  listedDate: {
    type: Date,
    required: [true, 'Listed date is required.'],
  },
  description: {
    type: String,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
  adoptionStatus: {
    type: String,
    enum: ['adopted', 'available'],
    required: true,
  },
});

export default mongoose.model<Animal>('Animal', animalModel);
