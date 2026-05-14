FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN sed -i 's/\r//' /app/start.sh && chmod +x /app/start.sh

RUN NODE_OPTIONS="--max-old-space-size=6144" npx medusa build

RUN cp /app/medusa-config.js /app/.medusa/server/medusa-config.js

WORKDIR /app/.medusa/server
RUN npm install --no-audit --no-fund

WORKDIR /app

EXPOSE 9000

CMD ["/app/start.sh"]
