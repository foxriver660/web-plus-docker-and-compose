# Этап 1: Сборка проекта
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN npm run build

# Этап 2: Запуск билда в окружении с минимальным набором зависимостей
FROM node:16-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --ignore-scripts --production \
        && npm i -g pm2


COPY --from=builder /app/dist ./dist

COPY ecosystem.config.js .

EXPOSE 4200

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]

