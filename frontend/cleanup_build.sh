#!/bin/bash
set -e

echo "🧹 Starting robust cleanup..."

# 1. Kill potential zombie processes holding locks
echo "Stopping stale node processes..."
pkill -f "node" || true
pkill -f "vite" || true

# 2. Aggressive cleanup of locked directories
echo "Removing locked directories..."
rm -rfv node_modules/@capacitor || true
rm -rfv node_modules/sharp || true
rm -rfv node_modules/.vite || true

# 3. Full cleanup
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# 4. Reinstall
echo "Installing dependencies..."
npm install

# 5. Build
echo "Building..."
npm run build

echo "✅ Build completed successfully!"
