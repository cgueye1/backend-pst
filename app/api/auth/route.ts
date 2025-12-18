import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {getUserById, updateUser} from "@/services/userServices";

export async function GET(req: NextRequest) {
    try {
        //   Récupération du token
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        //   Vérification JWT
        const decoded: any = verifyToken(token);

        //   Récupération utilisateur
        const user = await getUserById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
        }
        const fullName = user.name || "";

        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");

        return NextResponse.json({
            id: user.id,
            firstName,
            lastName,
            role: user.role,
            status: user.status,
            phone: user.phone,
            email: user.email,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Token invalide" },
            { status: 401 }
        );
    }
}

