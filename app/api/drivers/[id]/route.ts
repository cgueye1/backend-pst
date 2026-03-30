/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Récupérer un chauffeur par son ID
 *     description: Récupère les informations détaillées d'un chauffeur spécifique
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du chauffeur
 *         example: 1
 *     responses:
 *       200:
 *         description: Chauffeur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 status:
 *                   type: string
 *                 trips_count:
 *                   type: integer
 *       404:
 *         description: Chauffeur introuvable
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Mettre à jour un chauffeur
 *     description: Met à jour les informations d'un chauffeur (admin uniquement)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du chauffeur
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_brand:
 *                 type: string
 *                 nullable: true
 *                 example: "Toyota"
 *               vehicle_color:
 *                 type: string
 *                 nullable: true
 *                 example: "Blanc"
 *               vehicle_plate:
 *                 type: string
 *                 nullable: true
 *               license_document:
 *                 type: string
 *                 format: binary
 *                 description: Document de permis de conduire (PDF ou image)
 *               id_document:
 *                 type: string
 *                 format: binary
 *                 description: Document d'identité (PDF ou image)
 *               vehicle_photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo du véhicule (image)
 *               capacity:
 *                 type: integer
 *                 nullable: true
 *           encoding:
 *             license_document:
 *               contentType: application/pdf, image/jpeg, image/png, image/webp
 *             id_document:
 *               contentType: application/pdf, image/jpeg, image/png, image/webp
 *             vehicle_photo:
 *               contentType: image/jpeg, image/png, image/webp
 *     responses:
 *       200:
 *         description: Chauffeur mis à jour avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un chauffeur
 *     description: Supprime un chauffeur de la base de données (admin uniquement)
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du chauffeur
 *     responses:
 *       200:
 *         description: Chauffeur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Erreur serveur
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
import path from "path";
import { saveUploadsFile } from "@/lib/storage";

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
        const driverId = Number(id);

        // Vérifier si le Content-Type est multipart/form-data
        const contentType = req.headers.get('content-type') || '';
        const isMultipart = contentType.includes('multipart/form-data');

        let updateData: Partial<DriverUpdateData> = {};

        if (isMultipart) {
            // Gérer multipart/form-data pour les uploads de fichiers
            const formData = await req.formData();

            // Récupérer les champs texte
            const vehicle_brand = formData.get("vehicle_brand") as string | null;
            const vehicle_color = formData.get("vehicle_color") as string | null;
            const vehicle_plate = formData.get("vehicle_plate") as string | null;
            const capacity = formData.get("capacity") ? Number(formData.get("capacity")) : null;

            // Récupérer les fichiers
            const license_document_file = formData.get("license_document") as File | null;
            const id_document_file = formData.get("id_document") as File | null;
            const vehicle_photo_file = formData.get("vehicle_photo") as File | null;

            const saveFile = async (file: File | null, prefix: string): Promise<string | null> => {
                if (!file || file.size === 0) return null;

                const ext = path.extname(file.name) || '.pdf';
                const filename = `${prefix}_${driverId}_${Date.now()}${ext}`;
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const fileUrl = await saveUploadsFile(
                    `drivers/${filename}`,
                    buffer,
                    file.type || undefined
                );
                console.log(`✅ ${prefix} sauvegardé: ${fileUrl}`);
                return fileUrl;
            };

            // Sauvegarder les fichiers si fournis
            const license_document_path = await saveFile(license_document_file, "license");
            const id_document_path = await saveFile(id_document_file, "id_document");
            const vehicle_photo_path = await saveFile(vehicle_photo_file, "vehicle_photo");

            // Construire l'objet de mise à jour
            if (vehicle_brand !== null) updateData.vehicle_brand = vehicle_brand;
            if (vehicle_color !== null) updateData.vehicle_color = vehicle_color;
            if (vehicle_plate !== null) updateData.vehicle_plate = vehicle_plate;
            if (capacity !== null) updateData.capacity = capacity;
            if (license_document_path !== null) updateData.license_document = license_document_path;
            if (id_document_path !== null) updateData.id_document = id_document_path;
            if (vehicle_photo_path !== null) updateData.vehicle_photo = vehicle_photo_path;
        } else {
            // Gérer application/json (pour compatibilité)
        const body = await req.json();
        const validation = validateData(updateDriverSchema, body, origin);
        if (!validation.success) {
            return validation.response;
        }
            updateData = validation.data as Partial<DriverUpdateData>;
        }

        // Mettre à jour le chauffeur
        const updated = await updateDriver(driverId, updateData);
        const response = NextResponse.json(updated);
        return setCorsHeaders(response, origin);
    } catch (err) {
        console.error("Erreur mise à jour chauffeur:", err);
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
