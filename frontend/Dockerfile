# STAGE 1
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

# STAGE 2
FROM nginx:latest AS frontend
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]