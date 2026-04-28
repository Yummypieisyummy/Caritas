import 'dotenv/config';
import app from './app';
import { connect, disconnect } from './src/config/db';
import { initializeSearchIndex } from './src/config/search_engine';

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await connect();
    await initializeSearchIndex();

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
