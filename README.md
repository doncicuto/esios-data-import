# ESIOS Data Import

This repository contains a script to download electrity prices from [ESIOS](https://www.esios.ree.es/es/pvpc) using its [API](https://api.esios.ree.es/) and store this data in a Postgres database using Prisma. You can request an API key sending an email to consultasios@ree.es.

Two env variables are required, one for Prisma for database connection, the other one to identify our requests for the API:

- DATABASE_URL="postgresql://xxxxx:xxxxxxxx@localhost:5432/xxxxxxxx?schema=public"
- ESIOS_KEY

You can run this script using `npm start`

Records older than today are deleted
