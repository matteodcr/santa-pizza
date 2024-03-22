# Use the official Node.js 16 image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application source code to the container
COPY . .

# Install project dependencies
RUN yarn install

# Expose the port your Nest.js application is listening on
EXPOSE 3000

# Command to start your Nest.js application
CMD [ "yarn", "start:dev" ]
