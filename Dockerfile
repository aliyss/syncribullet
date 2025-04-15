FROM node:22.14.0-alpine3.21

WORKDIR /app

# Copy only package files first for caching
COPY package.json package-lock.json ./

#RUN npm ci
RUN npm install

# Copy the rest of the application files
COPY . .

RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:local"]
