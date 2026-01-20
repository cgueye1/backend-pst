#!/usr/bin/env node

/**
 * Script pour modifier le serveur Next.js standalone généré
 * pour qu'il écoute sur 0.0.0.0 au lieu de localhost
 */

const fs = require('fs');
const path = require('path');

// Chercher le serveur dans différents emplacements possibles
const possiblePaths = [
    // Dans Docker, après COPY, server.js est à la racine
    path.join(process.cwd(), 'server.js'),
    path.join(__dirname, 'server.js'),
    // Build local
    path.join(process.cwd(), '.next', 'standalone', 'server.js'),
    path.join(__dirname, '.next', 'standalone', 'server.js'),
    // Autres emplacements possibles
    '/app/server.js',
    '/app/.next/standalone/server.js',
];

let serverPath = null;
for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
        serverPath = possiblePath;
        break;
    }
}

if (!serverPath) {
    console.error('❌ Server file not found in any of these locations:');
    possiblePaths.forEach(p => console.error('   -', p));
    console.log('⚠️  Make sure to run "npm run build" first');
    process.exit(1);
}

console.log('📝 Found server file at:', serverPath);

let serverContent = fs.readFileSync(serverPath, 'utf8');
const originalContent = serverContent;

// Afficher un extrait du fichier pour debug
console.log('📄 Searching for listen patterns...');
const listenMatches = serverContent.match(/\.listen\([^)]*\)/g);
if (listenMatches) {
    console.log('Found listen() calls:');
    listenMatches.forEach(match => console.log('   ', match));
}

// Remplacer localhost par 0.0.0.0 - patterns dans l'ordre de spécificité
let modified = false;
let changeCount = 0;

// Pattern 1: server.listen(port, 'localhost', ...)
if (serverContent.includes("server.listen") && serverContent.includes("'localhost'")) {
    serverContent = serverContent.replace(/server\.listen\(([^,]+),\s*['"]localhost['"]/g, "server.listen($1, '0.0.0.0'");
    modified = true;
    changeCount++;
    console.log('✅ Replaced server.listen(port, "localhost")');
}

// Pattern 2: server.listen(port) - le plus commun dans Next.js standalone
// Chercher toutes les occurrences de server.listen(port) sans hostname
const serverListenPattern = /server\.listen\((\d+)\)/g;
if (serverListenPattern.test(serverContent)) {
    serverContent = serverContent.replace(serverListenPattern, "server.listen($1, '0.0.0.0')");
    modified = true;
    changeCount++;
    console.log('✅ Replaced server.listen(port)');
}

// Pattern 3: server.listen(port, callback) - avec fonction callback
const serverListenCallbackPattern = /server\.listen\((\d+),\s*\(\)\s*=>/g;
if (serverListenCallbackPattern.test(serverContent)) {
    serverContent = serverContent.replace(serverListenCallbackPattern, "server.listen($1, '0.0.0.0', () =>");
    modified = true;
    changeCount++;
    console.log('✅ Replaced server.listen(port, callback)');
}

// Pattern 4: app.listen(port, 'localhost', ...)
if (serverContent.includes("app.listen") && serverContent.includes("'localhost'")) {
    serverContent = serverContent.replace(/app\.listen\(([^,]+),\s*['"]localhost['"]/g, "app.listen($1, '0.0.0.0'");
    modified = true;
    changeCount++;
    console.log('✅ Replaced app.listen(port, "localhost")');
}

// Pattern 5: app.listen(port)
const appListenPattern = /app\.listen\((\d+)\)/g;
if (appListenPattern.test(serverContent)) {
    serverContent = serverContent.replace(appListenPattern, "app.listen($1, '0.0.0.0')");
    modified = true;
    changeCount++;
    console.log('✅ Replaced app.listen(port)');
}

// Pattern 6: .listen(port, 'localhost') - pattern générique
if (serverContent.includes(".listen") && serverContent.includes("'localhost'")) {
    serverContent = serverContent.replace(/\.listen\(([^,]+),\s*['"]localhost['"]/g, ".listen($1, '0.0.0.0'");
    modified = true;
    changeCount++;
    console.log('✅ Replaced .listen(port, "localhost")');
}

// Pattern 7: hostname variables
if (serverContent.includes("hostname") && serverContent.includes("'localhost'")) {
    serverContent = serverContent.replace(/hostname\s*=\s*['"]localhost['"]/g, "hostname = '0.0.0.0'");
    serverContent = serverContent.replace(/const\s+hostname\s*=\s*['"]localhost['"]/g, "const hostname = '0.0.0.0'");
    serverContent = serverContent.replace(/let\s+hostname\s*=\s*['"]localhost['"]/g, "let hostname = '0.0.0.0'");
    serverContent = serverContent.replace(/var\s+hostname\s*=\s*['"]localhost['"]/g, "var hostname = '0.0.0.0'");
    if (serverContent !== originalContent) {
        modified = true;
        changeCount++;
        console.log('✅ Replaced hostname variables');
    }
}

// Pattern 8: .listen(port) - pattern générique (en dernier pour éviter les doublons)
// Mais seulement si aucun hostname n'est déjà spécifié
const genericListenPattern = /([a-zA-Z_$][a-zA-Z0-9_$]*\.listen)\((\d+)\)(?!\s*,\s*['"]0\.0\.0\.0['"])/g;
if (genericListenPattern.test(serverContent) && !serverContent.includes("'0.0.0.0'")) {
    serverContent = serverContent.replace(genericListenPattern, "$1($2, '0.0.0.0')");
    modified = true;
    changeCount++;
    console.log('✅ Replaced generic .listen(port)');
}

if (modified) {
    fs.writeFileSync(serverPath, serverContent, 'utf8');
    console.log(`\n✅ Server file modified to listen on 0.0.0.0 (${changeCount} pattern(s) matched)`);

    // Vérifier que la modification a bien été appliquée
    const verifyContent = fs.readFileSync(serverPath, 'utf8');
    if (verifyContent.includes("0.0.0.0")) {
        console.log('✅ Verification: 0.0.0.0 found in server.js');

        // Afficher les lignes contenant 0.0.0.0
        const lines = verifyContent.split('\n');
        const modifiedLines = lines.filter(line => line.includes('0.0.0.0') && line.includes('listen'));
        if (modifiedLines.length > 0) {
            console.log('📝 Modified lines with listen:');
            modifiedLines.slice(0, 3).forEach(line => console.log('   ', line.trim()));
        }
    } else {
        console.log('⚠️  Warning: 0.0.0.0 not found after modification');
    }
} else {
    console.log('\nℹ️  No changes needed');
    console.log('🔍 Checking if server already uses 0.0.0.0...');
    if (serverContent.includes("0.0.0.0")) {
        console.log('✅ Server already configured to use 0.0.0.0');
    } else {
        console.log('⚠️  Server does not use 0.0.0.0 and no patterns matched');
        console.log('📄 Sample of server.js around listen calls:');
        const lines = serverContent.split('\n');
        lines.forEach((line, idx) => {
            if (line.includes('listen')) {
                console.log(`   Line ${idx + 1}:`, line.trim());
            }
        });
    }
}
