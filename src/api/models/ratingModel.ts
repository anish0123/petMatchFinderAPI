import mongoose from 'mongoose';
import {Rating} from '../../types/DBTypes';

const ratingModel = new mongoose.Schema<Rating>({
  rating: {
    type: Number,
    min: [0, 'rating can not be less than zero.'],
    max: [5, 'rating can not be more than five.'],
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'User who gave the rating is required.'],
  },
  ratedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'User to whom rating was given is required.'],
  },
  ratedDate: {
    type: Date,
    required: [true, 'Rated date is required.'],
  },
  description: {
    type: String,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
});

export default mongoose.model<Rating>('Rating', ratingModel);
