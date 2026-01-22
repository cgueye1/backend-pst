import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, authMiddleware } from "@/lib/auth";
import { deleteUser, getUserById, updateUser } from "@/services/userServices";
import { updateDriverStatus } from "@/services/driverServices";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
import { updateUserSchema, validateData } from "@/lib/validation";

// Dans app routes Next, params est un Promise : on le tape explicitement
type ParamsPromise = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (admin uniquement)
 *     tags: [ADMIN]


 *   put:
 *     summary: Mettre à jour un utilisateur (admin uniquement)
 *     tags: [ADMIN]

 *   delete:
 *     summary: Supprimer un utilisateur (admin uniquement)
 *     tags: [ADMIN]

 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}


export async function GET(req: NextRequest, ctx: ParamsPromise) {
    const origin = req.headers.get('origin');
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            const response = NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const { id } = await ctx.params;
        const numId = Number(id);
        if (Number.isNaN(numId)) {
            const response = NextResponse.json({ error: "Invalid user id" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const res = await getUserById(numId);
        const response = NextResponse.json(res);
        return setCorsHeaders(response, origin);
    } catch (err) {
        console.error("GET /api/users/[id] error:", err);
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function PUT(req: NextRequest, ctx: ParamsPromise) {
    const origin = req.headers.get('origin');
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            const response = NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const { id } = await ctx.params;
        const numId = Number(id);
        if (Number.isNaN(numId)) {
            console.error("PUT /api/users/[id] invalid id:", id);
            const response = NextResponse.json({ error: "Invalid user id" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        
        // Validation des données avec Zod
        const validation = validateData(updateUserSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }

        console.log("PUT /api/users/[id] payload:", { id: numId, body: validation.data });
        const res = await updateUser(numId, validation.data);

        const response = NextResponse.json({
            success: true,
            ...res
        });
        return setCorsHeaders(response, origin);
    } catch (err: any) {
        console.error("PUT /api/users/[id] error:", err);
        
        // Gestion d'erreurs améliorée pour le frontend
        let errorMessage = "Erreur lors de la mise à jour de l'utilisateur";
        let userMessage = errorMessage;

        if (err.message) {
            errorMessage = err.message;
            userMessage = err.message;
            
            if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
                if (err.message.includes('email')) {
                    userMessage = "Cet email est déjà utilisé par un autre utilisateur";
                }
            } else if (err.message.includes('not-null constraint')) {
                userMessage = "Des champs requis sont manquants";
            } else if (err.message.includes('User not found')) {
                userMessage = "Utilisateur introuvable";
            }
        }

        const response = NextResponse.json({
            success: false,
            error: errorMessage,
            message: userMessage,
            userMessage: userMessage
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function DELETE(req: NextRequest, ctx: ParamsPromise) {
    const origin = req.headers.get('origin');
    try {
        const user = authMiddleware(req);
        if (user.role !== "admin") {
            const response = NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const { id } = await ctx.params;
        const numId = Number(id);
        if (Number.isNaN(numId)) {
            console.error("DELETE /api/users/[id] invalid id:", id);
            const response = NextResponse.json({ error: "Invalid user id" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        await deleteUser(numId);
        const response = NextResponse.json({ success: true });
        return setCorsHeaders(response, origin);
    } catch (err) {
        console.error("DELETE /api/users/[id] error:", err);
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
