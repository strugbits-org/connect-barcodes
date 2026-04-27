FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN echo "Starting medusa build..."
RUN NODE_OPTIONS="--max-old-space-size=4096" npx medusa build

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
