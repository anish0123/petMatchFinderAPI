import mongoose from 'mongoose';
import {Category} from '../../types/DBTypes';
/**
 * Schema for category
 */
const categorSchema = new mongoose.Schema<Category>({
  category_name: {
    type: String,
    unique: true,
    minlength: [2, 'Minimum length is 2 characters.'],
  },
});

export default mongoose.model<Category>('Category', categorSchema);
