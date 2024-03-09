import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import scheduleConfirmation from './routers/schedule-confirmation.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/schedule-confirmation', scheduleConfirmation);

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

export default app;