import { Schema, model } from 'mongoose';
import { Device } from './device.entity';

const DeviceSchema = new Schema<Device>({
    Type: String,
    Modello: String,
    Categoria: String
});

DeviceSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.id;
        return ret;
    },
});

export const DeviceModel = model<Device>('Device', DeviceSchema);