FROM node:lts

WORKDIR /usr/app

COPY package.json ./

RUN npm install -g npm@10.2.5

COPY . .

EXPOSE 3333

CMD ["npm","run","dev"]
