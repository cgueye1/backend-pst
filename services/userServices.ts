import { query } from "../lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import crypto from "crypto";
import { query as dbQuery } from "../lib/db";
import { notifyAdmins, AdminNotificationTypes } from "./notificationService";
/*  CREATE  */
// Génère un mot de passe par défaut selon le rôle, sinon aléatoire
const generatePassword = (role?: string) => {
    const normalized = (role || "").toLowerCase();
    if (normalized === "driver") return "driver123";
    if (normalized === "parent") return "parent123";
    if (normalized === "admin") return "admin123";
    const bytes = crypto.randomBytes(6).toString("base64url"); // ~8 chars
    return bytes.slice(0, 10);
};

export const createUser = async (data: any) => {
    const role = (data.role || "parent").toLowerCase();
    const status = data.status || "active";
    const plainPassword = data.password || generatePassword(role);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const res = await query(
        `INSERT INTO users (name, email, password, role, phone,address , status )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, email, role, phone, address ,status, created_at`,
        [data.name, data.email, hashedPassword, role, data.phone, data.address, status]
    );

    // Si le rôle est driver, créer l'entrée associée avec tous les champs NULL
    if (role === "driver") {
        try {
            await dbQuery(
                `INSERT INTO drivers (user_id, vehicle_brand, vehicle_color, vehicle_plate, license_document, id_document, vehicle_photo) 
                 VALUES ($1, NULL, NULL, NULL, NULL, NULL, NULL) 
                 ON CONFLICT (user_id) DO NOTHING`,
                [res.rows[0].id]
            );
        } catch (err: any) {
            // Si erreur de contrainte NOT NULL, donner un message clair
            if (err.message && err.message.includes('not-null constraint')) {
                throw new Error(
                    'La base de données nécessite une migration. ' +
                    'Exécutez le script SQL: backend/sql/fix_driver_nullable.sql ' +
                    'pour rendre les champs nullable. Erreur: ' + err.message
                );
            }
            throw err;
        }
    }

    // Notifier les admins si création d'un driver
    if (role === "driver") {
        try {
            await notifyAdmins(
                'Nouveau chauffeur créé',
                AdminNotificationTypes.NEW_DRIVER_REGISTRATION,
                `Un nouveau chauffeur a été créé par un admin : ${data.name} (${data.email}). Statut : En attente d'approbation.`,
                undefined
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
        }
    }

    // On ne renvoie pas le hash ; on peut inclure le mot de passe généré si besoin de l'afficher côté front
    return { ...res.rows[0], generatedPassword: data.password ? undefined : plainPassword };
};

/*  READ */
export const getAllUsers = async () => {
    const res = await query(
        `SELECT id, name, email, role, phone, status,address , created_at
         FROM users
         ORDER BY id DESC`
    );
    return res.rows;
};

export const getUserById = async (id: number) => {
    const res = await query(
        `SELECT id, name, email, role, phone,address , status, created_at
         FROM users
         WHERE id=$1`,
        [id]
    );
    return res.rows[0] || null;
};

export const getUserByEmail = async (email: string) => {
    const res = await query(
        `SELECT *
         FROM users
         WHERE email=$1`,
        [email]
    );
    return res.rows[0] || null;
};

/*  UPDATE */
export const updateUser = async (id: number, data: any) => {
    // Récupère l'utilisateur existant pour éviter de passer des champs undefined
    const existing = await getUserById(id);
    if (!existing) throw new Error("User not found");
    if (Number.isNaN(id)) throw new Error("Invalid user id");

    const merged = {
        name: data.name ?? existing.name,
        email: data.email ?? existing.email,
        role: (data.role ?? existing.role)?.toLowerCase(),
        phone: data.phone ?? existing.phone,
        address: data.address ?? existing.address,
        status: (data.status ?? existing.status) || "active",
    };

    let hashed = null;
    if (data.password) hashed = await bcrypt.hash(data.password, 10);

    let res;
    if (hashed) {
        res = await query(
            `UPDATE users SET
                name=$1, email=$2, password=$3, role=$4, phone=$5, address =$6, status=$7
             WHERE id=$8 RETURNING id, name, email, role, phone, address, status, created_at`,
            [merged.name, merged.email, hashed, merged.role, merged.phone, merged.address, merged.status, id]
        );
    } else {
        res = await query(
            `UPDATE users SET
                name=$1, email=$2, role=$3, phone=$4,address =$5, status=$6
             WHERE id=$7 RETURNING id, name, email, role, phone, address, status, created_at`,
            [merged.name, merged.email, merged.role, merged.phone, merged.address, merged.status, id]
        );
    }

    const updated = res.rows[0];

    // Notifier les admins des changements importants
    // IMPORTANT: Comparer data.status (si fourni) avec existing.status AVANT la mise à jour
    try {
        // Si data.status est fourni, comparer avec existing.status
        // Sinon, pas de changement de statut
        if (data.status !== undefined && data.status !== null) {
            const oldStatus = existing.status || 'active';
            const newStatus = data.status || 'active';

            console.log('🔍 DEBUG updateUser - Vérification changement de statut:', {
                'oldStatus (existing)': oldStatus,
                'newStatus (data.status)': newStatus,
                'status changed': oldStatus !== newStatus,
                'data.status provided': true
            });

            // Vérifier si le statut a vraiment changé
            if (oldStatus !== newStatus) {
                console.log(`📢 Changement de statut détecté: "${oldStatus}" → "${newStatus}"`);
                console.log(`📤 Appel de notifyAdmins...`);

                await notifyAdmins(
                    'Changement de statut utilisateur',
                    AdminNotificationTypes.USER_STATUS_CHANGE,
                    `Le statut de l'utilisateur ${updated.name} (${updated.email}) a été changé de "${oldStatus}" à "${newStatus}".`,
                    undefined
                );

                console.log(`✅ Notification envoyée avec succès pour changement de statut`);
            } else {
                console.log(`ℹ️ Pas de changement de statut: "${oldStatus}" = "${newStatus}"`);
            }
        } else {
            console.log(`ℹ️ Pas de changement de statut: data.status n'est pas fourni`);
        }
    } catch (notifError) {
        console.error('❌ Erreur notification admin:', notifError);
        console.error('Stack trace:', (notifError as Error).stack);
        // Ne pas faire échouer la mise à jour si la notification échoue
    }

    // Si changement vers driver, insérer une ligne drivers si manquante avec tous les champs NULL
    if (updated.role === "driver") {
        try {
            await dbQuery(
                `INSERT INTO drivers (user_id, vehicle_brand, vehicle_color, vehicle_plate, license_document, id_document, vehicle_photo) 
                 VALUES ($1, NULL, NULL, NULL, NULL, NULL, NULL) 
                 ON CONFLICT (user_id) DO NOTHING`,
                [id]
            );
        } catch (err: any) {
            // Si erreur de contrainte NOT NULL, donner un message clair
            if (err.message && err.message.includes('not-null constraint')) {
                throw new Error(
                    'La base de données nécessite une migration. ' +
                    'Exécutez le script SQL: backend/sql/fix_driver_nullable.sql ' +
                    'pour rendre les champs nullable. Erreur: ' + err.message
                );
            }
            throw err;
        }
    }
    // Si changement vers parent, rien à insérer (pas de table parent dédiée)

    return updated;
};

/*  DELETE  */
export const deleteUser = async (id: number) => {
    // Récupérer les infos de l'utilisateur avant suppression
    const user = await getUserById(id);

    await query(`DELETE FROM users WHERE id=$1`, [id]);

    // Notifier les admins
    if (user) {
        try {
            await notifyAdmins(
                'Utilisateur supprimé',
                AdminNotificationTypes.USER_DELETED,
                `L'utilisateur ${user.name} (${user.email}) - ${user.role} a été supprimé.`,
                undefined
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
        }
    }

    return true;
};




// --- Génération du code ---
export const createPasswordResetCode = async (userId: number) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    ; // 15 min
    await query(
        `INSERT INTO password_resets (user_id, code, expires_at) VALUES ($1, $2, $3)`,
        [userId, code, expiresAt]
    );

    console.log("  Code inséré !");
    return code;
};

// --- Email ---

// Configuration email avec support des variables d'environnement
// ⚠️ IMPORTANT: Déplacer les credentials vers .env en production
const emailConfig = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER || "mameabydrame3@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "qnrjhdqgncwtkbhg", // ⚠️ À déplacer vers .env
    },
};

// Avertissement si on utilise encore les valeurs en dur (dev uniquement)
if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  EMAIL_PASSWORD non défini dans .env - utilisation de la valeur par défaut (déconseillé en production)');
}

const transporter = nodemailer.createTransport(emailConfig);

export const sendCodeByEmail = async (email: string, code: string) => {
    try {
        await transporter.sendMail({
            from: '"Support AngularApp" <mameabydrame3@gmail.com>',
            to: email,
            subject: "Code de réinitialisation",
            text: `Votre code de réinitialisation est : ${code}`,
        });
        console.log("Mail envoyé à", email);
    } catch (err) {
        console.error("Erreur envoi mail :", err);
    }
};


// --- SMS Twilio ---
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const sendCodeBySMS = async (phone: string, code: string) => {
    if (!twilioClient) throw new Error("Twilio n'est pas configuré !");
    await twilioClient.messages.create({
        body: `Votre code de réinitialisation est : ${code}`,
        from: "+1 314 314 8257", // ton numéro Twilio valide
        to: phone,
    });
};
