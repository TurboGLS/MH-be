export type sourceMultimetri = {
    type: number;
    name: string;
    description: string;
    serverName: string;
    topicName: string;
    addressModBus: string;
    addressDeviceId?: string;
    addressIp?: string;
}