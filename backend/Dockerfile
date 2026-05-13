FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=6144" npx medusa build

RUN sed -i 's/\r//' /app/start.sh && chmod +x /app/start.sh

EXPOSE 9000

CMD ["/app/start.sh"]
