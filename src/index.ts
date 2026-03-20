import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import procurementRoutes from './routes/procurementRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/vendor', vendorRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Headless ERP Core is healthy!',
            timestamp: new Date().toISOString(),
        },
    });
});

// Centralized error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
