import * as fs from 'fs';
import * as path from 'path';

// Sostituisci con il nome corretto del file se necessario
const filePath = path.resolve(__dirname, './data/sourceFotovoltaici.data.ts');

console.log('📄 Sto cercando il file in:', filePath);

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // 1. Rimuove le virgolette dalle chiavi
  const keysFixed = fileContent.replace(/"([a-zA-Z0-9_]+)"\s*:/g, '$1:');

  // 2. Sostituisce tutti i valori null con stringhe vuote
  const nullsFixed = keysFixed.replace(/\bnull\b/g, '""');

  fs.writeFileSync(filePath, nullsFixed, 'utf8');
  console.log('✔ Chiavi convertite correttamente nel file.');
} catch (error) {
  console.error('❌ Errore durante la lettura o scrittura del file:', error);
}
