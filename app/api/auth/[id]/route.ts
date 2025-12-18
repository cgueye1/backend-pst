import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getUserById, updateUser } from "@/services/userServices";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log("PUT /api/auth/[id] APPELÉ");

        //   Vérification du token
        const auth = req.headers.get("authorization");
        if (!auth) {
            return NextResponse.json({ message: "No token" }, { status: 401 });
        }

        verifyToken(auth.split(" ")[1]); // juste pour vérifier

        //   ID depuis l’URL
        const userId = Number(params.id);

        //   Body (UNE SEULE FOIS)
        const { name, email, phone } = await req.json();

        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
        }

        const updatedUser = await updateUser(userId, {
            name,
            email,
            phone
        });

        return NextResponse.json(updatedUser);

    } catch (err) {
        console.error("API ERROR", err);
        return NextResponse.json(
            { error: "Update failed" },
            { status: 500 }
        );
    }
}
