import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import auth from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', auth);

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

export default app;