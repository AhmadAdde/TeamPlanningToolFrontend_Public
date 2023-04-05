FROM node:17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

## docker build -t react-image .
## docker run --rm -p 3000:3000 -v ${pwd}/src:/app/src:ro react-imgage