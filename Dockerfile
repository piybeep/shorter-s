FROM node:18-alpine as dev
WORKDIR /app
COPY ./*.json ./
RUN npm install
COPY ./src ./src
EXPOSE ${API_PORT}
VOLUME ./src ./src
CMD ["npm", "run", "start:dev"]