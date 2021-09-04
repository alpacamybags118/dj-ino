FROM node:16.8.0-alpine

WORKDIR /app

COPY . .

RUN npm ci --production && npm run build && npm prune --production

ENTRYPOINT ["npm", "run", "start:prod"]