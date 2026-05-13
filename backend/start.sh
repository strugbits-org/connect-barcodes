#!/bin/sh
set -e

export NODE_OPTIONS="--max-old-space-size=6144"

echo "Building Medusa server..."
npx medusa build

echo "Running database migrations..."
npx medusa db:migrate

echo "Starting server..."
cd /app/dist && exec npx medusa start
