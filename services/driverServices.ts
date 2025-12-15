import { query } from "@/lib/db";

interface DriverData {
    user_id: number;
    vehicle_brand: string;
    vehicle_color: string;
    vehicle_plate: string;
    license_document?: string | null;
    id_document?: string | null;
    vehicle_photo?: string | null;
    status?: 'En attente' | 'Approuvé' | 'Refusé';
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
            COALESCE(COUNT(t.id), 0)::integer AS trips_count
        FROM drivers d
                 JOIN users u ON u.id = d.user_id
                 LEFT JOIN trips t ON t.driver_id = d.id
        GROUP BY d.id, d.status, d.vehicle_brand, d.vehicle_color, d.vehicle_plate, d.license_document, d.id_document, d.vehicle_photo, u.name, u.email, u.phone
        ORDER BY d.created_at DESC
    `);

    return res.rows;
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

                d.vehicle_brand,
                d.vehicle_color,
                d.vehicle_plate,
                d.license_document,
                d.id_document,
                d.vehicle_photo,

                COALESCE(COUNT(t.id), 0)::integer AS trips_count
            FROM drivers d
                     JOIN users u ON u.id = d.user_id
                     LEFT JOIN trips t ON t.driver_id = d.id
            WHERE d.id = $1
            GROUP BY
                d.id, u.id
        `,
        [id]
    );

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

    const res = await query(
        `
            INSERT INTO drivers
            (user_id, vehicle_brand, vehicle_color, vehicle_plate, license_document, id_document, vehicle_photo)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *
        `,
        [user_id, vehicle_brand, vehicle_color, vehicle_plate, license_document, id_document, vehicle_photo]
    );

    return res.rows[0];
};

/* UPDATE */
export const updateDriver = async (id: number, data: DriverData) => {
    const res = await query(
        `
        UPDATE drivers SET
            vehicle_brand = COALESCE($1, vehicle_brand),
            vehicle_color = COALESCE($2, vehicle_color),
            vehicle_plate = COALESCE($3, vehicle_plate),
            license_document = COALESCE($4, license_document),
            id_document = COALESCE($5, id_document),
            vehicle_photo = COALESCE($6, vehicle_photo)
        WHERE id = $7
        RETURNING *
        `,
        [
            data.vehicle_brand,
            data.vehicle_color,
            data.vehicle_plate,
            data.license_document,
            data.id_document,
            data.vehicle_photo,
            id
        ]
    );

    return res.rows[0];
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
    const res = await query(
        `UPDATE drivers SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );

    return res.rows[0];
};

