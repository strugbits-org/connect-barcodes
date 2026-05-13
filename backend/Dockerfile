FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN chmod +x /app/start.sh

EXPOSE 9000

CMD ["/app/start.sh"]
