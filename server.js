import 'dotenv/config';
import express from 'express';

import { ask, embedQuery, searchChunks } from './query.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/query', async (req, res) => {

    const { question } = req.body ?? {};
    if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'question is required' });
    }

    try {
        const questionnChuck = await embedQuery(question);
        const patientContext = await searchChunks(questionnChuck);

        const asnwer = await ask(question, patientContext);

        res.json({ answer: asnwer });

    }
    catch (error) {
        res.status(500).json({ error: 'error' });
    }

});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`patient-query listening on :${port}`));
