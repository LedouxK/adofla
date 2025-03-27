
# FlapiCMS - Subscription Management System

FlapiCMS est une plateforme de gestion d'abonnements développée avec Nuxt.js pour le frontend et AdonisJS pour le backend.

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Docker et Docker Compose (pour la base de données)

## Configuration et Installation

### 1. Cloner le dépôt

```bash
git clone [URL_DU_DÉPÔT]
cd flapicms
```

### 2. Lancer la base de données avec Docker

```bash
docker-compose up -d
```

Cette commande lancera les conteneurs MySQL et phpMyAdmin définis dans le fichier `docker-compose.yml`.
- MySQL sera accessible sur le port 3310
- phpMyAdmin sera accessible sur http://localhost:8090
- Base de données: flapicms7
- La base de données sera initialisée avec le fichier `db_dump.sql`

Si vous souhaitez réinitialiser la base de données:
```bash
docker-compose down -v
docker-compose up -d
```

### 3. Configuration du Backend (AdonisJS)

```bash
cd b_end
npm install
```

Configurer le fichier d'environnement:
```bash
cp .env.example .env
```

Modifier le fichier `.env` avec les paramètres de connexion à la base de données:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3310
DB_USER=admin
DB_PASSWORD=admin_password
DB_DATABASE=flapicms7
```

Lancer les migrations et les seeders (si nécessaire):
```bash
node ace migration:run
node ace db:seed
```

Démarrer le serveur backend:
```bash
npm run dev
```

Le serveur backend sera disponible sur http://localhost:3333

### 4. Configuration du Frontend

```bash
cd f_end
npm install
```

### 5. Lancer le Frontend

```bash
npm run dev
```

L'application Frontend sera disponible sur http://localhost:3000

### 5. Arrêter le serveur

Pour arrêter le serveur de développement, appuyez sur `Ctrl+C` dans le terminal.

## Structure du Projet

- `f_end/` - Code source du frontend (Nuxt.js)
- `components/` - Composants Vue réutilisables
- `pages/` - Routes et pages de l'application
- `store/` - Gestion d'état avec Pinia
- `utils/` - Fonctions utilitaires
- `assets/` - Ressources statiques (CSS, images, etc.)

## Fonctionnalités Principales

1. **Authentification**
   - Connexion/Déconnexion
   - Récupération de mot de passe
   - Changement de mot de passe

2. **Gestion des abonnements**
   - Visualisation des abonnements actifs
   - Souscription à de nouveaux plans
   - Modification des abonnements existants

3. **Profil utilisateur**
   - Modification des informations personnelles
   - Gestion de la photo de profil

4. **Administration**
   - Gestion des utilisateurs
   - Gestion des plans d'abonnement

## Utilisateurs par défaut

- **Admin**: admin@flapi.com / password
- **Utilisateur**: user@flapi.com / password

## Détails de la base de données

La base de données MySQL contient les tables suivantes:
- `users` - Informations sur les utilisateurs
- `subscriptions` - Plans d'abonnement disponibles
- `user_subscriptions` - Abonnements souscrits par les utilisateurs
- `roles` - Rôles utilisateur (admin, utilisateur)
- `password_reset_tokens` - Jetons pour la réinitialisation des mots de passe

Pour accéder directement à la base de données:
```bash
docker exec -it flapi_cms_mysql_experience mysql -u admin -padmin_password flapicms7
```

Si vous devez restaurer manuellement la base de données:
```bash
docker exec -i flapi_cms_mysql_experience mysql -u admin -padmin_password flapicms7 < db_dump.sql
```

## Accès phpMyAdmin

- URL: http://localhost:8090
- Serveur: mysql
- Utilisateur: admin
- Mot de passe: admin_password

## Dépannage

- **Problème de connexion à la base de données** : Vérifiez que Docker est en cours d'exécution et que les conteneurs sont actifs avec `docker ps`.
- **Port déjà utilisé** : Si le port 3000 est déjà utilisé, arrêtez l'application qui utilise ce port ou configurez l'application pour utiliser un port différent.
- **Erreurs de dépendances** : Essayez de supprimer le dossier `node_modules` et de réinstaller avec `npm install`.
- **Problèmes d'API** : Vérifiez que le backend tourne bien sur le port 3333. Si c'est un autre port, modifiez la variable `axiosBase` dans le frontend.
- **Erreurs CORS** : Si vous rencontrez des erreurs CORS, vérifiez la configuration dans le fichier `cors.js` du backend.
- **Problèmes de sessions** : Essayez de vider le localStorage du navigateur.

## Ressources supplémentaires

- [Documentation Nuxt.js](https://nuxt.com/docs)
- [Documentation View UI Plus](https://www.iviewui.com/view-ui-plus/guide/introduce)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
