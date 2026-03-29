import { Pool } from "pg";

// Configuration du pool avec la même logique SSL que lib/db.ts
const poolConfig: {
    connectionString: string;
    ssl?: { rejectUnauthorized: boolean } | boolean;
} = {
    connectionString: process.env.DATABASE_URL || '',
};

// Configuration SSL (même logique que lib/db.ts)
if (process.env.DATABASE_SSL !== undefined) {
    if (process.env.DATABASE_SSL === 'true') {
        poolConfig.ssl = { rejectUnauthorized: false };
    }
} else if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = { rejectUnauthorized: false };
}

// Crée une instance de connexion PostgreSQL
export const pool = new Pool(poolConfig);

// Émettre un événement à tous les participants d'une conversation
export async function emitToConversation(conversationId: string, event: string, data: any) {
    (global as any).io?.to(`conversation_${conversationId}`).emit(event, data);
}

// Émettre un événement à un utilisateur spécifique
export function emitToUser(userId: number, event: string, data: any) {
    const socketId = (global as any).userSockets?.get(userId);
    if (socketId) {
        (global as any).io.to(socketId).emit(event, data);
    }
}

// Notifier tous les participants sauf l'expéditeur
export async function notifyConversationParticipants(
    conversationId: string,
    senderId: number,
    event: string,
    data: any
) {
    try {
        const result = await pool.query(
            `SELECT user_id FROM conversation_participants
             WHERE conversation_id = $1 AND user_id != $2 AND left_at IS NULL`,
            [conversationId, senderId]
        );

        result.rows.forEach(r => emitToUser(r.user_id, event, data));
    } catch (err) {
        console.error("Erreur notification participants:", err);
    }
}
