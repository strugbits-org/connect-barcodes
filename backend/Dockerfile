FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN sed -i 's/\r//' /app/start.sh && chmod +x /app/start.sh

RUN npx medusa build

WORKDIR /app/.medusa/server
RUN npm install --no-audit --no-fund

WORKDIR /app

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
