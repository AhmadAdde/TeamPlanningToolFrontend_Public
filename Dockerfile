FROM node:alpine

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

COPY ./ ./

RUN npm install

CMD [ "npm", "start" ]

## docker build -f Dockerfile -t react-image .
## docker run --rm -it -p 3001:3000 react-image

## docker inspect --format="{{json .NetworkSettings.Networks}}" relaxed_northcutt