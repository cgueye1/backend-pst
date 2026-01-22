/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Récupérer un chauffeur par son ID
 *     tags: [ADMIN]
 *
 *   put:
 *     summary: Mettre à jour un chauffeur
 *     tags: [ADMIN]
 *
 *   delete:
 *     summary: Supprimer un chauffeur
 *     tags: [ADMIN]
 */

import { NextRequest, NextResponse } from "next/server";
import {
    getDriverById,
    updateDriver,
    deleteDriver,
    type DriverUpdateData,
} from "@/services/driverServices";
import { authMiddleware } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";
import { updateDriverSchema, validateData } from "@/lib/validation";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        authMiddleware(req);

        const { id } = await context.params;
        const driver = await getDriverById(Number(id));

        const response = NextResponse.json(driver);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function PUT(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        authMiddleware(req);

        const { id } = await context.params;
        const body = await req.json();

        // Validation des données avec Zod
        const validation = validateData(updateDriverSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }

        // Les données validées correspondent au type DriverUpdateData
        // (sans status qui est géré par un endpoint séparé)
        // Le type assertion est nécessaire car Zod infère un type légèrement différent
        const updated = await updateDriver(Number(id), validation.data as Partial<DriverUpdateData>);
        const response = NextResponse.json(updated);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function DELETE(req: NextRequest, context: Params) {
    const origin = req.headers.get('origin');
    try {
        authMiddleware(req);

        const { id } = await context.params;
        await deleteDriver(Number(id));

        const response = NextResponse.json({ success: true });
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
