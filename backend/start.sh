#!/bin/sh
set -e

export NODE_OPTIONS="--max-old-space-size=6144"

echo "Running database migrations..."
npx medusa db:migrate

echo "Starting server..."
cd /app/.medusa/server
exec npx medusa start
