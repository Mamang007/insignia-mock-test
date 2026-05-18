import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import path from 'path';
import healthRoutes from './routes/HealthRoutes';
import authRoutes from './routes/AuthRoutes';
import walletRoutes from './routes/WalletRoutes';
import { specs } from './lib/swagger';

// Load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // In production, replace with your frontend URL
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/docs`);
});
