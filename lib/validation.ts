import { z } from 'zod';
import { NextResponse } from 'next/server';
import { setCorsHeaders } from './cors';

/**
 * Schémas de validation Zod pour les endpoints
 */

// Schéma pour l'inscription d'un driver
export const registerDriverSchema = z.object({
    first_name: z.string().min(1, "Le prénom est requis").max(100, "Le prénom est trop long"),
    last_name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
    email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Numéro de téléphone invalide").optional().nullable(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(100, "Le mot de passe est trop long"),
    vehicle_brand: z.string().max(100).optional().nullable(),
    vehicle_color: z.string().max(50).optional().nullable(),
    vehicle_plate: z.string().max(20).optional().nullable(),
    capacity: z.coerce.number().int().min(1, "La capacité doit être au moins 1").max(50, "La capacité ne peut pas dépasser 50").optional().nullable(),
});

// Schéma pour l'inscription d'un parent
export const registerParentSchema = z.object({
    name: z.string().min(1, "Le nom est requis").max(150, "Le nom est trop long"),
    email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Numéro de téléphone invalide").optional().nullable(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(100, "Le mot de passe est trop long"),
});

// Schéma pour créer un utilisateur (admin)
export const createUserSchema = z.object({
    name: z.string().min(1, "Le nom est requis").max(150, "Le nom est trop long"),
    email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Numéro de téléphone invalide").optional().nullable(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
    role: z.enum(['admin', 'parent', 'driver'], {
        message: "Le rôle doit être 'admin', 'parent' ou 'driver'"
    }),
    address: z.string().max(255).optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
});

// Schéma pour mettre à jour un utilisateur
export const updateUserSchema = z.object({
    name: z.string().min(1, "Le nom est requis").max(150, "Le nom est trop long").optional(),
    email: z.string().email("Format d'email invalide").optional(),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Numéro de téléphone invalide").optional().nullable(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
    role: z.enum(['admin', 'parent', 'driver']).optional(),
    address: z.string().max(255).optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
});

// Schéma pour mettre à jour un driver
// Note: status est géré séparément via updateDriverStatus, donc on ne l'inclut pas ici
export const updateDriverSchema = z.object({
    vehicle_brand: z.string().max(100).optional().nullable(),
    vehicle_color: z.string().max(50).optional().nullable(),
    vehicle_plate: z.string().max(20).optional().nullable(),
    license_document: z.string().optional().nullable(),
    id_document: z.string().optional().nullable(),
    vehicle_photo: z.string().optional().nullable(),
    capacity: z.coerce.number().int().min(1, "La capacité doit être au moins 1").max(50, "La capacité ne peut pas dépasser 50").optional().nullable(),
});

// Type inféré du schéma (correspond à DriverUpdateData sans status)
export type UpdateDriverSchemaType = z.infer<typeof updateDriverSchema>;

// Type inféré du schéma
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;

// Schéma pour créer une école
export const createSchoolSchema = z.object({
    name: z.string().min(1, "Le nom est requis").max(200, "Le nom est trop long"),
    address: z.string().min(1, "L'adresse est requise").max(500, "L'adresse est trop longue"),
    opening_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)").optional(),
    closing_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)").optional(),
});

/**
 * Helper pour valider les données avec Zod
 * @param schema - Le schéma Zod à utiliser
 * @param data - Les données à valider
 * @param origin - L'origine pour les headers CORS
 * @returns Les données validées ou null si erreur (et réponse d'erreur envoyée)
 */
export function validateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    origin: string | null
): { success: true; data: T } | { success: false; response: NextResponse } {
    try {
        const validated = schema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.map((err: z.ZodIssue) => ({
                field: err.path.join('.'),
                message: err.message
            }));

            // Format de réponse optimisé pour le frontend
            // Le frontend cherche err.error.error ou err.error.message
            const response = NextResponse.json(
                {
                    success: false,
                    error: "Données invalides",
                    message: errors.length > 0 
                        ? errors.map(e => `${e.field}: ${e.message}`).join(', ')
                        : "Veuillez vérifier les champs du formulaire",
                    details: errors,
                    // Format simple pour compatibilité avec le frontend existant
                    userMessage: errors.length === 1 
                        ? errors[0].message 
                        : `${errors.length} erreur(s) de validation`
                },
                { status: 400 }
            );
            return { success: false, response: setCorsHeaders(response, origin) };
        }

        // Erreur inattendue
        const response = NextResponse.json(
            {
                success: false,
                error: "Erreur de validation"
            },
            { status: 500 }
        );
        return { success: false, response: setCorsHeaders(response, origin) };
    }
}

/**
 * Helper pour valider les données depuis formData (conversion en objet)
 */
export function validateFormData<T>(
    schema: z.ZodSchema<T>,
    formData: FormData,
    origin: string | null
): { success: true; data: T } | { success: false; response: NextResponse } {
    // Convertir FormData en objet
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
        // Gérer les valeurs multiples
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    });

    return validateData(schema, data, origin);
}

