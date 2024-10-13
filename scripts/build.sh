#!/bin/bash

# Build the Anchor project
anchor build

# Copy the generated IDL file to the app constants folder
cp -r ./target/idl/todo_onchain.json ./app/constants/todo.json

# Copy the generated types file to the app types folder
cp -r ./target/types/todo_onchain.ts ./app/types/idl.ts

# Print a success message
echo "Build completed and files copied successfully."
