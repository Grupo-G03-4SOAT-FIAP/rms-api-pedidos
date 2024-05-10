FROM node:20

RUN adduser --system --group --no-create-home nonroot

RUN apt-get update \
    && apt-get install -y curl build-essential \
    && npm cache clean --force

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm install --ignore-scripts
RUN npm run build


EXPOSE 3002
USER nonroot
CMD [ "node", "dist/main.js" ]
