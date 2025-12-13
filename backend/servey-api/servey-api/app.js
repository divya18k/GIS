import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import surveyRoutes from './routes/surveyRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOAD_BASE));

app.use('/surveys', surveyRoutes);


app.use('/users', userRoutes);


app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
