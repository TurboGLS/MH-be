import { Schema, model } from 'mongoose';
import { Multimetri } from './multimetri.entity';

const MultimetriSchema = new Schema<Multimetri>({
    Type: String,
    Modello: String
});

MultimetriSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        return ret;
    },
});

export const MultimetriModel = model<Multimetri>('Multimetri', MultimetriSchema);