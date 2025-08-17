# FASOSMART-CCIAG - Système de Gestion des Cartes d'Identité

## Description
FASOSMART-CCIAG est une application web sécurisée de gestion des cartes d'identité, développée avec Next.js 14, TypeScript et Tailwind CSS. Elle permet la gestion des utilisateurs, l'enrôlement des commerçants, la validation des dossiers et l'impression des cartes d'identité.

## Fonctionnalités Principales

### Authentification et Autorisation
- Système de connexion sécurisé avec JWT
- Gestion des rôles utilisateurs (Admin, Opération, Validation, Impression)
- Protection des routes basée sur les rôles
- Refresh token automatique

### Modules
1. **Gestion des Utilisateurs**
   - Création et gestion des comptes utilisateurs
   - Attribution des rôles et permissions

2. **Enrôlement**
   - Enregistrement des commerçants
   - Collecte et validation des informations

3. **Validation des Dossiers**
   - Revue et validation des dossiers soumis
   - Suivi du statut des demandes

4. **Impression des Cartes**
   - Génération des cartes d'identité
   - Historique des impressions

## Technologies Utilisées

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Shadcn UI (composants)
- React Hook Form
- Axios

### Sécurité
- JWT (JSON Web Tokens)
- Middleware de protection des routes
- Gestion des sessions

## Installation

1. Cloner le repository

```
git clone [url du repository]
```

2. Installer les dépendances

```
npm install
```


3. Configurer les variables d'environnement


## Configuration

Créez un fichier `.env.development` et `.env.production` avec les variables suivantes :

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
4. Démarrer le serveur de développement

```
npm run dev
```


## Structure des Rôles

- **Admin**: Accès complet à toutes les fonctionnalités
- **Opération**: Gestion de l'enrôlement des commerçants
- **Validation**: Validation des dossiers soumis
- **Impression**: Impression des cartes d'identité

## Routes Protégées

- `/dashboard/*` - Tableau de bord et fonctionnalités principales
- `/dashboard/users` - Gestion des utilisateurs (Admin uniquement)
- `/dashboard/merchants` - Enrôlement des commerçants
- `/dashboard/merchants-review` - Validation des dossiers
- `/dashboard/id-cards` - Impression des cartes
- `/dashboard/card-history` - Historique des impressions



