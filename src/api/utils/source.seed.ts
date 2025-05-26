import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { source } from './source.data'; // o './source' a seconda del percorso
import { SourceModel } from '../sourceMultimetri/source.model'; // adatta il percorso al tuo progetto

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
    await SourceModel.deleteMany({});

    // 🚀 Inserisce i dati della lista "source"
    await SourceModel.insertMany(source);

    console.log(`✅ Inseriti ${source.length} elementi in "source"`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Errore durante la connessione o inserimento:', err);
  });
