FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only package files first
COPY package*.json ./

# Install dependencies from scratch (ensures correct Linux permissions)
RUN npm install

# Copy the rest of your source code
COPY . .

# CRITICAL FIX: Ensure Vite is executable in the Linux environment
RUN chmod +x node_modules/.bin/vite

# Now build the React app
RUN npm run build

# Expose port and start server
EXPOSE 3000
CMD [ "node", "index.js" ]