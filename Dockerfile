# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all files first
COPY . .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Create output directory
RUN mkdir -p /app/output

# Set the default command to run the theme
CMD ["node", "dist/index.js"] 