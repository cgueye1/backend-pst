import { query } from "@/lib/db";
import { authMiddleware } from "@/lib/auth";

import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            const response = NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        // Requête corrigée selon votre vraie structure de table
        const res = await query(`
            SELECT 
                s.id,
                u.name AS nom,
                CASE 
                    WHEN u.role = 'parent' THEN 'Parent' 
                    WHEN u.role = 'driver' THEN 'Chauffeur'
                    WHEN u.role = 'admin' THEN 'Administrateur'
                    ELSE 'Autre'
                END AS profil,
                s.price AS montant,
                TO_CHAR(s.start_date, 'DD/MM/YYYY') AS date_debut,
                CASE 
                    WHEN s.end_date IS NOT NULL THEN TO_CHAR(s.end_date, 'DD/MM/YYYY')
                    ELSE 'Indéterminée'
                END AS date_fin,
                s.type,
                s.active,
                s.user_id,
                u.email,
                u.phone
            FROM subscriptions s
            LEFT JOIN users u ON u.id = s.user_id
            WHERE s.active = true
              AND start_date <= CURRENT_DATE
              AND (end_date IS NULL OR end_date >= CURRENT_DATE)
            ORDER BY s.start_date DESC
        `);

        const response = NextResponse.json({
            success: true,
            rows: res.rows,
            total: res.rows.length
        });
        return setCorsHeaders(response, origin);

    } catch (err) {
        console.error("Erreur API subscriptions:", err);
        const response = NextResponse.json({
            error: "Erreur serveur",
            message: String(err)
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}