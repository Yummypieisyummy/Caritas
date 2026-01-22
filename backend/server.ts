import 'dotenv/config';
import app from './app';
import { connect, disconnect } from './src/config/db';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect();
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    process.on('SIGTERM', disconnect);
    process.on('SIGINT', disconnect);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
