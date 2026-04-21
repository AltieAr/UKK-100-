import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoute.js';
import authRoutes from './src/routes/authRoute.js';
import vehicleTypeRoutes from './src/routes/vehicleTypeRoute.js';
import feeRoutes from './src/routes/feeRoute.js';
import vehicleRoute from './src/routes/vehicleRoute.js';
import parkAreaRoute from './src/routes/parkAreaRoute.js'; 
import transactionRoute from './src/routes/transactionRoute.js';
import logRoute from './src/routes/logRoute.js';
import reportRoute from './src/routes/reportRoute.js';
import adminDashboardRoute from './src/routes/adminDashboardRoute.js';

// initialize models and associations via central index
import './src/models/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/owner', reportRoute);
app.use('/api/user', userRoutes);
app.use('/api/log', logRoute);
app.use('/api', authRoutes);
app.use('/api/vehicle-type', vehicleTypeRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/vehicle', vehicleRoute);
app.use('/api/area', parkAreaRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/admin', adminDashboardRoute);



export default app;