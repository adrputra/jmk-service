# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install
RUN npm ci --omit=dev

# Copy the application code to the working directory
COPY . .

# Expose a port (if your application uses one)
EXPOSE 5000

# Specify the command to run your application
CMD [ "npm", "run", "serve" ]
