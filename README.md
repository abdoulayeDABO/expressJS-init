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

3. **Creer la base de données :**

```bash
       CREATE DATABASE IF NOT EXISTS expressjs_api_db;
       USE expressjs_api_db;
       CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255) DEFAULT 'user',
          reset_password_token VARCHAR(255) UNIQUE DEFAULT NULL,
          reset_password_expires DATETIME DEFAULT NULL,
          validate_account_token VARCHAR(255) UNIQUE DEFAULT NULL,
          validate_account_expires DATETIME DEFAULT NULL,
          remember_token VARCHAR(255) UNIQUE DEFAULT NULL
        );
 ```

## Configuration

1. **Copiez lea fichiers `.env.example` en `.env`, `config./config.example.json` en `config./config.json`, `config./nodemailer.example.json` en `config./nodemailer.json`  et configurez les variables d'environnement nécessaires, renseignez les informations de votre base de données et vos informations d'envoi de mail dans les fichiers de configuration `config./config.json` et `config./nodemailer.json`.

## Utilisation

Lancez l'application avec la commande :

```bash
    npm start
```

Copier l'URL suivant la barre de recherche dans votre navigateur:

```bash
http://localhost:3000/users/all
```
