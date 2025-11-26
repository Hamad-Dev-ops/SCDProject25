FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Make sure Express is installed (critical for web server)
RUN npm install express

COPY . .

EXPOSE 3000

# Changed from main.js to server.js - this is the key fix!
CMD ["node", "server.js"]
