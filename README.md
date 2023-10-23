# PROJECT GUILDELINES

## Prerequisites

* NodeJS **v18.10.0**
* @nestjs/cli **v10.1.18**
* Create a file named `.env `and fills in all values of variables defined in `.env.example`

### Installation

```
npm install -g @nestjs/cli@10.1.18

npm install
```

### Running the app

```
npm run start:dev
```

## 1. Project Structure

### 1.1 Main components of project

**configs**

Contains all the configurations of the app

**libs**

Includes all common resources used across multiple modules

**modules**

Includes application modules. This is the place where we will write our application code.

### 1.2 Module structure

<img src="https://i.ibb.co/WWH7Nrw/architecture.png" width="50%" alt="App Architecture" />

## 2. Database migration

If your currently developed feature requires changes in database, it has to be made using migrations. Below rules **MUST BE** followed in order for the migration to work:

- All the Typeorm Entity must be put under folder **entites** and have format `<name>.entity.ts` eg: entities/product.entity.ts.
- BE CAREFUL when you manually edit migration file.

Steps to perform database migration:

1. Make your database changes directly in application code.
2. Generate migration file using following command:

   ```
   npm run migration:generate
   ```
   This will generate a migration file in **migrations** folder
