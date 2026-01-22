/**
 * @swagger
 * /api/auth/register-driver:
 *   post:
 *     summary: Inscription d'un chauffeur
 *     tags: [Auth]

 */

import { NextRequest, NextResponse } from "next/server";
import { File } from "formdata-node";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { registerDriverSchema, validateData, validateFormData } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Dossier uploads
const uploadDir = path.join(process.cwd(), "uploads/drivers");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: Request) {
    const origin = req.headers.get('origin');
    try {
        const contentType = req.headers.get('content-type') || '';
        let first_name: string | null = null;
        let last_name: string | null = null;
        let email: string | null = null;
        let phone: string | null = null;
        let password: string | null = null;
        let vehicle_brand: string | null = null;
        let vehicle_color: string | null = null;
        let vehicle_plate: string | null = null;
        let capacity: number | null = null;
        let license_document: File | null = null;
        let id_document: File | null = null;
        let vehicle_photo: File | null = null;

        // Gérer à la fois form-data et JSON
        if (contentType.includes('application/json')) {
            // Si c'est du JSON
            const body = await req.json();
            first_name = body.first_name || body.firstname || body.firstName || body.prenom || null;
            last_name = body.last_name || body.lastname || body.lastName || body.nom || null;
            email = body.email || null;
            phone = body.phone || body.telephone || body.tel || null;
            password = body.password || body.pwd || body.pass || null;
            vehicle_brand = body.vehicle_brand || null;
            vehicle_color = body.vehicle_color || null;
            vehicle_plate = body.vehicle_plate || null;
            capacity = body.capacity ? parseInt(body.capacity) : null;
        } else {
            // Si c'est du form-data
            const formData = await req.formData();

            // Fonction améliorée pour récupérer les champs avec plusieurs variantes possibles
            const getField = (name: string, alternatives?: string[]) => {
                // Essayer le nom principal
                let value = formData.get(name);
                if (value && value.toString().trim()) {
                    return value.toString().trim();
                }

                // Essayer les alternatives si fournies
                if (alternatives) {
                    for (const alt of alternatives) {
                        value = formData.get(alt);
                        if (value && value.toString().trim()) {
                            return value.toString().trim();
                        }
                    }
                }

                return null;
            };

            const getFile = (name: string) => formData.get(name) as File | null;

            // Récupérer les champs avec variantes possibles
            first_name = getField("first_name", ["firstname", "firstName", "first-name", "prenom"]);
            last_name = getField("last_name", ["lastname", "lastName", "last-name", "nom"]);
            email = getField("email");
            phone = getField("phone", ["telephone", "tel"]);
            password = getField("password", ["pwd", "pass"]);
            vehicle_brand = getField("vehicle_brand");
            vehicle_color = getField("vehicle_color");
            vehicle_plate = getField("vehicle_plate");
            capacity = getField("capacity") ? parseInt(getField("capacity")!) : null;
            license_document = getFile("license_document");
            id_document = getFile("id_document");
            vehicle_photo = getFile("vehicle_photo");
        }

        // Validation des données avec Zod
        let validatedData: {
            first_name: string;
            last_name: string;
            email: string;
            phone?: string | null;
            password: string;
            vehicle_brand?: string | null;
            vehicle_color?: string | null;
            vehicle_plate?: string | null;
            capacity?: number | null;
        };

        if (contentType.includes('application/json')) {
            // Validation pour JSON
            const validation = validateData(registerDriverSchema, {
                first_name,
                last_name,
                email,
                phone,
                password,
                vehicle_brand,
                vehicle_color,
                vehicle_plate,
                capacity
            }, origin);

            if (!validation.success) {
                return validation.response;
            }
            validatedData = validation.data;

            // Mettre à jour les variables locales avec les données validées
            first_name = validatedData.first_name;
            last_name = validatedData.last_name;
            email = validatedData.email;
            phone = validatedData.phone || null;
            password = validatedData.password;
            vehicle_brand = validatedData.vehicle_brand || null;
            vehicle_color = validatedData.vehicle_color || null;
            vehicle_plate = validatedData.vehicle_plate || null;
            capacity = validatedData.capacity || null;
        } else {
            // Si c'est du form-data, on a déjà récupéré les valeurs
            // Validation pour form-data
            const formDataObj: Record<string, any> = {};
            if (first_name) formDataObj.first_name = first_name;
            if (last_name) formDataObj.last_name = last_name;
            if (email) formDataObj.email = email;
            if (phone) formDataObj.phone = phone;
            if (password) formDataObj.password = password;
            if (vehicle_brand) formDataObj.vehicle_brand = vehicle_brand;
            if (vehicle_color) formDataObj.vehicle_color = vehicle_color;
            if (vehicle_plate) formDataObj.vehicle_plate = vehicle_plate;
            if (capacity !== null) formDataObj.capacity = capacity;

            const validation = validateData(registerDriverSchema, formDataObj, origin);
            if (!validation.success) {
                return validation.response;
            }
            validatedData = validation.data;

            // Mettre à jour les variables locales avec les données validées
            first_name = validatedData.first_name;
            last_name = validatedData.last_name;
            email = validatedData.email;
            phone = validatedData.phone || null;
            password = validatedData.password;
            vehicle_brand = validatedData.vehicle_brand || null;
            vehicle_color = validatedData.vehicle_color || null;
            vehicle_plate = validatedData.vehicle_plate || null;
            capacity = validatedData.capacity || null;
        }

        const hashedPassword = await hashPassword(password);

        // Construire le nom complet en gérant les cas null
        const fullName = [first_name, last_name]
            .filter(name => name && name.trim())
            .join(' ')
            .trim() || first_name || last_name || '';

        // Création utilisateur
        const userRes = await query(
            `INSERT INTO users (name,email,phone,password,role)
       VALUES ($1,$2,$3,$4,'driver') RETURNING id, name, email, phone, role, created_at`,
            [fullName, email, phone, hashedPassword]
        );
        const userId = userRes.rows[0].id;

        // Fonction pour sauvegarder le fichier
        const saveFile = async (file: File | null) => {
            if (!file) return null;
            const filename = `${Date.now()}_${file.name}`;
            const filePath = path.join(uploadDir, filename);
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            return `/uploads/drivers/${filename}`;
        };

        // Sauvegarder les fichiers si fournis (seulement pour form-data)
        const license_document_path = license_document ? await saveFile(license_document) : null;
        const id_document_path = id_document ? await saveFile(id_document) : null;
        const vehicle_photo_path = vehicle_photo ? await saveFile(vehicle_photo) : null;
        //const poto_profil = await saveFile(getFile("poto_profil"));

        // Normaliser les valeurs : null, undefined, ou chaîne vide -> NULL
        const normalizeToNull = (value: any): string | null => {
            if (value === null || value === undefined || value === '') {
                return null;
            }
            return String(value).trim() || null;
        };

        const normalizedBrand = normalizeToNull(vehicle_brand);
        const normalizedColor = normalizeToNull(vehicle_color);
        const normalizedPlate = normalizeToNull(vehicle_plate);
        const normalizedLicense = normalizeToNull(license_document_path);
        const normalizedIdDoc = normalizeToNull(id_document_path);
        const normalizedPhoto = normalizeToNull(vehicle_photo_path);

        // Création driver
        const driverRes = await query(
            `INSERT INTO drivers (user_id, vehicle_brand, vehicle_color, vehicle_plate, capacity, license_document, id_document, vehicle_photo )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8 ) RETURNING id`,
            [userId, normalizedBrand, normalizedColor, normalizedPlate, capacity, normalizedLicense, normalizedIdDoc, normalizedPhoto]
        );

        // Notifier les admins de la nouvelle inscription
        try {
            const { notifyAdmins, AdminNotificationTypes } = await import('@/services/notificationService');
            await notifyAdmins(
                'Nouvelle inscription chauffeur',
                AdminNotificationTypes.NEW_DRIVER_REGISTRATION,
                `Un nouveau chauffeur s'est inscrit : ${fullName} (${email}). Statut : En attente d'approbation.`,
                userId
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
            // Ne pas faire échouer l'inscription si la notification échoue
        }

        // Retourner les informations complètes de l'utilisateur créé
        const userData = userRes.rows[0];

        const response = NextResponse.json({
            success: true,
            message: "Inscription chauffeur réussie",
            user: {
                id: userId,
                first_name: first_name || null,
                last_name: last_name || null,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                created_at: userData.created_at
            },
            driver: {
                id: driverRes.rows[0].id
            }
        });

        return setCorsHeaders(response, origin);

    } catch (err: any) {
        console.error(err);

        // Gestion d'erreurs améliorée pour le frontend
        let errorMessage = "Erreur lors de l'inscription";
        let userMessage = errorMessage;

        if (err.message) {
            errorMessage = err.message;
            userMessage = err.message;

            // Messages spécifiques pour les erreurs courantes
            if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
                if (err.message.includes('email')) {
                    userMessage = "Cet email est déjà utilisé";
                } else if (err.message.includes('vehicle_plate')) {
                    userMessage = "Cette plaque d'immatriculation est déjà enregistrée";
                } else {
                    userMessage = "Un compte avec ces informations existe déjà";
                }
            } else if (err.message.includes('not-null constraint')) {
                userMessage = "Des champs requis sont manquants";
            }
        }

        const errorResponse = NextResponse.json(
            {
                success: false,
                error: errorMessage,
                message: userMessage,
                userMessage: userMessage
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
