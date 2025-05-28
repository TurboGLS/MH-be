import { SourceModel } from "../sourceMultimetri/source.model";
import { Parser } from 'json2csv';

export async function generateVarListCSV(type: string, quantity: number) {
     // prendo i parametri dalla source (varlist)
     const baseParam = await SourceModel.find({ type }).lean();

     if (!baseParam.length) {
        throw new Error(`Parametri varlist non trovati per il tipo ${type}`);
     }

     const varlist: any[] = [];

     for (let i = 1; i <= quantity; i++) {
        for (const param of baseParam) {
            const replacedParam = { ...param };

            for (const key in replacedParam) {
                if (typeof replacedParam[key] === 'string') {
                    replacedParam[key] = replacedParam[key].replace(/§/g, i.toString());
                }
            }
            varlist.push(replacedParam);
        }
     }
     // rimuovere dati inutili
     const cleanedVarlist = varlist.map(({ _id, __v, ...rest }) => rest);

     const parser = new Parser();
     return parser.parse(cleanedVarlist);
}