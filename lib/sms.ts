import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = "+1 314 314 8257";

// Initialiser le client Twilio seulement si les credentials sont disponibles et valides
let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
    // Vérifier que accountSid est valide (doit commencer par "AC")
    if (accountSid.startsWith('AC') && !accountSid.includes('CHANGE_ME')) {
        try {
            client = twilio(accountSid, authToken);
        } catch (error) {
            console.warn("⚠️ Twilio client initialization failed:", error);
        }
    } else {
        console.warn("⚠️ Twilio accountSid invalide ou non configuré (doit commencer par 'AC')");
    }
}

/**
 * Envoie un SMS
 * @param to Numéro du destinataire (format international, ex: +221771234567)
 * @param message Contenu du SMS
 */
export async function sendSms(to: string, message: string) {
    if (!to) {
        throw new Error("Numéro de téléphone manquant");
    }

    if (!client) {
        throw new Error("Twilio n'est pas configuré. Vérifiez TWILIO_ACCOUNT_SID et TWILIO_AUTH_TOKEN.");
    }

    console.log("📨 Envoi SMS vers:", to);

    return client.messages.create({
        body: message,
        from: fromPhone,
        to
    });
}
