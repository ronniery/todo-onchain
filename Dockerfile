# This stage is used to build the Next.js application
FROM node:22 AS build

WORKDIR /

COPY package.json yarn.lock tsconfig.json ./
COPY app .

RUN yarn install \
  && yarn build

# This stage will be used to serve the Next.js application
FROM node:22-slim AS production

WORKDIR /

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

RUN yarn install --production --frozen-lockfile 

EXPOSE 3000

CMD ["yarn", "start"]
