import { Schema, model } from "mongoose";
import { sourceMultimetri } from "./source.entity";

const SourceSchema = new Schema<sourceMultimetri>({
    type: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    serverName: { type: String, required: true },
    topicName: { type: String, required: true },
    addressModBus: { type: String, required: true },
    addressDeviceId: { type: String, required: false },
    addressIp: { type: String, required: false },
});

SourceSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.addressModBus;
        delete ret.addressDeviceId;
        delete ret.addressIp;
        delete ret.id;
        return ret;
    },
});

// creare virtual per address unico
SourceSchema.virtual('address').get(function() {
    const parts = [this.addressModBus, this.addressDeviceId, this.addressIp]
        .filter(part => part && part.trim() !== '');
    return parts.join(',');
});

export const SourceModel = model<sourceMultimetri>('source', SourceSchema);