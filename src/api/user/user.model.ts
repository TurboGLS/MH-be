import { model, Schema } from "mongoose"
import { User } from "./user.entity"

const userSchema = new Schema<User>({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    active: { type: Boolean, default: false},
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const UserModel = model<User>('User', userSchema);