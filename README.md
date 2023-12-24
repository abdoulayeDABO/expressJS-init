# expressjs_authentication_api_starter

Ce projet est un starter pour la création rapide d'une API d'authentification avec Express.js. Il inclut des fonctionnalités telles que l'inscription d'utilisateurs, la connexion, la réinitialisation de mot de passe, et la modification du mot de passe.

## Prérequis

Assurez-vous d'avoir Node.js et npm installés sur votre machine.

## Installation

1. **Clonez le dépôt :**

    ```bash
    git clone  https://github.com/LayeDa/expressjs_authentication_api_starter.git
    ```

2. **Installez les dépendances :**

    ```bash
    cd expressjs_authentication_api_starter
    npm install
    ```

## Configuration

1. **Copiez le fichier `.env.example` en `.env` et configurez les variables d'environnement nécessaires, telles que la clé secrète JWT, l'URL de la base de données, etc.
2. **Changer les informations suivantes dans `config./config.json` selon votre configuration
 ```bash
   "development": {
    "username": "db_username",
    "password": "db_password",
    "database": "expressjs_api_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
   }
```
4. **Changer les informations suivantes dans `config./nodemailer.json` selon votre configuration 
    ```bash
    auth: {
      user: "youremail",
      pass: "googleappkey",
    }
    ```
    
## Utilisation

Lancez l'application avec la commande :

```bash
npm start
```
Copier l'URL suivant la barre de recherche dans votre navigateur:

```bash
http://localhost:3000/users/all
```
