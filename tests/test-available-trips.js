/**
 * Script de test pour diagnostiquer le problème avec /api/parents/trips/available
 * 
 * Usage: node tests/test-available-trips.js
 */

const http = require('http');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const PARENT_EMAIL = process.env.PARENT_EMAIL || 'parent@example.com';
const PARENT_PASSWORD = process.env.PARENT_PASSWORD || 'password123';

// Couleurs pour la console
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour faire une requête HTTP
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: parsed
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: body
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testLogin() {
    log('\n🔐 Test 1: Connexion du parent...', 'cyan');
    
    try {
        const response = await makeRequest({
            hostname: new URL(BASE_URL).hostname,
            port: new URL(BASE_URL).port || 3000,
            path: '/api/auth/login/parent',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            email: PARENT_EMAIL,
            password: PARENT_PASSWORD
        });

        if (response.status === 200 && response.data.token) {
            log(`✅ Connexion réussie! Token: ${response.data.token.substring(0, 20)}...`, 'green');
            return response.data.token;
        } else {
            log(`❌ Échec de la connexion: ${JSON.stringify(response.data)}`, 'red');
            return null;
        }
    } catch (error) {
        log(`❌ Erreur lors de la connexion: ${error.message}`, 'red');
        return null;
    }
}

async function testAvailableTrips(token) {
    log('\n🔍 Test 2: Récupération des trajets disponibles (sans filtre de proximité)...', 'cyan');
    
    try {
        const url = new URL(`${BASE_URL}/api/parents/trips/available`);
        url.searchParams.set('disable_proximity', 'true');
        
        const response = await makeRequest({
            hostname: url.hostname,
            port: url.port || 3000,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        log(`📊 Statut: ${response.status}`, response.status === 200 ? 'green' : 'red');
        
        if (response.status === 200) {
            log(`✅ ${response.data.data?.length || 0} trajet(s) trouvé(s)`, 'green');
            
            if (response.data.data && response.data.data.length > 0) {
                log('\n📋 Détails des trajets:', 'yellow');
                response.data.data.forEach((trip, index) => {
                    log(`\n  Trajet ${index + 1}:`, 'bright');
                    log(`    ID: ${trip.id}`, 'blue');
                    log(`    École ID: ${trip.school_id}`, 'blue');
                    log(`    Type: ${trip.trip_type}`, 'blue');
                    log(`    Départ: ${trip.departure_time}`, 'blue');
                    log(`    Point de départ: ${trip.start_point}`, 'blue');
                    log(`    Point d'arrivée: ${trip.end_point}`, 'blue');
                    log(`    Places disponibles: ${trip.available_seats}`, 'blue');
                });
            } else {
                log('⚠️  Aucun trajet trouvé. Vérifiez les logs du serveur pour comprendre pourquoi.', 'yellow');
            }
            
            return response.data;
        } else {
            log(`❌ Erreur: ${JSON.stringify(response.data)}`, 'red');
            return null;
        }
    } catch (error) {
        log(`❌ Erreur lors de la récupération: ${error.message}`, 'red');
        return null;
    }
}

async function testWithProximity(token) {
    log('\n🔍 Test 3: Récupération des trajets disponibles (avec filtre de proximité)...', 'cyan');
    
    try {
        const response = await makeRequest({
            hostname: new URL(BASE_URL).hostname,
            port: new URL(BASE_URL).port || 3000,
            path: '/api/parents/trips/available',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        log(`📊 Statut: ${response.status}`, response.status === 200 ? 'green' : 'red');
        
        if (response.status === 200) {
            log(`✅ ${response.data.data?.length || 0} trajet(s) trouvé(s)`, 'green');
            return response.data;
        } else {
            log(`❌ Erreur: ${JSON.stringify(response.data)}`, 'red');
            return null;
        }
    } catch (error) {
        log(`❌ Erreur lors de la récupération: ${error.message}`, 'red');
        return null;
    }
}

async function main() {
    log('🚀 Test de l\'endpoint /api/parents/trips/available', 'bright');
    log('='.repeat(60), 'cyan');
    
    // Test 1: Connexion
    const token = await testLogin();
    if (!token) {
        log('\n❌ Impossible de continuer sans token d\'authentification', 'red');
        process.exit(1);
    }
    
    // Test 2: Sans filtre de proximité
    const resultWithoutProximity = await testAvailableTrips(token);
    
    // Test 3: Avec filtre de proximité
    const resultWithProximity = await testWithProximity(token);
    
    // Résumé
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 RÉSUMÉ:', 'bright');
    log(`   Sans filtre de proximité: ${resultWithoutProximity?.data?.length || 0} trajet(s)`, 
        resultWithoutProximity?.data?.length > 0 ? 'green' : 'yellow');
    log(`   Avec filtre de proximité: ${resultWithProximity?.data?.length || 0} trajet(s)`, 
        resultWithProximity?.data?.length > 0 ? 'green' : 'yellow');
    
    if (resultWithoutProximity?.data?.length === 0 && resultWithProximity?.data?.length === 0) {
        log('\n⚠️  Aucun trajet trouvé dans les deux cas.', 'yellow');
        log('   Vérifiez les logs du serveur pour voir les détails de débogage.', 'yellow');
        log('   Les logs devraient montrer:', 'yellow');
        log('   - Les enfants trouvés pour le parent', 'yellow');
        log('   - Les trajets trouvés avant filtrage emploi du temps', 'yellow');
        log('   - Les raisons de rejet de chaque trajet', 'yellow');
    }
    
    log('\n✅ Tests terminés!', 'green');
}

// Lancer les tests
main().catch((error) => {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});








