#!/usr/bin/env node

/**
 * Script de démarrage personnalisé pour Next.js standalone
 * Force le serveur à écouter sur 0.0.0.0 pour accepter les connexions externes
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    }).listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`🚀 Server running on http://${hostname}:${port}`);
        console.log(`📡 Listening on all interfaces (0.0.0.0:${port})`);
    });
});























