#!/bin/bash

# Script pour créer le fichier .env à partir de .env.example
# Usage: ./create-env.sh

if [ -f .env ]; then
    echo "⚠️  Le fichier .env existe déjà."
    read -p "Voulez-vous le remplacer? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Opération annulée."
        exit 1
    fi
fi

if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé à partir de .env.example"
    echo "📝 N'oubliez pas de modifier les valeurs dans .env selon votre environnement"
else
    echo "❌ Fichier .env.example introuvable"
    exit 1
fi


