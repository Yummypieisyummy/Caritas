import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import usersRoutes from './src/routes/users.routes';
import postsRoutes from './src/routes/posts.routes';
import organizationsRoutes from './src/routes/org.routes';
import authRoutes from './src/routes/auth.routes';

const app = express();

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS Configuration
app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
  }),
);




// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/sample', (req, res) => res.json({ message: 'Hello, World!' }));

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Internal Server Error' });
  },
);

export default app;
