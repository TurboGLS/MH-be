import cron from 'node-cron';
import fetch from 'node-fetch';

cron.schedule('0 0 * * *', async () => {
    console.log('[Scheduler] Avvio chiamata API cleanup...');
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/jobs/cleanup-users`, {
            method: 'POST',
            headers: {
                'x-job-secret': process.env.CLEANUP_SECRET || '',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(`[Scheduler] Risposta:`, data);
    } catch (error) {
        console.error('[Scheduler] Errore chiamata API cleanup:', error);
    }
});
