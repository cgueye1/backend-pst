import { NextRequest, NextResponse } from "next/server";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     description: Supprime le token côté client (cookie JWT) pour simuler la déconnexion. Le token doit être invalidé côté client.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: Logout successful
 *                   example: "Logout successful"
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: Request) {
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.set("token", "", { maxAge: 0 }); // supprime le cookie JWT
    return response;
}
