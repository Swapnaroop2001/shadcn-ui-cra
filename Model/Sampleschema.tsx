// user.ts

import { Document, Schema, model } from 'mongoose';

// Define interface for User document
interface User {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Define document interface for TypeScript
interface UserDocument extends User, Document {}

// Define Mongoose schema for User
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export Mongoose model
const User = model<UserDocument>('User', userSchema);

export default User;
