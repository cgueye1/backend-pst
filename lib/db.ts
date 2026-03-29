import { Pool } from "pg";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

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
// Pendant `next build`, Next exécute le code des routes avec NODE_ENV=production sans accès
// aux secrets runtime : on n'exige pas DATABASE_URL tant que NEXT_PHASE === phase-production-build.
const isNextProductionBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
if (!poolConfig.connectionString) {
    console.error('❌ ERREUR: DATABASE_URL non défini dans les variables d\'environnement');
    const requireUrl =
        process.env.NODE_ENV === 'production' && !isNextProductionBuild;
    if (requireUrl) {
        throw new Error('DATABASE_URL is required');
    }
    console.warn('⚠️  DATABASE_URL manquant - certaines fonctionnalités ne fonctionneront pas');
    // URL factice : le pool ne se connecte qu’à la première requête ; le build ne doit pas planter.
    poolConfig.connectionString =
        'postgresql://buildtime:buildtime@127.0.0.1:5432/buildtime';
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

