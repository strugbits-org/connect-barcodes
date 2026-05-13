#!/bin/sh
set -e

export NODE_OPTIONS="--max-old-space-size=6144"

echo "Building Medusa server..."
npx medusa build

echo "Running database migrations..."
npx medusa db:migrate

echo "Starting server..."
cd /app/.medusa/server && exec npx medusa start
