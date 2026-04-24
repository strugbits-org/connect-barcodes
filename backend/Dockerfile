FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN npx medusa build

EXPOSE 9000

CMD ["sh", "-c", "ls -la /app/.medusa/ && ls -la /app/.medusa/server/ 2>/dev/null || echo 'no server dir' && npx medusa start"]
