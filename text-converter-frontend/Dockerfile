# Step 1: Use official Node.js LTS image
FROM node:20-alpine AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install react react-dom
RUN npm install axios
RUN npm install lucide-react

# Step 4: Copy source code
COPY . .

# Step 5: Build the app
RUN npm run build

# Step 6: Use Nginx to serve the static build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Step 7: Expose port
EXPOSE 5173

# Step 8: Start Nginx
CMD ["nginx", "-g", "daemon off;"]