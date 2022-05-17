# ESIOS PVPC Data Import

This repository contains a script to download PVPC electrity prices from [ESIOS](https://www.esios.ree.es/es/pvpc) using its [API](https://api.esios.ree.es/) and store this data in a Postgres database using Prisma.

This repository has a Dockerfile to build a Docker image that can be dowloaded from Docker Hub.

Two env variables are required, one for Prisma for database connection, the other one to identify our requests for the API:

- DATABASE_URL="postgresql://user:password@your_db_server_or_hostname:5432/your_db_name?schema=public". Note that your database user must have "CREATEDB" privileges: `ALTER USER username CREATEDB;` so the database is created in the first run.
- ESIOS_KEY. You can request an API key sending an email to consultasios@ree.es.

You can run this script using `npm start` or you can run it using Docker:

```(bash)
docker run --env DATABASE_URL="postgresql://user:password@your_db_server_or_hostname:5432/your_db_name?schema=public" --env ESIOS_KEY="your_esios_key" get-esios
```

Each time you execute this command, records older than today will be deleted from the database.
