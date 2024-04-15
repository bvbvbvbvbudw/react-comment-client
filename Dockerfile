# Use official Node.js image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# RUN npm install

# Copy the rest of the application code
COPY . .

# Copy start.sh script to /usr/local/bin/
COPY start.sh /usr/local/bin/

# Give execute permission to start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["/bin/sh", "/usr/local/bin/start.sh"]


