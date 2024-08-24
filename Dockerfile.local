# Use the official Node.js image as the base image
FROM node:18.17.0


# Install nodemon globally
RUN yarn global add nodemon


# Set the working directory within the container
WORKDIR /usr/src/app


# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Install application dependencies
RUN yarn install


# Copy the rest of the application code to the container
COPY . .


# Expose a port (if your application listens on a specific port)
EXPOSE 4000


# Define the command to start your application using nodemon
CMD ["nodemon"]