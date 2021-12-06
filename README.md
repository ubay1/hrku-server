
## Step By Step Setelah Clone Pertama

```bash
$ npm install
$ npm run start:dev
$ npx typeorm migration:run ---> untuk menambahkan 1 data user
$ npx typeorm migration:revert ---> untuk rollback seluruh data yang ter seeder diawal
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
