const fs = require('fs');
const path = require('path');

const routes = {
  'app/api/auth/register-parent/route.ts': {
    method: 'POST',
    path: '/api/auth/register-parent',
    summary: 'Inscription d\'un parent',
    description: 'Permet à un parent de s\'inscrire. Crée un compte utilisateur avec le rôle "parent". Les admins sont notifiés de la nouvelle inscription.',
    body: {
      name: { type: 'string', required: true, example: 'Jean Dupont', description: 'Nom complet du parent' },
      email: { type: 'string', format: 'email', required: true, example: 'parent@example.com', description: 'Email du parent' },
      phone: { type: 'string', required: false, example: '+221771234567', description: 'Numéro de téléphone (optionnel)' },
      password: { type: 'string', format: 'password', required: true, example: 'password123', description: 'Mot de passe (min 8 caractères)' }
    },
    responses: {
      200: { success: true, id: 'integer', name: 'string', email: 'string', phone: 'string', role: 'string' },
      400: { success: false, error: 'Erreur de validation' },
      500: { success: false, error: 'Erreur lors de l\'inscription', message: 'string' }
    }
  },
  'app/api/auth/register-driver/route.ts': {
    method: 'POST',
    path: '/api/auth/register-driver',
    summary: 'Inscription d\'un chauffeur',
    description: 'Permet à un chauffeur de s\'inscrire. Crée un compte utilisateur et un profil chauffeur. Accepte JSON ou form-data. Les documents (permis, carte d\'identité, photo véhicule) sont optionnels.',
    body: {
      first_name: { type: 'string', required: true, example: 'Amadou', description: 'Prénom du chauffeur' },
      last_name: { type: 'string', required: true, example: 'Diallo', description: 'Nom du chauffeur' },
      email: { type: 'string', format: 'email', required: true, example: 'driver@example.com' },
      phone: { type: 'string', required: false, example: '+221771234567' },
      password: { type: 'string', format: 'password', required: true, example: 'password123' },
      vehicle_brand: { type: 'string', required: false, example: 'Toyota' },
      vehicle_color: { type: 'string', required: false, example: 'Blanc' },
      vehicle_plate: { type: 'string', required: false, example: 'ABC-123' },
      capacity: { type: 'integer', required: false, example: 4 },
      license_document: { type: 'string', format: 'binary', required: false, description: 'Document de permis (form-data uniquement)' },
      id_document: { type: 'string', format: 'binary', required: false, description: 'Carte d\'identité (form-data uniquement)' },
      vehicle_photo: { type: 'string', format: 'binary', required: false, description: 'Photo du véhicule (form-data uniquement)' }
    },
    contentType: 'multipart/form-data',
    responses: {
      200: { success: true, message: 'Inscription chauffeur réussie', user: 'object', driver: 'object' },
      400: { success: false, error: 'Erreur de validation' },
      500: { success: false, error: 'Erreur lors de l\'inscription', message: 'string' }
    }
  },
  'app/api/auth/logout/route.ts': {
    method: 'POST',
    path: '/api/auth/logout',
    summary: 'Déconnexion d\'un utilisateur',
    description: 'Supprime le token côté client (cookie JWT) pour simuler la déconnexion. Le token doit être invalidé côté client.',
    responses: {
      200: { message: 'Logout successful' }
    }
  },
  'app/api/auth/route.ts': {
    method: 'GET',
    path: '/api/auth',
    summary: 'Récupérer le profil de l\'utilisateur connecté',
    description: 'Récupère les informations du profil de l\'utilisateur actuellement authentifié à partir d\'un token JWT. Le token doit être fourni dans le header Authorization sous la forme Bearer {token}.',
    security: true,
    responses: {
      200: { id: 'integer', firstName: 'string', lastName: 'string', role: 'string', status: 'string', phone: 'string', email: 'string' },
      401: { message: 'Non autorisé ou Token invalide' },
      404: { message: 'Utilisateur introuvable' }
    }
  },
  'app/api/auth/[id]/route.ts': {
    method: 'PUT',
    path: '/api/auth/{id}',
    summary: 'Mettre à jour un utilisateur',
    description: 'Met à jour les informations d\'un utilisateur. Requiert un token Bearer valide. Seuls les champs fournis seront mis à jour.',
    security: true,
    pathParams: {
      id: { type: 'integer', required: true, description: 'ID de l\'utilisateur' }
    },
    body: {
      name: { type: 'string', required: false, example: 'Jean Dupont' },
      email: { type: 'string', format: 'email', required: false, example: 'user@example.com' },
      phone: { type: 'string', required: false, example: '+221771234567' }
    },
    responses: {
      200: { id: 'integer', firstName: 'string', lastName: 'string', email: 'string', phone: 'string', role: 'string', status: 'string' },
      400: { message: 'ID utilisateur invalide' },
      401: { message: 'No token' },
      404: { message: 'Utilisateur introuvable' },
      500: { error: 'Update failed' }
    }
  }
};

function generateSwaggerDoc(routeConfig) {
  const { method, path: routePath, summary, description, body, responses, security, pathParams, contentType } = routeConfig;
  
  let doc = `/**
 * @swagger
 * ${routePath}:
 *   ${method.toLowerCase()}:
 *     summary: ${summary}
 *     description: ${description}
 *     tags: [Auth]
`;
  
  if (security) {
    doc += ` *     security:
 *       - bearerAuth: []
`;
  }
  
  if (pathParams) {
    doc += ` *     parameters:
`;
    for (const [key, value] of Object.entries(pathParams)) {
      doc += ` *       - in: path
 *         name: ${key}
 *         required: ${value.required}
 *         schema:
 *           type: ${value.type}
 *         description: ${value.description}
`;
    }
  }
  
  if (body) {
    const contentTypeStr = contentType || 'application/json';
    doc += ` *     requestBody:
 *       required: true
 *       content:
 *         ${contentTypeStr}:
`;
    
    if (contentType === 'multipart/form-data') {
      doc += ` *           schema:
 *             type: object
 *             properties:
`;
      for (const [key, value] of Object.entries(body)) {
        doc += ` *               ${key}:
`;
        if (value.format === 'binary') {
          doc += ` *                 type: string
 *                 format: binary
`;
        } else {
          doc += ` *                 type: ${value.type}
`;
        }
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
    } else {
      doc += ` *           schema:
 *             type: object
 *             required:
`;
      const required = Object.entries(body).filter(([_, v]) => v.required).map(([k]) => k);
      required.forEach(r => {
        doc += ` *               - ${r}
`;
      });
      
      doc += ` *             properties:
`;
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
    }
  }
  
  doc += ` *     responses:
`;
  
  for (const [code, response] of Object.entries(responses)) {
    if (typeof response === 'string') {
      doc += ` *       ${code}:
 *         description: ${response}
`;
    } else {
      const desc = response.description || Object.values(response)[0] || 'Success';
      doc += ` *       ${code}:
 *         description: ${desc}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
`;
      for (const [key, value] of Object.entries(response)) {
        if (key === 'description') continue;
        const type = typeof value === 'string' ? value : 'string';
        doc += ` *                 ${key}:
 *                   type: ${type}
`;
        if (key === 'error' || key === 'message') {
          const example = response[key] || 'string';
          doc += ` *                   example: "${example}"
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
    let swaggerEnd = content.indexOf(' */', swaggerStart);
    if (swaggerEnd === -1) swaggerEnd = content.indexOf('\n */', swaggerStart);
    if (swaggerEnd !== -1) {
      swaggerEnd += 3;
      // Find the next non-empty line
      let nextLine = swaggerEnd;
      while (content[nextLine] === '\n' || content[nextLine] === ' ') nextLine++;
      content = content.substring(0, swaggerStart) + generateSwaggerDoc(config) + '\n\n' + content.substring(nextLine);
    } else {
      content = generateSwaggerDoc(config) + '\n\n' + content;
    }
  } else {
    // Insert at the beginning
    content = generateSwaggerDoc(config) + '\n\n' + content;
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

console.log('Done!');













