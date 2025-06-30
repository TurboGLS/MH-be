import { Schema, model } from "mongoose";
import { SourceFotovoltaici } from "./sourceFotovoltaici.entity";

const SourceSchema = new Schema<SourceFotovoltaici>({
    DeviceType: { type: String, required: true },
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    ServerName: { type: String, required: true },
    TopicName: { type: String, required: true },
    AddressModBus: { type: String, required: true },
    AddressDeviceId: { type: String, required: false },
    AddressIp: { type: String, required: false },
    Coef: { type: String, required: true },
    Offset: { type: String, required: true },
    LogEnabled: { type: String, required: true },
    AlEnabled: { type: String, required: true },
    AlBool: { type: String, required: true },
    MemTag: { type: String, required: true },
    MbsTcpEnabled: { type: String, required: true },
    MbsTcpFloat: { type: String, required: true },
    SnmpEnabled: { type: String, required: true },
    RTLogEnabled: { type: String, required: true },
    AlAutoAck: { type: String, required: true },
    ForceRO: { type: String, required: true },
    SnmpOID: { type: String, required: true },
    AutoType: { type: String, required: true },
    AlHint: { type: String, required: false },
    AlHigh: { type: String, required: true },
    AlLow: { type: String, required: true },
    AlTimeDB: { type: String, required: true },
    AlLevelDB: { type: String, required: true },
    IVGroupA: { type: String, required: true },
    IVGroupB: { type: String, required: true },
    IVGroupC: { type: String, required: true },
    IVGroupD: { type: String, required: true },
    PageId: { type: String, required: true },
    RTLogWindow: { type: String, required: true },
    RTLogTimer: { type: String, required: true },
    LogDB: { type: String, required: true },
    LogTimer: { type: String, required: true },
    AlLoLo: { type: String, required: false },
    AlHiHi: { type: String, required: false },
    MbsTcpRegister: { type: String, required: true },
    MbsTcpCoef: { type: String, required: true },
    MbsTcpOffset: { type: String, required: true },
    EEN: { type: String, required: false },
    ETO: { type: String, required: false },
    ECC: { type: String, required: false },
    ESU: { type: String, required: false },
    EAT: { type: String, required: false },
    ESH: { type: String, required: false },
    SEN: { type: String, required: false },
    STO: { type: String, required: false },
    SSU: { type: String, required: false },
    TEN: { type: String, required: false },
    TSU: { type: String, required: false },
    FEN: { type: String, required: false },
    FFN: { type: String, required: false },
    FCO: { type: String, required: false, default: null },
    KPI: { type: String, required: false },
    UseCustomUnit: { type: String, required: true },
    Type: { type: String, required: true },
    Unit: { type: String, required: false },
    AlStat: { type: String, required: true },
    ChangeTime: { type: String, required: true },
    TagValue: { type: String, required: true },
    TagQuality: { type: String, required: true },
    AlType: { type: String, required: true },
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

export const SourceFotovoltaiciModel = model<SourceFotovoltaici>('SourceFotovoltaici', SourceSchema);