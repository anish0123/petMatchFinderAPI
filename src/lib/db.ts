import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Method to connect to mongo db
 * @returns db connection
 */
const mongoConnect = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('No database url not sset in .env file');
    }
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    console.log('DB connected successfully');
    return connection;
  } catch (error) {
    console.error('Connection to db failed: ', (error as Error).message);
  }
};

export default mongoConnect;
