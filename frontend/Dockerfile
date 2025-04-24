FROM node:lts-alpine as build
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn

COPY ./ ./
RUN yarn build

FROM scratch as content
COPY --from=build /app/dist /content