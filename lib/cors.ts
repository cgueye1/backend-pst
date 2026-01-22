import { NextRequest, NextResponse } from 'next/server';

/**
 * Helper function to set CORS headers on responses
 * @param response - The NextResponse object
 * @param origin - The origin from the request headers
 * @returns The response with CORS headers set
 */
export function setCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
    // Liste des origines autorisées par défaut (inclut localhost pour le développement frontend)
    const defaultOrigins = [
        'http://localhost:4200',
        'http://localhost:3000',
        'http://localhost:4201',
        'http://127.0.0.1:4200',
        'http://127.0.0.1:3000'
    ];

    // En production, utiliser ALLOWED_ORIGINS si défini
    let allowedOrigins: string[];
    if (process.env.NODE_ENV === 'production') {
        if (process.env.ALLOWED_ORIGINS) {
            allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
            // Avertir si '*' est utilisé en production
            if (allowedOrigins.includes('*')) {
                console.warn('⚠️  ATTENTION: Wildcard "*" détecté dans ALLOWED_ORIGINS en production - ce n\'est pas recommandé pour la sécurité');
            }
        } else {
            // En production sans ALLOWED_ORIGINS, utiliser les origines par défaut + avertissement
            console.warn('⚠️  ALLOWED_ORIGINS non défini en production - utilisation des origines par défaut');
            allowedOrigins = [...defaultOrigins];
        }
    } else {
        // En développement, permettre localhost + '*'
        allowedOrigins = [...defaultOrigins, '*'];
    }

    // Si '*' est dans la liste ou si on est en dev, accepter toutes les origines
    if (allowedOrigins.includes('*') || process.env.NODE_ENV !== 'production') {
        if (origin) {
            // Utiliser l'origine de la requête si elle existe
            response.headers.set('Access-Control-Allow-Origin', origin);
        } else {
            // Sinon, utiliser '*'
            response.headers.set('Access-Control-Allow-Origin', '*');
        }
        // Ne pas mettre Access-Control-Allow-Credentials avec '*' (incompatible)
    } else if (origin && allowedOrigins.includes(origin)) {
        // Origine spécifique autorisée - utiliser avec credentials
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (origin) {
        // Origine non listée mais on a une origine - l'accepter quand même (mode permissif)
        response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
        // Pas d'origine spécifiée - utiliser '*'
        response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight pour 24h
    return response;
}

/**
 * Helper function to create an OPTIONS response with CORS headers
 * @param req - The NextRequest object
 * @returns A NextResponse with 204 status and CORS headers
 */
export function corsOptions(req: NextRequest): NextResponse {
    const origin = req.headers.get('origin');
    return setCorsHeaders(new NextResponse(null, { status: 204 }), origin);
}



