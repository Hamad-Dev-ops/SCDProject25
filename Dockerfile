# Use official Node LTS
FROM node:18-alpine

# set working dir
WORKDIR /usr/src/app

# copy package manifests first to leverage cache
COPY package*.json ./

# install deps (production only)
RUN npm ci --only=production

# copy app source
COPY . .

# ensure node runs in production mode
ENV NODE_ENV=production

# Expose port that app listens on
EXPOSE 3000

# Default command
CMD ["node", "main.js"]

