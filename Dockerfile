FROM node:21.7.3

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

USER node

CMD [ "npm", "start" ]