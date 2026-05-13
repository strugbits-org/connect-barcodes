FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 9000

CMD ["sh", "-c", "echo '=== DOCKERFILE CMD RUNNING ===' && echo 'CWD:' $(pwd) && ls -la /app/.medusa 2>/dev/null || echo 'NO .medusa DIR' && echo 'Starting build...' && NODE_OPTIONS='--max-old-space-size=6144' npx medusa build; echo \"Build exit code: $?\" && ls -la /app/.medusa 2>/dev/null || echo 'NO .medusa DIR AFTER BUILD' && npx medusa db:migrate && npx medusa start"]
