FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* .npmrc ./

RUN npm install --no-audit --no-fund --maxsockets=3

COPY . .

RUN sed -i 's/\r//' /app/start.sh && chmod +x /app/start.sh

RUN NODE_OPTIONS="--max-old-space-size=6144" npx medusa build

RUN cp /app/medusa-config.js /app/.medusa/server/medusa-config.js
RUN mkdir -p /app/.medusa/server/src && ln -s ../modules /app/.medusa/server/src/modules

WORKDIR /app/.medusa/server
COPY .npmrc ./
RUN npm install --no-audit --no-fund --maxsockets=3

WORKDIR /app

EXPOSE 9000

CMD ["/app/start.sh"]
