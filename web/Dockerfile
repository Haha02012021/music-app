# base image
FROM node:18.18-buster-slim

# Create and change to the app directory
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "start"]
