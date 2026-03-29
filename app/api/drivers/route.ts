/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Récupérer tous les chauffeurs
 *     description: >
 *       Récupère la liste complète de tous les chauffeurs avec leurs informations :
 *       - Informations personnelles (nom, email, téléphone)
 *       - Informations du véhicule (marque, couleur, plaque)
 *       - Statut du chauffeur
 *       - Nombre de trajets effectués
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des chauffeurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Amadou Diallo"
 *                   email:
 *                     type: string
 *                     example: "amadou@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+221771234567"
 *                   status:
 *                     type: string
 *                     enum: [En attente, Approuvé, Refusé]
 *                     example: "Approuvé"
 *                   vehicle_brand:
 *                     type: string
 *                     nullable: true
 *                     example: "Toyota"
 *                   vehicle_color:
 *                     type: string
 *                     nullable: true
 *                     example: "Blanc"
 *                   vehicle_plate:
 *                     type: string
 *                     nullable: true
 *                     example: "ABC-123"
 *                   trips_count:
 *                     type: integer
 *                     example: 15
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   post:
 *     summary: Créer un nouveau chauffeur
 *     description: >
 *       Crée un nouveau chauffeur. Nécessite un user_id existant.
 *       Les documents (license_document, id_document, vehicle_photo) sont optionnels.
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID de l'utilisateur existant
 *                 example: 1
 *               vehicle_brand:
 *                 type: string
 *                 nullable: true
 *                 description: Marque du véhicule
 *                 example: "Toyota"
 *               vehicle_color:
 *                 type: string
 *                 nullable: true
 *                 description: Couleur du véhicule
 *                 example: "Blanc"
 *               vehicle_plate:
 *                 type: string
 *                 nullable: true
 *                 description: Plaque d'immatriculation
 *                 example: "ABC-123"
 *               license_document:
 *                 type: string
 *                 nullable: true
 *                 description: URL du document de permis
 *               id_document:
 *                 type: string
 *                 nullable: true
 *                 description: URL du document d'identité
 *               vehicle_photo:
 *                 type: string
 *                 nullable: true
 *                 description: URL de la photo du véhicule
 *               capacity:
 *                 type: integer
 *                 nullable: true
 *                 description: Capacité du véhicule
 *                 example: 4
 *     responses:
 *       201:
 *         description: Chauffeur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: "En attente"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
import { NextRequest, NextResponse } from "next/server";
import { getAllDrivers, createDriver } from "@/services/driverServices";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const drivers = await getAllDrivers();
        const response = NextResponse.json(drivers);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const data = await req.json();
        const driver = await createDriver(data);
        const response = NextResponse.json(driver, { status: 201 });
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
