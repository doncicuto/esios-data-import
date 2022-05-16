# syntax=docker/dockerfile:1
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY /prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

FROM node:18-alpine
USER node
WORKDIR /app
RUN npm config set update-notifier false
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=production /app/node_modules ./node_modules
COPY --chown=node:node --from=production /app/package*.json ./
COPY --chown=node:node /prisma ./prisma
CMD [ "npm", "run", "start:prod" ]