FROM node:18.12.1-slim
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /api
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV production
RUN npm prune --production
CMD [ "node", "dist/src/main.js" ]