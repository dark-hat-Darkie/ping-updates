# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

RUN npx prisma generate

RUN npm run test

RUN npm run build


# Expose the port your Node.js app runs on
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]
