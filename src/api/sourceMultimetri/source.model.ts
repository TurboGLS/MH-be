import { Schema, model } from "mongoose";
import { sourceMultimetri } from "./source.entity";

const SourceSchema = new Schema<sourceMultimetri>({
    type: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    serverName: { type: String, required: true },
    topicName: { type: String, required: true },
    addressModBus: { type: String, required: true },
    addressDeviceId: { type: String, required: true },
    addressIp: { type: String, required: true },
});

SourceSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        return ret;
    },
});

// crea virtual per address unico
SourceSchema.virtual('address').get(function() {
    return `${this.addressModBus},${this.addressDeviceId},${this.addressIp}`;
});

export const SourceModel = model<sourceMultimetri>('source', SourceSchema);