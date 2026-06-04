#!/bin/bash
# Run build check before every commit
echo "Running build check..."
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed — commit blocked."
  exit 1
fi
echo "Build OK."
