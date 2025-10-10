FROM node:20

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Пересобираем bcrypt для правильной архитектуры
RUN npm rebuild bcrypt --build-from-source

# Копируем исходный код
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]