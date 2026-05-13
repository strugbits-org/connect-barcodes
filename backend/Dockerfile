FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 9000

CMD ["sh", "-c", "NODE_OPTIONS='--max-old-space-size=6144' npx medusa build && npx medusa db:migrate && npx medusa start"]
