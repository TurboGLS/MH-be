import mongoose from 'mongoose';
import { sourceFotovoltaici } from '../data/sourceFotovoltaici.data'; // o './source' a seconda del percorso
import { SourceFotovoltaiciModel } from '../../sourceFotovoltaici/sourceFotovoltaici.model'; // adatta il percorso al tuo progetto

// da usare su script avviati in locale o non sul progetto globale sennò va configurato su index.ts o app.ts
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ MONGO_URI non definito nelle variabili d\'ambiente');
  process.exit(1);
}

// ✅ connessione a MongoDB
mongoose.connect(uri)
  .then(async () => {
    console.log('📡 Connessione riuscita');

    // 🧹 Svuota la collezione esistente
    await SourceFotovoltaiciModel.deleteMany({});

    // 🚀 Inserisce i dati della lista "source"
    await SourceFotovoltaiciModel.insertMany(sourceFotovoltaici);

    console.log(`✅ Inseriti ${sourceFotovoltaici.length} elementi in "source"`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Errore durante la connessione o inserimento:', err);
  });
