import { SourceModel } from "../sourceMultimetri/source.model";
import { Parser } from 'json2csv';

export async function generateVarListCSV(type: string, auxQuantity: number, device: number, ipAddress: string) {
     // prendo i parametri dalla source (varlist)
     const baseParam = await SourceModel.find({ type });

     if (!baseParam.length) {
        throw new Error(`Parametri varlist non trovati per il tipo ${type}`);
     }

     const varlist: any[] = [];

     for (let i = 1; i <= auxQuantity; i++) {
        for (const param of baseParam) {
            const replacedParam = param.toJSON(); // include i virtual

            for (const key in replacedParam) {
                if (typeof replacedParam[key] === 'string') {
                    replacedParam[key] = replacedParam[key]
                        .replace(/§/g, i.toString()) 
                        .replace(/@/g, device.toString())
                        .replace(/ç/g, ipAddress.toString())
                }
            }
            varlist.push(replacedParam);
        }
     }
     // rimuovere dati inutili
     const cleanedVarlist = varlist.map(({ _id, __v, ...rest }) => rest);

     const parser = new Parser({ quote: '' });
     return parser.parse(cleanedVarlist);
}