const fs = require('fs');
const path = require('path');

const routes = {
  'app/api/auth/forgot-password/route.ts': {
    method: 'POST',
    path: '/api/auth/forgot-password',
    summary: 'Demande de réinitialisation de mot de passe',
    description: 'Envoie un code OTP à l\'utilisateur pour réinitialiser son mot de passe. Le code peut être envoyé par email ou par SMS selon le contact fourni.',
    body: {
      contact: { type: 'string', required: true, example: 'user@example.com', description: 'Email ou numéro de téléphone' }
    },
    responses: {
      200: { message: 'Code de réinitialisation envoyé', user: 'object' },
      404: { error: 'Utilisateur introuvable' },
      500: { error: 'string' }
    }
  },
  'app/api/auth/reset-password/route.ts': {
    method: 'POST',
    path: '/api/auth/reset-password',
    summary: 'Réinitialisation du mot de passe avec code OTP',
    description: 'Vérifie le code OTP fourni et met à jour le mot de passe de l\'utilisateur si le code est valide et non expiré.',
    body: {
      userId: { type: 'integer', required: true, example: 1 },
      code: { type: 'string', required: true, example: '1234' },
      newPassword: { type: 'string', required: true, example: 'NouveauMotDePasse123!' }
    },
    responses: {
      200: { message: 'Mot de passe réinitialisé avec succès' },
      400: { error: 'Paramètres manquants ou code invalide' },
      500: { error: 'string' }
    }
  },
  'app/api/auth/verify-otp/route.ts': {
    method: 'POST',
    path: '/api/auth/verify-otp',
    summary: 'Vérifie le code OTP',
    description: 'Vérifie si le code OTP saisi correspond à celui généré pour réinitialiser le mot de passe.',
    body: {
      userId: { type: 'integer', required: true, example: 1 },
      code: { type: 'string', required: true, example: '1234' }
    },
    responses: {
      200: { message: 'Code OTP vérifié', user: 'object', code: 'string' },
      400: { error: 'Code OTP invalide ou expiré' },
      500: { error: 'string' }
    }
  },
  'app/api/auth/login/route.ts': {
    method: 'POST',
    path: '/api/auth/login',
    summary: 'Connexion d\'un administrateur',
    description: 'Permet à un administrateur de se connecter et de recevoir un token JWT. Réservé aux utilisateurs avec le rôle "admin".',
    body: {
      email: { type: 'string', format: 'email', required: true, example: 'admin@example.com' },
      password: { type: 'string', format: 'password', required: true, example: 'password123' }
    },
    responses: {
      200: { token: 'string', user: 'object' },
      400: { error: 'Email et mot de passe requis' },
      401: { error: 'Invalid credentials' },
      403: { error: 'Accès réservé aux administrateurs' },
      404: { error: 'User not found' },
      500: { error: 'Erreur serveur lors de la connexion' }
    }
  },
  'app/api/auth/login/parent/route.ts': {
    method: 'POST',
    path: '/api/auth/login/parent',
    summary: 'Connexion d\'un parent',
    description: 'Permet à un parent de se connecter et de recevoir un token JWT. Réservé aux utilisateurs avec le rôle "parent".',
    body: {
      email: { type: 'string', format: 'email', required: true, example: 'parent@example.com' },
      password: { type: 'string', format: 'password', required: true, example: 'password123' }
    },
    responses: {
      200: { token: 'string', user: 'object' },
      400: { error: 'Email et mot de passe requis' },
      401: { error: 'Invalid credentials' },
      403: { error: 'Accès réservé aux parents ou compte inactif' },
      404: { error: 'User not found' },
      500: { error: 'Erreur serveur lors de la connexion' }
    }
  },
  'app/api/auth/login/driver/route.ts': {
    method: 'POST',
    path: '/api/auth/login/driver',
    summary: 'Connexion d\'un chauffeur',
    description: 'Permet à un chauffeur de se connecter et de recevoir un token JWT. Réservé aux utilisateurs avec le rôle "driver".',
    body: {
      email: { type: 'string', format: 'email', required: true, example: 'driver@example.com' },
      password: { type: 'string', format: 'password', required: true, example: 'password123' }
    },
    responses: {
      200: { token: 'string', user: 'object' },
      400: { error: 'Email et mot de passe requis' },
      401: { error: 'Invalid credentials' },
      403: { error: 'Accès réservé aux chauffeurs ou compte inactif' },
      404: { error: 'User not found' },
      500: { error: 'Erreur serveur lors de la connexion' }
    }
  }
};

function generateSwaggerDoc(routeConfig) {
  const { method, path, summary, description, body, responses } = routeConfig;
  
  let doc = `/**
 * @swagger
 * ${path}:
 *   ${method.toLowerCase()}:
 *     summary: ${summary}
 *     description: ${description}
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
`;
  
  // Required fields
  const required = Object.entries(body).filter(([_, v]) => v.required).map(([k]) => `- ${k}`);
  doc += required.map(r => ` *               ${r}`).join('\n') + '\n';
  
  doc += ` *             properties:
`;
  
  // Properties
  for (const [key, value] of Object.entries(body)) {
    doc += ` *               ${key}:
 *                 type: ${value.type}
`;
    if (value.format) doc += ` *                 format: ${value.format}
`;
    if (value.description) doc += ` *                 description: ${value.description}
`;
    if (value.example !== undefined) {
      if (typeof value.example === 'string') {
        doc += ` *                 example: "${value.example}"
`;
      } else {
        doc += ` *                 example: ${value.example}
`;
      }
    }
  }
  
  doc += ` *     responses:
`;
  
  // Responses
  for (const [code, response] of Object.entries(responses)) {
    doc += ` *       ${code}:
 *         description: ${typeof response === 'string' ? response : Object.values(response)[0]}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
`;
    if (typeof response === 'object') {
      for (const [key, value] of Object.entries(response)) {
        const type = typeof value === 'string' ? value : 'string';
        doc += ` *                 ${key}:
 *                   type: ${type}
`;
        if (key === 'error' && typeof response === 'object') {
          doc += ` *                   example: "${value}"
`;
        }
      }
    }
  }
  
  doc += ` */`;
  
  return doc;
}

// Process each route
for (const [filePath, config] of Object.entries(routes)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - not found`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove old swagger doc
  const swaggerStart = content.indexOf('/**\n * @swagger');
  if (swaggerStart !== -1) {
    const swaggerEnd = content.indexOf(' */', swaggerStart) + 3;
    content = content.substring(0, swaggerStart) + generateSwaggerDoc(config) + '\n\n' + content.substring(swaggerEnd + 1);
  } else {
    // Insert at the beginning
    content = generateSwaggerDoc(config) + '\n\n' + content;
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

console.log('Done!');













