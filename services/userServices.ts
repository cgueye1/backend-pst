import { query } from "../lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import crypto from "crypto";
import { query as dbQuery } from "../lib/db";
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

    // Si le rôle est driver, créer l'entrée associée
    if (role === "driver") {
        await dbQuery(`INSERT INTO drivers (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [res.rows[0].id]);
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

    // Si changement vers driver, insérer une ligne drivers si manquante
    if (updated.role === "driver") {
        await dbQuery(`INSERT INTO drivers (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [id]);
    }
    // Si changement vers parent, rien à insérer (pas de table parent dédiée)

    return updated;
};

/*  DELETE  */
export const deleteUser = async (id: number) => {
    await query(`DELETE FROM users WHERE id=$1`, [id]);
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

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 587 pour TLS, 465 pour SSL
    secure: false, // true si port 465
    auth: {
        user: "mameabydrame3@gmail.com",
        pass: "qnrjhdqgncwtkbhg", // ton mot de passe d'application
    },
});

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
