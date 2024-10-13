#!/bin/bash

# Build the Anchor project
anchor build

# Copy the generated IDL file to the app constants folder
cp ./target/idl/todo_onchain.json ./app/src/constants/todo.json

# Copy the generated types file to the app types folder
cp -r ./target/types/todo_onchain.ts ./app/src/types/todo-onchain.ts

# Print a success message
echo "Build completed and files copied successfully."
