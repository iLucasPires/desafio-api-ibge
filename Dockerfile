ARG NODE_VERSION=23

FROM node:${NODE_VERSION}-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

RUN pnpm install --shamefully-hoist

COPY . ./

RUN pnpm run build

FROM node:${NODE_VERSION}-slim

WORKDIR /app

COPY --from=build /app/.output ./

ENV HOST=0.0.0.0 NODE_ENV=production
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node","/app/server/index.mjs"]
