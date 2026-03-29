/**
 * Service SMS LAM (LaFrica Mobile)
 * Configuration et fonction d'envoi de SMS via l'API LAM
 */

interface LamSmsConfig {
    url: string;
    accountId: string;
    password: string;
    sender: string;
}

// Configuration depuis les variables d'environnement
const lamSmsConfig: LamSmsConfig = {
    url: process.env.LAM_SMS_URL || "https://lamsms.lafricamobile.com/api",
    accountId: process.env.LAM_SMS_ACCOUNT_ID || "INNOV_&_IMPACT_&_AFRICA_01",
    password: process.env.LAM_SMS_PASSWORD || "XhEAvqmsAO1BksR",
    sender: process.env.LAM_SMS_SENDER || "Seddo",
};

/**
 * Envoie un SMS via l'API LAM
 * @param phoneNumber Numéro du destinataire (format international, ex: +221771234567)
 * @param message Contenu du SMS
 * @returns Promise avec la réponse de l'API
 */
export async function sendLamSms(phoneNumber: string, message: string): Promise<void> {
    if (!phoneNumber) {
        throw new Error("Numéro de téléphone manquant");
    }

    if (!message) {
        throw new Error("Message SMS manquant");
    }

    // Vérifier que la configuration est complète
    if (!lamSmsConfig.accountId || !lamSmsConfig.password || !lamSmsConfig.sender) {
        throw new Error("Configuration LAM SMS incomplète. Vérifiez les variables d'environnement.");
    }

    const requestBody = {
        accountid: lamSmsConfig.accountId,
        password: lamSmsConfig.password,
        sender: lamSmsConfig.sender,
        text: message,
        to: phoneNumber,
    };

    try {
        console.log("📤 Envoi SMS LAM vers:", phoneNumber);
        console.log("📤 URL LAM SMS:", lamSmsConfig.url);
        console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));

        // Créer un AbortController pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes timeout

        try {
            const response = await fetch(lamSmsConfig.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log("📤 Response status:", response.status);
            console.log("📤 Response headers:", Object.fromEntries(response.headers.entries()));

            const responseData = await response.text();
            console.log("📤 Response data:", responseData);

            if (!response.ok) {
                throw new Error(`Erreur API LAM SMS: ${response.status} - ${responseData}`);
            }

            console.log("✅ SMS LAM envoyé avec succès:", responseData);
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error("Timeout lors de l'appel à l'API LAM SMS (30s)");
            }
            throw fetchError;
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue lors de l'envoi du SMS";
        console.error("❌ Erreur lors de l'envoi du SMS LAM:", errorMessage);
        if (error instanceof Error && error.stack) {
            console.error("Stack trace:", error.stack);
        }
        throw new Error(`Échec de l'envoi du SMS: ${errorMessage}`);
    }
}

/**
 * Envoie un code OTP par SMS via LAM
 * @param phoneNumber Numéro du destinataire
 * @param code Code OTP à envoyer
 */
export async function sendOtpByLamSms(phoneNumber: string, code: string): Promise<void> {
    const message = `Votre code de réinitialisation est : ${code}`;
    await sendLamSms(phoneNumber, message);
}

