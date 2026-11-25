import express from 'express';
import { createAdminRouter } from '../server/adminRouter';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use('/api/admin', createAdminRouter());

export default app;
