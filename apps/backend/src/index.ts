import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import healthRoutes from './routes/HealthRoutes';

// Load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/', healthRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
