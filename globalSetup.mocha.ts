import { app } from '@/app';
import { Server } from 'http';

export let server: Server;

before(async function () {
  server = app.listen(8888);
});

after((done) => {
  server.close(done);
});
