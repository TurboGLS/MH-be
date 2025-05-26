import { model, Schema } from "mongoose"
import { User } from "./user.entity"

const userSchema = new Schema<User>({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
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