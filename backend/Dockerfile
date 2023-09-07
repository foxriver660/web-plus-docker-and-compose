# STAGE 1
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . ./
RUN npm run build

# STAGE 2
FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --production && npm  i -g pm2
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./
CMD ["pm2-runtime", "start", "ecosystem.config.js"]