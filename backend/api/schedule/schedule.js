import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// import schedule from './routes/schedule.js';
import service from './routes/service.js';
import schedule from './routes/schedule.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/schedule', schedule);
app.use('/service', service);
app.use('/schedule', schedule);

app.listen(process.env.PORT, () => {
    console.log(`Servidor está rodando na porta ${process.env.PORT}`);
});

export default app;