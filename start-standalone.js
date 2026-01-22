#!/usr/bin/env node

/**
 * Script de démarrage pour Next.js standalone
 * Force l'écoute sur 0.0.0.0 en utilisant les variables d'environnement
 */

// Forcer HOSTNAME à 0.0.0.0 si non défini
if (!process.env.HOSTNAME || process.env.HOSTNAME === 'localhost') {
    process.env.HOSTNAME = '0.0.0.0';
}

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`🚀 Starting server on ${hostname}:${port}`);

// Charger et exécuter le serveur Next.js standalone
try {
    // Le serveur standalone est dans server.js à la racine
    require('./server.js');
} catch (error) {
    console.error('❌ Error loading server.js:', error);
    process.exit(1);
}





