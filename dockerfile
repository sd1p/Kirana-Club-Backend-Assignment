FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:all"]