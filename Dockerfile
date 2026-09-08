FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output

EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000

USER node

CMD ["node", ".output/server/index.mjs"]
