/**
 * Utilitaires pour la gestion des paiements
 * Centralise la normalisation des méthodes de paiement
 */

/**
 * Normalise le nom du provider mobile money
 * Convertit les variantes (WAVE, ORANGE_MONEY, OM, etc.) en noms standardisés
 */
export function normalizeMobileProvider(provider: string): string {
    const providerMap: Record<string, string> = {
        'WAVE': 'Wave',
        'ORANGE_MONEY': 'Orange Money',
        'ORANGE': 'Orange Money',
        'OM': 'Orange Money',
        'YAS_MONEY': 'Yas Money',
        'YAS': 'Yas Money',
        'KAY_PAY': 'Kay Pay',
        'KPAY': 'Kay Pay'
    };
    
    return providerMap[provider.toUpperCase()] || provider;
}

/**
 * Détermine la méthode de paiement à enregistrer dans la base de données
 * @param payment_method - 'card' ou 'mobile_money'
 * @param mobile_provider - Provider mobile money (Wave, Orange Money, etc.) si payment_method === 'mobile_money'
 * @returns Le nom normalisé de la méthode de paiement à enregistrer
 */
export function getPaymentMethodToStore(
    payment_method: string,
    mobile_provider?: string
): string {
    if (payment_method === 'mobile_money' && mobile_provider) {
        // Normaliser le provider mobile money
        return normalizeMobileProvider(mobile_provider);
    } else if (payment_method === 'card') {
        return 'Carte Bancaire';
    } else {
        // Fallback : retourner tel quel si c'est déjà un nom normalisé
        return payment_method;
    }
}
























