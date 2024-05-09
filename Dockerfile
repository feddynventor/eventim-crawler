FROM node:latest

WORKDIR /opt
COPY package.json ./

RUN npm install

COPY *.js ./

EXPOSE 3000
CMD ["node", "index.js"]
