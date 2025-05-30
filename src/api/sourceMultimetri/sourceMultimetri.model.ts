import { Schema, model } from "mongoose";
import { SourceMultimetri } from "./sourceMultimetri.entity";

const SourceSchema = new Schema<SourceMultimetri>({
    type: { type: String, required: true },
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

export const SourceMultimetriModel = model<SourceMultimetri>('SourceMultimetri', SourceSchema);