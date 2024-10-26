
import { app } from '@/app';

async function startServer() {
  const port = process.env.API_PORT || 8888;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();