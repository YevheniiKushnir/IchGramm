FROM node:20

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Чистая установка (исправляет проблемы с rollup)
RUN rm -rf node_modules package-lock.json
RUN npm install

# Копируем исходный код
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]