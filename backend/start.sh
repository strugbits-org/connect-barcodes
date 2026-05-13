#!/bin/sh
set -e

echo "Running database migrations..."
npx medusa db:migrate

echo "Starting server..."
cd /app/.medusa/server && exec npx medusa start
