const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Routes à documenter avec leurs configurations
const routeConfigs = {
  // Calendar
  'app/api/calendar/route.ts': {
    GET: {
      summary: 'Récupérer les événements du calendrier',
      description: 'Retourne les vacances scolaires (si schoolId est fourni) ou les jours fériés pour un mois et une année donnés.',
      tags: ['ADMIN'],
      queryParams: {
        schoolId: { type: 'integer', required: false, description: 'ID de l\'école pour les vacances scolaires' },
        month: { type: 'integer', required: false, description: 'Mois (1-12)' },
        year: { type: 'integer', required: false, description: 'Année (ex: 2024)' }
      }
    },
    POST: {
      summary: 'Créer un événement',
      description: 'Crée un événement de type vacances scolaires (HOLIDAY) ou jour férié (FERIE).',
      tags: ['ADMIN'],
      body: {
        type: { type: 'string', required: true, enum: ['HOLIDAY', 'FERIE'], example: 'HOLIDAY' },
        school_id: { type: 'integer', required: false, description: 'ID de l\'école (requis pour HOLIDAY)' },
        start_date: { type: 'string', format: 'date', required: true, example: '2024-12-20' },
        end_date: { type: 'string', format: 'date', required: true, example: '2024-12-31' },
        name: { type: 'string', required: true, example: 'Vacances de Noël' }
      }
    }
  },
  'app/api/calendar/[id]/route.ts': {
    DELETE: {
      summary: 'Supprimer un événement',
      description: 'Supprime un événement existant selon son type.',
      tags: ['ADMIN'],
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'événement' }
      },
      queryParams: {
        type: { type: 'string', required: true, enum: ['HOLIDAY', 'FERIE'], description: 'Type d\'événement' }
      }
    }
  },
  // Conversations
  'app/api/conversations/route.ts': {
    GET: {
      summary: 'Récupérer toutes les conversations de l\'utilisateur connecté',
      description: 'Récupère la liste des conversations (directes et de groupe) de l\'utilisateur authentifié.',
      tags: ['Messagerie'],
      security: true,
      queryParams: {
        archived: { type: 'boolean', required: false, description: 'Filtrer les conversations archivées' }
      }
    },
    POST: {
      summary: 'Créer une conversation directe',
      description: 'Crée une nouvelle conversation directe entre deux utilisateurs.',
      tags: ['Messagerie'],
      security: true,
      body: {
        other_user_id: { type: 'integer', required: true, description: 'ID de l\'autre utilisateur' },
        initial_message: { type: 'string', required: false, description: 'Message initial (optionnel)' }
      }
    }
  },
  'app/api/conversations/[id]/messages/route.ts': {
    GET: {
      summary: 'Récupérer les messages d\'une conversation',
      description: 'Récupère les messages d\'une conversation avec pagination.',
      tags: ['Messagerie'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la conversation' }
      },
      queryParams: {
        limit: { type: 'integer', required: false, default: 50, description: 'Nombre de messages à récupérer' },
        offset: { type: 'integer', required: false, default: 0, description: 'Offset pour la pagination' },
        before_message_id: { type: 'integer', required: false, description: 'Récupérer les messages avant cet ID' }
      }
    },
    POST: {
      summary: 'Envoyer un message dans une conversation',
      description: 'Envoie un nouveau message dans une conversation.',
      tags: ['Messagerie'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la conversation' }
      },
      body: {
        content: { type: 'string', required: true, example: 'Bonjour !' },
        message_type: { type: 'string', required: false, enum: ['text', 'image', 'file'], default: 'text' },
        parent_message_id: { type: 'integer', required: false, description: 'ID du message parent (pour les réponses)' },
        attachments: { type: 'array', required: false, description: 'Pièces jointes' }
      }
    }
  },
  'app/api/conversations/[id]/archive/route.ts': {
    PATCH: {
      summary: 'Archiver ou désarchiver une conversation',
      description: 'Change le statut d\'archivage d\'une conversation.',
      tags: ['Messagerie'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la conversation' }
      },
      body: {
        archived: { type: 'boolean', required: false, default: true, description: 'true pour archiver, false pour désarchiver' }
      }
    }
  },
  'app/api/conversations/[id]/messages/[messageId]/route.ts': {
    PATCH: {
      summary: 'Modifier un message',
      description: 'Modifie le contenu d\'un message. Seul l\'auteur peut modifier son message.',
      tags: ['Messagerie'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la conversation' },
        messageId: { type: 'integer', required: true, description: 'ID du message' }
      },
      body: {
        content: { type: 'string', required: true, example: 'Message modifié' }
      }
    },
    DELETE: {
      summary: 'Supprimer un message',
      description: 'Supprime un message. Seul l\'auteur peut supprimer son message.',
      tags: ['Messagerie'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la conversation' },
        messageId: { type: 'integer', required: true, description: 'ID du message' }
      }
    }
  },
  // Dashboard
  'app/api/dashboard/route.ts': {
    GET: {
      summary: 'Récupérer les statistiques du tableau de bord',
      description: 'Récupère toutes les statistiques pour le tableau de bord administrateur (nombre d\'utilisateurs, trajets, revenus, etc.).',
      tags: ['ADMIN'],
      security: true
    }
  }
};

function generateSwaggerDoc(filePath, methods) {
  const routePath = filePath
    .replace('app/api/', '/api/')
    .replace('/route.ts', '')
    .replace(/\[([^\]]+)\]/g, '{$1}');
  
  let doc = `/**
 * @swagger
 * ${routePath}:
`;
  
  for (const [method, config] of Object.entries(methods)) {
    doc += ` *   ${method.toLowerCase()}:
 *     summary: ${config.summary}
 *     description: ${config.description}
 *     tags: ${JSON.stringify(config.tags)}
`;
    
    if (config.security) {
      doc += ` *     security:
 *       - bearerAuth: []
`;
    }
    
    if (config.pathParams) {
      doc += ` *     parameters:
`;
      for (const [key, value] of Object.entries(config.pathParams)) {
        doc += ` *       - in: path
 *         name: ${key}
 *         required: ${value.required}
 *         schema:
 *           type: ${value.type}
 *         description: ${value.description}
`;
      }
    }
    
    if (config.queryParams) {
      if (!config.pathParams) {
        doc += ` *     parameters:
`;
      }
      for (const [key, value] of Object.entries(config.queryParams)) {
        doc += ` *       - in: query
 *         name: ${key}
 *         required: ${value.required || false}
 *         schema:
 *           type: ${value.type}
`;
        if (value.enum) {
          doc += ` *           enum: ${JSON.stringify(value.enum)}
`;
        }
        if (value.default !== undefined) {
          doc += ` *           default: ${value.default}
`;
        }
        doc += ` *         description: ${value.description}
`;
      }
    }
    
    if (config.body) {
      doc += ` *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
`;
      const required = Object.entries(config.body).filter(([_, v]) => v.required).map(([k]) => k);
      required.forEach(r => {
        doc += ` *               - ${r}
`;
      });
      
      doc += ` *             properties:
`;
      for (const [key, value] of Object.entries(config.body)) {
        doc += ` *               ${key}:
 *                 type: ${value.type}
`;
        if (value.format) doc += ` *                 format: ${value.format}
`;
        if (value.enum) doc += ` *                 enum: ${JSON.stringify(value.enum)}
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
        if (value.default !== undefined) {
          doc += ` *                 default: ${value.default}
`;
        }
      }
    }
    
    doc += ` *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
`;
  }
  
  doc += ` */`;
  
  return doc;
}

// Process each route
for (const [filePath, methods] of Object.entries(routeConfigs)) {
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
      while (nextLine < content.length && (content[nextLine] === '\n' || content[nextLine] === ' ' || content[nextLine] === '*')) {
        if (content[nextLine] === '\n') nextLine++;
        else break;
      }
      content = content.substring(0, swaggerStart) + generateSwaggerDoc(filePath, methods) + '\n\n' + content.substring(nextLine);
    } else {
      content = generateSwaggerDoc(filePath, methods) + '\n\n' + content;
    }
  } else {
    // Insert at the beginning
    content = generateSwaggerDoc(filePath, methods) + '\n\n' + content;
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

console.log('Done!');













