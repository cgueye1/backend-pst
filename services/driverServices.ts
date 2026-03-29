import { query } from "@/lib/db";
import { notifyAdmins, AdminNotificationTypes } from "./notificationService";

interface DriverData {
    user_id: number;
    vehicle_brand?: string | null;
    vehicle_color?: string | null;
    vehicle_plate?: string | null;
    license_document?: string | null;
    id_document?: string | null;
    vehicle_photo?: string | null;
    status?: 'En attente' | 'Approuvé' | 'Refusé';
    capacity?: number | null;
}

// Type pour les mises à jour (sans user_id requis)
// Correspond au schéma de validation updateDriverSchema
export type DriverUpdateData = {
    vehicle_brand?: string | null;
    vehicle_color?: string | null;
    vehicle_plate?: string | null;
    license_document?: string | null;
    id_document?: string | null;
    vehicle_photo?: string | null;
    capacity?: number | null;
    status?: 'En attente' | 'Approuvé' | 'Refusé';
};

// Helper function pour normaliser les valeurs : null, undefined, ou chaîne vide -> NULL
const normalizeToNull = (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    return String(value).trim() || null;
}


/* GET ALL DRIVERS */
export const getAllDrivers = async () => {
    const res = await query(`
        SELECT
            d.id,
            d.status,
            d.vehicle_brand,
            d.vehicle_color,
            d.vehicle_plate,
            d.license_document,
            d.id_document,
            d.vehicle_photo,
            u.name,
            u.email,
            u.phone,
            u.photo_profil AS user_photo_profil,
            d.photo_profil AS driver_photo_profil,
            COALESCE(COUNT(t.id), 0)::integer AS trips_count
        FROM drivers d
                 JOIN users u ON u.id = d.user_id
                 LEFT JOIN trips t ON t.driver_id = d.id
        GROUP BY d.id, d.status, d.vehicle_brand, d.vehicle_color, d.vehicle_plate, d.license_document, d.id_document, d.vehicle_photo, u.name, u.email, u.phone, u.photo_profil, d.photo_profil
        ORDER BY d.created_at DESC
    `);

    // Utiliser la photo de users en priorité, sinon celle de drivers
    return res.rows.map(driver => {
        driver.photo_profil = driver.user_photo_profil || driver.driver_photo_profil || null;
        delete driver.user_photo_profil;
        delete driver.driver_photo_profil;
        return driver;
    });
};

/* GET DRIVER BY ID */
export const getDriverById = async (id: number) => {
    const res = await query(
        `
            SELECT
                d.id,
                d.user_id,
                d.status,
                d.created_at,

                u.name,
                u.email,
                u.phone,
                u.address,
                u.photo_profil AS user_photo_profil,

                d.vehicle_brand,
                d.vehicle_color,
                d.vehicle_plate,
                d.license_document,
                d.id_document,
                d.vehicle_photo,
                d.photo_profil AS driver_photo_profil,

                COALESCE(COUNT(t.id), 0)::integer AS trips_count
            FROM drivers d
                     JOIN users u ON u.id = d.user_id
                     LEFT JOIN trips t ON t.driver_id = d.id
            WHERE d.id = $1
            GROUP BY
                d.id, u.id, u.photo_profil, d.photo_profil
        `,
        [id]
    );

    if (res.rows[0]) {
        // Utiliser la photo de users en priorité, sinon celle de drivers
        const driver = res.rows[0];
        driver.photo_profil = driver.user_photo_profil || driver.driver_photo_profil || null;
        // Nettoyer les champs intermédiaires
        delete driver.user_photo_profil;
        delete driver.driver_photo_profil;
    }

    return res.rows[0] || null;
};

/* CREATE */
export const createDriver = async (data: DriverData) => {
    const {
        user_id,
        vehicle_brand,
        vehicle_color,
        vehicle_plate,
        license_document,
        id_document,
        vehicle_photo
    } = data;

    // Normaliser les valeurs : null, undefined, ou chaîne vide -> NULL
    const normalizedBrand = normalizeToNull(vehicle_brand);
    const normalizedColor = normalizeToNull(vehicle_color);
    const normalizedPlate = normalizeToNull(vehicle_plate);
    const normalizedLicense = normalizeToNull(license_document);
    const normalizedIdDoc = normalizeToNull(id_document);
    const normalizedPhoto = normalizeToNull(vehicle_photo);

    const res = await query(
        `
            INSERT INTO drivers
            (user_id, vehicle_brand, vehicle_color, vehicle_plate, license_document, id_document, vehicle_photo)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *
        `,
        [user_id, normalizedBrand, normalizedColor, normalizedPlate, normalizedLicense, normalizedIdDoc, normalizedPhoto]
    );

    return res.rows[0];
};

/* UPDATE */
export const updateDriver = async (id: number, data: DriverUpdateData) => {
    // Normaliser les valeurs : null, undefined, ou chaîne vide -> NULL
    // Si la clé existe dans data, on met à jour (même si c'est null)
    // Si la clé n'existe pas, on garde la valeur existante
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if ('vehicle_brand' in data) {
        updates.push(`vehicle_brand = $${paramIndex}`);
        values.push(normalizeToNull(data.vehicle_brand));
        paramIndex++;
    }
    if ('vehicle_color' in data) {
        updates.push(`vehicle_color = $${paramIndex}`);
        values.push(normalizeToNull(data.vehicle_color));
        paramIndex++;
    }
    if ('vehicle_plate' in data) {
        updates.push(`vehicle_plate = $${paramIndex}`);
        values.push(normalizeToNull(data.vehicle_plate));
        paramIndex++;
    }
    if ('license_document' in data) {
        updates.push(`license_document = $${paramIndex}`);
        values.push(normalizeToNull(data.license_document));
        paramIndex++;
    }
    if ('id_document' in data) {
        updates.push(`id_document = $${paramIndex}`);
        values.push(normalizeToNull(data.id_document));
        paramIndex++;
    }
    if ('vehicle_photo' in data) {
        updates.push(`vehicle_photo = $${paramIndex}`);
        values.push(normalizeToNull(data.vehicle_photo));
        paramIndex++;
    }
    if ('capacity' in data) {
        updates.push(`capacity = $${paramIndex}`);
        // Pour capacity, on veut garder le nombre tel quel (pas de normalisation en string)
        values.push(data.capacity !== null && data.capacity !== undefined ? data.capacity : null);
        paramIndex++;
    }

    if (updates.length === 0) {
        // Aucune mise à jour, retourner le driver existant
        return await getDriverById(id);
    }

    // Récupérer le driver existant pour détecter les changements de statut
    const existingDriver = await getDriverById(id);
    const oldStatus = existingDriver?.status;

    values.push(id);
    const res = await query(
        `
        UPDATE drivers SET
            ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
        `,
        values
    );

    const updatedDriver = res.rows[0];

    // Notifier les admins si changement de statut
    if ('status' in data && data.status && data.status !== oldStatus) {
        try {
            const userInfo = await query(
                `SELECT name, email FROM users WHERE id = $1`,
                [updatedDriver.user_id]
            );
            const userName = userInfo.rows[0]?.name || 'Chauffeur inconnu';

            await notifyAdmins(
                'Changement de statut chauffeur',
                AdminNotificationTypes.DRIVER_STATUS_CHANGE,
                `Le statut du chauffeur ${userName} a été changé de "${oldStatus}" à "${data.status}".`,
                undefined
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
        }
    }

    return updatedDriver;
};

/* DELETE */
export const deleteDriver = async (id: number) => {
    await query(`DELETE FROM drivers WHERE id = $1`, [id]);
    return true;
};

export const updateDriverStatus = async (
    id: number,
    status: 'Approuvé' | 'Refusé'
) => {
    // Récupérer le statut existant
    const existingDriver = await getDriverById(id);
    const oldStatus = existingDriver?.status;

    const res = await query(
        `UPDATE drivers SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );

    // Notifier les admins du changement de statut
    if (oldStatus && oldStatus !== status) {
        try {
            const userInfo = await query(
                `SELECT name, email FROM users WHERE id = $1`,
                [res.rows[0].user_id]
            );
            const userName = userInfo.rows[0]?.name || 'Chauffeur inconnu';

            await notifyAdmins(
                'Changement de statut chauffeur',
                AdminNotificationTypes.DRIVER_STATUS_CHANGE,
                `Le statut du chauffeur ${userName} a été changé de "${oldStatus}" à "${status}".`,
                undefined
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
        }
    }

    return res.rows[0];
};

