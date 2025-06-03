import { Schema, model } from "mongoose";
import { SourceMultimetri } from "./sourceMultimetri.entity";

const SourceSchema = new Schema<SourceMultimetri>({
    Type: { type: String, required: true },
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    ServerName: { type: String, required: true },
    TopicName: { type: String, required: true },
    AddressModBus: { type: String, required: true },
    AddressDeviceId: { type: String, required: false },
    AddressIp: { type: String, required: false },
});

SourceSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.AddressModBus;
        delete ret.AddressDeviceId;
        delete ret.AddressIp;
        delete ret.id;
        return ret;
    },
});

// creare virtual per address unico
SourceSchema.virtual('Address').get(function() {
    const parts = [this.AddressModBus, this.AddressDeviceId, this.AddressIp]
        .filter(part => part && part.trim() !== '');
    return parts.join(',');
});

export const SourceMultimetriModel = model<SourceMultimetri>('SourceMultimetri', SourceSchema);