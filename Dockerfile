FROM node:19.1
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . .
# ENV sets the environment variable that is used as process.env.environmentVariable. .env파일안의 변수보다 아래에 ENV로 정의한 것이 더 우선함
ENV PORT 3033
# EXPOSE is for document purpose only
# EXPOSE ${PORT}
CMD ["node", "index.js"]