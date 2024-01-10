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

3. **Effectuer les migrations:**

```bash
   npm install --save-dev sequelize-cli
   npx sequelize-cli db:migrate   
 ```

## Configuration

1. **Copiez lea fichiers `.env.example` en `.env`, `config./config.example.json` en `config./config.json`, `config./nodemailerConfig.example.js` en `config./nodemailer.json`  et configurez les variables d'environnement nécessaires, renseignez les informations de votre base de données et vos informations d'envoi de mail dans les fichiers de configuration `config./config.json` et `config./nodemailerConfig.js`.

## Utilisation

Lancez l'application avec la commande :

```bash
    npm start
```

Copier l'URL suivant la barre de recherche dans votre navigateur:

```bash
http://localhost:3000/users/all
```
