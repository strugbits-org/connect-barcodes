FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./

RUN npm ci --prefer-offline --no-audit --no-fund

COPY . .

RUN npx medusa build

EXPOSE 9000

CMD ["node", ".medusa/server/index.js"]
