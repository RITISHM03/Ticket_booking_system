import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/api.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Ticket Booking API' });
});

export default app;
