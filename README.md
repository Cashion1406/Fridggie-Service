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


```
eRSS-RMS-Service
├─ .eslintrc.js
├─ .git
│  ├─ config
│  ├─ description
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-c6b8b51b20c05286d1ba30fc98e289374e52807f.idx
│  │     └─ pack-c6b8b51b20c05286d1ba30fc98e289374e52807f.pack
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ HEAD
│     └─ tags
├─ .gitignore
├─ .prettierrc
├─ migration.config.ts
├─ migrations
│  ├─ 1699513340356-OK.ts
│  └─ 1699540449538-LMAO.ts
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  ├─ config-validator.ts
│  │  ├─ constants.ts
│  │  ├─ database.config.ts
│  │  └─ index.ts
│  ├─ libs
│  │  ├─ dtos
│  │  │  └─ common-response.dtos.ts
│  │  ├─ enums
│  │  │  └─ result-code.enum.ts
│  │  ├─ exception-filters
│  │  │  └─ global.exception-filter.ts
│  │  ├─ exceptions
│  │  │  ├─ bad-request.exception.ts
│  │  │  └─ exception.base.ts
│  │  ├─ index.ts
│  │  └─ interceptors
│  │     └─ success-response.interceptor.ts
│  ├─ main.ts
│  └─ modules
│     ├─ .gitkeep
│     ├─ product
│     │  ├─ controllers
│     │  │  ├─ dtos
│     │  │  │  ├─ create-product.dtos.ts
│     │  │  │  ├─ delete-product.dtos.ts
│     │  │  │  ├─ product.dtos.ts
│     │  │  │  └─ update-product.dtos.ts
│     │  │  ├─ index.ts
│     │  │  └─ product.controller.ts
│     │  ├─ database
│     │  │  ├─ entities
│     │  │  │  └─ product.entity.ts
│     │  │  ├─ index.ts
│     │  │  ├─ interfaces.ts
│     │  │  ├─ mappers
│     │  │  │  └─ product.mapper.ts
│     │  │  └─ product.repository.ts
│     │  ├─ domain
│     │  │  ├─ index.ts
│     │  │  └─ product.ts
│     │  ├─ exceptions
│     │  │  └─ product.exceptions.ts
│     │  ├─ index.ts
│     │  └─ product.module.ts
│     ├─ step
│     │  ├─ controller
│     │  │  ├─ dtos
│     │  │  │  ├─ create-step.dtos.ts
│     │  │  │  └─ step.dtos.ts
│     │  │  └─ step.controller.ts
│     │  ├─ database
│     │  │  ├─ entities
│     │  │  │  └─ step.entity.ts
│     │  │  ├─ mapper
│     │  │  │  └─ step.mapper.ts
│     │  │  └─ step.repository.ts
│     │  ├─ domain
│     │  │  └─ step.ts
│     │  ├─ exception
│     │  │  └─ step.exceptions.ts
│     │  └─ step.module.ts
│     ├─ user
│     │  ├─ database
│     │  │  ├─ entities
│     │  │  │  └─ user.entity.ts
│     │  │  └─ user.repository.ts
│     │  └─ user.module.ts
│     └─ workflow
│        ├─ controller
│        │  ├─ dtos
│        │  │  ├─ create-workflow.dtos.ts
│        │  │  ├─ delete-workflow.dtos.ts
│        │  │  ├─ update-workflow.dts.ts
│        │  │  └─ workflow.dtos.ts
│        │  └─ workflow.controller.ts
│        ├─ database
│        │  ├─ entities
│        │  │  └─ workflow.entity.ts
│        │  ├─ mappers
│        │  │  └─ workflow.mapper.ts
│        │  ├─ workflow.interface.ts
│        │  └─ workflow.repository.ts
│        ├─ domain
│        │  └─ workflow.ts
│        ├─ exceptions
│        │  └─ workflow.exceptions.ts
│        └─ workflow.module.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```