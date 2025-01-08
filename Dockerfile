# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

COPY .env.example .env

# Step 4: Install dependencies, including dev dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Set the environment to development
ENV NODE_ENV=development

# Step 7: Expose the port the app will run on
EXPOSE 3000

# Step 8: Run the app in development mode (watch mode)
CMD ["npm", "run", "start:dev"]