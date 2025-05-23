import mongoose from 'mongoose';
import { multimetri } from './multimetri.data';
import { MultimetriModel } from '../multimetri/multimetri.model';
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

    // 🧹 (opzionale) svuota la collezione se vuoi partire da zero
    await MultimetriModel.deleteMany({});

    // 🚀 inserisce i dati
    await MultimetriModel.insertMany(multimetri);

    console.log('✅ Multimetri inseriti con successo!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Errore di connessione', err);
  });
