import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/services/userServices";
import { verifyToken } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

type Params = {
    params: Promise<{ id: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PUT(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        // Simplification : déstructuration directe
        const { id } = await context.params;
        const userId = Number(id);

        // Validation de l'ID
        if (isNaN(userId)) {
            const response = NextResponse.json(
                { message: "ID utilisateur invalide" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérification du token
        const auth = req.headers.get("authorization");
        if (!auth) {
            const response = NextResponse.json({ message: "No token" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        verifyToken(auth.split(" ")[1]);

        // Récupération des données
        const body = await req.json();
        const { name, email, phone } = body;

        // Vérification de l'existence de l'utilisateur
        const user = await getUserById(userId);
        if (!user) {
            const response = NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Mise à jour
        const updatedUser = await updateUser(userId, { name, email, phone });

        // Séparation du nom
        const [firstName, ...rest] = (updatedUser.name ?? '').split(' ');

        const response = NextResponse.json({
            id: updatedUser.id,
            firstName,
            lastName: rest.join(' '),
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            status: updatedUser.status,
        });
        return setCorsHeaders(response, origin);

    } catch (err) {
        console.error("API ERROR", err);
        const response = NextResponse.json({ error: "Update failed" }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}