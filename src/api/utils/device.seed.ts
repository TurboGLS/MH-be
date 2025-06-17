import mongoose from 'mongoose';
import { device } from './device.data';
import { DeviceModel } from '../device/device.model';

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
    await DeviceModel.deleteMany({});

    // 🚀 inserisce i dati
    await DeviceModel.insertMany(device);

    console.log('✅ Valori inseriti con successo!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Errore di connessione', err);
  });