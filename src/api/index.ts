import express from 'express';
import proposalsRouter from './routes/proposals';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();
app.use(express.json());

app.use('/api/proposals', proposalsRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
