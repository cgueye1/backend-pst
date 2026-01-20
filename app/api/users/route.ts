/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin uniquement)
 *     tags: [ADMIN]

 *   post:
 *     summary: Créer un utilisateur
 *     tags: [ADMIN]

 */
 
import { createUser, getAllUsers } from "@/services/userServices";
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

        const res = await getAllUsers();
        const response = NextResponse.json(res);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        authMiddleware(req);

        const body = await req.json();
        const user = await createUser(body);

        const response = NextResponse.json(user);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
