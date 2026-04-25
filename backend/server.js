import express from 'express';
import cors from 'cors';
import gscPortfolioRoutes from './routes/gscPortfolioRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/gsc-portfolio', gscPortfolioRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SEO Dashboard API' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
