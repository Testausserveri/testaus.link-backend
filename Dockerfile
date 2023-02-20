FROM node:18.14.1-alpine3.17
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY prisma prisma
RUN npm ci
RUN npm install --location=global prisma
COPY tsconfig.json .
COPY src src
RUN npm run tsc
CMD ["npm", "run", "start:prod"]
