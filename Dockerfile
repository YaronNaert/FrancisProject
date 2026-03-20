# Step 1: Use Node to build and run
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy all your source code
COPY . .

# Build the React app (This creates the /dist folder)
RUN npm run build

# Expose the port Express is listening on
EXPOSE 3000

# Start the server
CMD [ "npm", "start" ]