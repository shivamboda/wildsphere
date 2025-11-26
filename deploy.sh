#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "The 'dist' directory is ready for deployment."
else
  echo "Build failed!"
  exit 1
fi
