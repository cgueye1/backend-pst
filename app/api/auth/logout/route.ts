import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     description: Supprime le token côté client (JWT côté front) pour simuler la déconnexion.
 *     tags: [Auth]
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: Request) {
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.set("token", "", { maxAge: 0 }); // supprime le cookie JWT
    return response;
}
