import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

async function bootstrap() {
  try {
    await initMongoConnection();

    const app = setupServer();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    setupServer();
  } catch (error) {
    console.error('Error during server startup:', error);
  }
}
bootstrap();
