FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma prisma

RUN npm ci

COPY tsconfig.json .
COPY src src
RUN npm run tsc

CMD ["npm", "run", "start:prod"]
