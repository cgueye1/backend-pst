/**
 * Script Node.js pour tester la connexion au serveur API
 * Utilisation: node test-server-connection.js
 */

const http = require('http');
const https = require('https');

const SERVER_URL = 'http://86.106.181.31:3000';

function testConnection(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname,
            method: 'GET',
            timeout: 5000,
            headers: {
                'User-Agent': 'Node.js Test Script'
            }
        };

        console.log(`\n🔍 Test de connexion à: ${url}`);
        console.log(`   Hostname: ${options.hostname}`);
        console.log(`   Port: ${options.port}`);
        console.log(`   Path: ${options.path}`);

        const req = protocol.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`\n✅ Connexion réussie!`);
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Headers:`, res.headers);
                console.log(`   Réponse:`, data.substring(0, 200));
                resolve({ status: res.statusCode, data, headers: res.headers });
            });
        });

        req.on('error', (error) => {
            console.log(`\n❌ Erreur de connexion:`);
            console.log(`   Type: ${error.code || error.name}`);
            console.log(`   Message: ${error.message}`);
            
            if (error.code === 'ECONNREFUSED') {
                console.log(`\n💡 Le serveur refuse la connexion. Vérifiez que:`);
                console.log(`   1. Le serveur Next.js est démarré`);
                console.log(`   2. Le serveur écoute sur le port ${options.port}`);
                console.log(`   3. Le firewall autorise les connexions sur ce port`);
            } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
                console.log(`\n💡 Problème réseau. Vérifiez que:`);
                console.log(`   1. L'adresse IP est correcte: ${options.hostname}`);
                console.log(`   2. Vous êtes sur le même réseau ou avez accès au serveur`);
                console.log(`   3. Le serveur est accessible depuis votre machine`);
            }
            
            reject(error);
        });

        req.on('timeout', () => {
            console.log(`\n⏱️  Timeout: Le serveur ne répond pas dans les 5 secondes`);
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function runTests() {
    console.log('🚀 Tests de connexion au serveur API');
    console.log('=' .repeat(50));

    const endpoints = [
        '/api/test',
        '/api/auth/login/driver'
    ];

    for (const endpoint of endpoints) {
        try {
            await testConnection(SERVER_URL + endpoint);
        } catch (error) {
            // Erreur déjà affichée dans testConnection
        }
        console.log('\n' + '-'.repeat(50));
    }

    console.log('\n📝 Résumé:');
    console.log('Si toutes les connexions échouent:');
    console.log('1. Vérifiez que le serveur Next.js est démarré');
    console.log('2. Vérifiez que le serveur écoute sur 0.0.0.0:3000 (pas seulement localhost)');
    console.log('3. Vérifiez les règles de firewall');
    console.log('4. Testez depuis le serveur lui-même: curl http://localhost:3000/api/test');
}

// Lancer les tests
runTests().catch(console.error);

