FROM node:16-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . ./

RUN NODE_OPTIONS=--max_old_space_size=8192 yarn build

FROM nginx:stable-alpine as production-stage

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
