import { httpServerHandler } from 'cloudflare:node';
import { app, finalizeApp } from './server';

// Cloudflare translates Fetch API requests into Node HTTP requests so the
// existing, tested Express security and routing layer remains the API boundary.
const port = 3000;
finalizeApp();
app.listen(port);

export default httpServerHandler({ port });
