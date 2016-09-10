# Payment gateway

## Setup

Installing PostgreSQL

- Add PostgreSQL Apt Repository
```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
```

- Install PostgreSQL
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

Importing third party libraries:
```
npm install
```

Initializing the database
```
bin/gulp init-db
```

## Starting the api:
```
node index.js
```

## Runnind the tests:
```
npm test
```

## Running the tests with coverage on:
```
npm run coverage
```
