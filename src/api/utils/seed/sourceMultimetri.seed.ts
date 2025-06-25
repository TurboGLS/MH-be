import mongoose from 'mongoose';
import { sourceMultimetri } from '../data/sourceMultimetri.data'; // o './source' a seconda del percorso
import { SourceMultimetriModel } from '../../sourceMultimetri/sourceMultimetri.model'; // adatta il percorso al tuo progetto

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
    await SourceMultimetriModel.deleteMany({});

    // 🚀 Inserisce i dati della lista "source"
    await SourceMultimetriModel.insertMany(sourceMultimetri);

    console.log(`✅ Inseriti ${sourceMultimetri.length} elementi in "source"`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Errore durante la connessione o inserimento:', err);
  });
