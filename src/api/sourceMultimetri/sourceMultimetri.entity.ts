export type SourceMultimetri = {
    type: string;
    name: string;
    description: string;
    serverName: string;
    topicName: string;
    addressModBus: string;
    addressDeviceId?: string;
    addressIp?: string;
}