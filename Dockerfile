FROM node:16.8.0-alpine

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

WORKDIR /app

COPY . .

RUN npm ci --production && npm run build && npm prune --production

ENTRYPOINT ["npm", "run", "start:prod"]