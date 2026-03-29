import { Pool } from "pg";

// Configuration du pool de connexions avec valeurs par défaut sûres
// Ces valeurs peuvent être surchargées via les variables d'environnement
const poolConfig: {
    connectionString: string;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
    ssl?: { rejectUnauthorized: boolean } | boolean;
} = {
    connectionString: process.env.DATABASE_URL || '',
    max: parseInt(process.env.DB_POOL_MAX || "20"), // Maximum de connexions simultanées
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || "30000"), // 30 secondes
    connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || "2000"), // 2 secondes
};

// Configuration SSL
// Priorité: DATABASE_SSL > NODE_ENV
// Si DATABASE_SSL est explicitement défini, on le respecte
// Sinon, on active SSL en production (pour Vercel, etc.)
if (process.env.DATABASE_SSL !== undefined) {
    // DATABASE_SSL est défini explicitement
    if (process.env.DATABASE_SSL === 'true') {
        poolConfig.ssl = { rejectUnauthorized: false };
    }
    // Si DATABASE_SSL === 'false', on ne configure pas SSL (undefined)
} else if (process.env.NODE_ENV === 'production') {
    // Fallback: SSL en production si DATABASE_SSL n'est pas défini
    poolConfig.ssl = { rejectUnauthorized: false };
}

// Validation de la connection string
if (!poolConfig.connectionString) {
    console.error('❌ ERREUR: DATABASE_URL non défini dans les variables d\'environnement');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is required');
    }
    console.warn('⚠️  DATABASE_URL manquant - certaines fonctionnalités ne fonctionneront pas');
}

export const db = new Pool(poolConfig);

// Gestion des erreurs de connexion
db.on('error', (err) => {
    console.error('❌ Erreur inattendue sur le client PostgreSQL:', err);
});

export async function query(text: string, params?: any[]) {
    const res = await db.query(text, params);
    return res;
}

