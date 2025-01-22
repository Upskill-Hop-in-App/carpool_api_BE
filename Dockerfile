# Use Node.js as the base image
FROM node:22-alpine AS node

# Set the working directory inside the container
WORKDIR /src

# Install build dependencies needed for some native modules
RUN apk add --no-cache --virtual .build-deps build-base python3

# Copy the package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install production dependencies only
RUN npm install --production

# Remove build dependencies to keep the image size smaller
RUN apk del .build-deps

# Copy the rest of the application code into the container
COPY . .

# Copy private.pem and public.pem files into the /src/keys directory
COPY ./keys/public.pem /src/keys/public.pem
COPY ./keys/private.pem /src/keys/private.pem

# Expose the port your Express app listens on
EXPOSE 3000
