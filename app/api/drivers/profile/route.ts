/**
 * @swagger
 * /api/drivers/profile:
 *   get:
 *     summary: Récupérer le profil complet du chauffeur
 *     description: >
 *       Récupère toutes les informations du profil du chauffeur authentifié :
 *       - Informations personnelles (nom, email, téléphone, adresse, photo)
 *       - Informations du chauffeur (ID, statut)
 *       - Informations du véhicule (marque, couleur, plaque, capacité)
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     personal:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         first_name:
 *                           type: string
 *                           example: "Amadou"
 *                         last_name:
 *                           type: string
 *                           example: "Diallo"
 *                         full_name:
 *                           type: string
 *                           example: "Amadou Diallo"
 *                         email:
 *                           type: string
 *                           example: "amadou@example.com"
 *                         phone:
 *                           type: string
 *                           example: "+221771234567"
 *                         address:
 *                           type: string
 *                           example: "Dakar, Almadies"
 *                         photo_profil:
 *                           type: string
 *                           nullable: true
 *                           example: "/uploads/drivers/driver_1_1234567890.jpg"
 *                     driver:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         status:
 *                           type: string
 *                           enum: [En attente, Approuvé, Refusé]
 *                           example: "Approuvé"
 *                         photo_profil:
 *                           type: string
 *                           nullable: true
 *                         id_document:
 *                            type: string
 *                            nullable: true
 *                            example: "/uploads/drivers/driver_1_1234567890.jpg"
 *                         license_document:
 *                            type: string
 *                            nullable: true
 *                            example: "/uploads/drivers/driver_1_1234567890.jpg"
 *                     vehicle:
 *                       type: object
 *                       properties:
 *                         brand:
 *                           type: string
 *                           nullable: true
 *                           example: "Toyota"
 *                         color:
 *                           type: string
 *                           nullable: true
 *                           example: "Blanc"
 *                         plate:
 *                           type: string
 *                           nullable: true
 *                           example: "ABC-123"
 *                         capacity:
 *                           type: integer
 *                           nullable: true
 *                           example: 4
 *                         photo:
 *                           type: string
 *                           nullable: true
 *                           description: Photo du véhicule
 *                           example: "/uploads/drivers/vehicle_photo_1_1234567890.jpg"
 *       403:
 *         description: Non autorisé - Token invalide ou utilisateur n'est pas un chauffeur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Non autorisé"
 *       404:
 *         description: Chauffeur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chauffeur introuvable"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import path from "path";
import fs from "fs";


import { setCorsHeaders, corsOptions } from '@/lib/cors';
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== "driver") {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const result = await query(
            `
                SELECT
                    u.id AS user_id,
                    u.name,
                    u.email,
                    u.phone,
                    u.address,
                    u.photo_profil AS user_photo_profil,

                    d.id AS driver_id,
                    d.vehicle_brand,
                    d.vehicle_color,
                    d.vehicle_plate,
                    d.capacity,
                    d.license_document,
                    d.id_document,
                    d.vehicle_photo,
                    d.photo_profil AS driver_photo_profil,
                    d.status AS driver_status

                FROM users u
                         JOIN drivers d ON d.user_id = u.id
                WHERE u.id = $1
            `,
            [user.id]
        );

        if (result.rowCount === 0) {
            const response = NextResponse.json(
                { error: "Chauffeur introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const profile = result.rows[0];

        //  Séparer prénom / nom depuis "name"
        const nameParts = profile.name?.trim().split(" ") || [];
        const first_name = nameParts.shift() || "";
        const last_name = nameParts.join(" ");

        // Utiliser la photo de users en priorité, sinon celle de drivers
        const photo_profil = profile.user_photo_profil || profile.driver_photo_profil || null;

        const response = NextResponse.json({
            success: true,
            data: {
                personal: {
                    id: profile.user_id,
                    first_name,
                    last_name,
                    full_name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    address: profile.address,
                    photo_profil: photo_profil,
                },

                driver: {
                    id: profile.driver_id,
                    status: profile.driver_status,
                    photo_profil: photo_profil,
                    license_document: profile.license_document,
                    id_document: profile.id_document
                },

                vehicle: {
                    brand: profile.vehicle_brand,
                    color: profile.vehicle_color,
                    plate: profile.vehicle_plate,
                    capacity: profile.capacity,
                    photo: profile.vehicle_photo
                }
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur récupération profil chauffeur:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

/**
 * @swagger
 * /api/drivers/profile:
 *   put:
 *     summary: Mettre à jour le profil du chauffeur
 *     description: >
 *       Met à jour les informations du profil du chauffeur authentifié.
 *       **IMPORTANT:** Cette endpoint utilise `multipart/form-data` (pas JSON).
 *       Tous les champs sont optionnels - seuls les champs fournis seront mis à jour.
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Prénom du chauffeur
 *                 example: "Amadou"
 *               last_name:
 *                 type: string
 *                 description: Nom du chauffeur
 *                 example: "Diallo"
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone (format international recommandé)
 *                 example: "+221771234567"
 *               address:
 *                 type: string
 *                 description: Adresse complète du chauffeur
 *                 example: "Dakar, Almadies, Sénégal"
 *               vehicle_brand:
 *                 type: string
 *                 description: Marque du véhicule
 *                 example: "Toyota"
 *               vehicle_color:
 *                 type: string
 *                 description: Couleur du véhicule
 *                 example: "Blanc"
 *               capacity:
 *                 type: integer
 *                 description: Capacité du véhicule (nombre de places disponibles)
 *                 example: 4
 *               photo_profil:
 *                 type: string
 *                 format: binary
 *                 description: Photo de profil (fichier image - JPG, PNG, WEBP acceptés)
 *           encoding:
 *             photo_profil:
 *               contentType: image/jpeg, image/png, image/webp
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profil mis à jour avec succès"
 *                 photo_profil:
 *                   type: string
 *                   nullable: true
 *                   description: URL de la photo si elle a été mise à jour
 *                   example: "/uploads/drivers/driver_1_1234567890.jpg"
 *       400:
 *         description: Erreur de validation ou format incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Content-Type was not one of \"multipart/form-data\" or \"application/x-www-form-urlencoded\"."
 *       403:
 *         description: Non autorisé - Token invalide ou utilisateur n'est pas un chauffeur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Non autorisé"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la mise à jour du profil"
 */



export async function PUT(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== "driver") {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }


        const formData = await request.formData();

        const first_name = formData.get("first_name") as string | null;
        const last_name = formData.get("last_name") as string | null;
        const phone = formData.get("phone") as string | null;
        const address = formData.get("address") as string | null;
        const vehicle_brand = formData.get("vehicle_brand") as string | null;
        const vehicle_color = formData.get("vehicle_color") as string | null;
        const capacity = formData.get("capacity")
            ? Number(formData.get("capacity"))
            : null;

        const photoFile = formData.get("photo_profil") as File | null;

        //  Reconstruire name
        let fullName: string | null = null;
        if (first_name || last_name) {
            fullName = `${first_name || ""} ${last_name || ""}`.trim();
        }

        //   Gérer l'upload de la photo
        let photo_url: string | null = null;

        if (photoFile && photoFile.size > 0) {
            // Sauvegarder dans uploads/drivers (servi via /api/uploads/{path} ou /uploads/{path})
            // Gérer Docker et local
            const isDocker = fs.existsSync('/app/uploads');
            const uploadsBase = isDocker ? '/app/uploads' : path.join(process.cwd(), 'uploads');
            const uploadDir = path.join(uploadsBase, 'drivers');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const ext = path.extname(photoFile.name);
            const filename = `driver_${user.id}_${Date.now()}${ext}`;
            const filePath = path.join(uploadDir, filename);

            const bytes = await photoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            fs.writeFileSync(filePath, buffer);

            // URL accessible via /api/uploads/drivers/{filename}
            photo_url = `/uploads/drivers/${filename}`;
            console.log(`✅ Photo sauvegardée: ${photo_url} (fichier: ${filePath})`);
        }

        await query("BEGIN");

        try {
            //  USERS - Mettre à jour name, phone, address et photo_profil
            const userUpdateFields: string[] = [];
            const userUpdateValues: any[] = [];
            let userParamIndex = 1;

            if (fullName !== null) {
                userUpdateFields.push(`name = $${userParamIndex}`);
                userUpdateValues.push(fullName);
                userParamIndex++;
            }

            if (phone !== null) {
                userUpdateFields.push(`phone = $${userParamIndex}`);
                userUpdateValues.push(phone);
                userParamIndex++;
            }

            if (address !== null) {
                userUpdateFields.push(`address = $${userParamIndex}`);
                userUpdateValues.push(address);
                userParamIndex++;
            }

            // Mettre à jour photo_profil dans users SEULEMENT si une nouvelle photo est fournie
            if (photo_url !== null) {
                userUpdateFields.push(`photo_profil = $${userParamIndex}`);
                userUpdateValues.push(photo_url);
                userParamIndex++;
            }

            // Ajouter user.id à la fin pour la clause WHERE
            const userWhereParamIndex = userParamIndex;
            userUpdateValues.push(user.id);

            if (userUpdateFields.length > 0) {
            await query(
                `
                UPDATE users
                    SET ${userUpdateFields.join(', ')}
                    WHERE id = $${userWhereParamIndex}
                `,
                    userUpdateValues
            );
            }

            //   DRIVERS (photo_profil ici )
            // Normaliser les valeurs : null, undefined, ou chaîne vide -> NULL
            const normalizeToNull = (value: any): string | null => {
                if (value === null || value === undefined || value === '') {
                    return null;
                }
                return String(value).trim() || null;
            };

            const normalizedBrand = normalizeToNull(vehicle_brand);
            const normalizedColor = normalizeToNull(vehicle_color);

            // Construire la requête UPDATE dynamiquement selon les champs fournis
            const updateFields: string[] = [];
            const updateValues: any[] = [];
            let paramIndex = 1;

            if (normalizedBrand !== null) {
                updateFields.push(`vehicle_brand = $${paramIndex}`);
                updateValues.push(normalizedBrand);
                paramIndex++;
            }

            if (normalizedColor !== null) {
                updateFields.push(`vehicle_color = $${paramIndex}`);
                updateValues.push(normalizedColor);
                paramIndex++;
            }

            if (capacity !== null) {
                updateFields.push(`capacity = $${paramIndex}`);
                updateValues.push(capacity);
                paramIndex++;
            }

            // Mettre à jour photo_profil SEULEMENT si une nouvelle photo est fournie
            if (photo_url !== null) {
                updateFields.push(`photo_profil = $${paramIndex}`);
                updateValues.push(photo_url);
                paramIndex++;
            }

            // Ajouter user_id à la fin pour la clause WHERE
            const userIdParamIndex = paramIndex;
            updateValues.push(user.id);

            if (updateFields.length > 0) {
            await query(
                `
                UPDATE drivers
                    SET ${updateFields.join(', ')}
                    WHERE user_id = $${userIdParamIndex}
                    `,
                    updateValues
                );
                console.log(`✅ Profil mis à jour pour user_id: ${user.id}, photo_profil: ${photo_url || 'non modifié'}`);
            }

            await query("COMMIT");

            const successResponse = NextResponse.json({
                success: true,
                message: "Profil mis à jour avec succès",
                photo_profil: photo_url
            });
            return setCorsHeaders(successResponse, origin);

        } catch (err) {
            await query("ROLLBACK");
            throw err;
        }

    } catch (error: any) {
        console.error("Erreur update profil chauffeur:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

