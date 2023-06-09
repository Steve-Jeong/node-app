Devops with Docker and Node.js
==============================
유투브 1~12까지 정리   
https://www.youtube.com/watch?v=Ck7baWmnldY&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan


## 1. Dockerfile

```Dockerfile
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
```

## 2. docker-compose.yml

```dockerfile
version: '3'
services:
  node-app:
    build: .
```

## 3. docker-compose.dev.yml

```dockerfile
version: '3'
services:
  node-app:
    build: 
      context: .
      args: 
        NODE_ENV: development
    ports:
      - "3001:4567"
    environment:
      - PORT=4567
      - NODE_ENV=development
    volumes:
      - ./:/app:ro
      - /app/node_modules
    command: npm run dev
```

## 4. docker-compose.prod.yml

```dockerfile
version: '3'
services:
  node-app:
    build: 
      context: .
      args: 
        NODE_ENV: production
    ports:
      - "3001:4422"
    env_file:
      - ./.env
    environment:
      - NODE_ENV=production
    command: node index.js
```

## 5. 명령어

```dockerfile
현재 directory의 Dockerfile을 이용하여 node-app-image라는 이름의 도커이미지 생성   
docker build -t node-app-image .   
   
도커 이미지 리스트 표시
docker image ls
docker images

도커 이미지 중 이름이 n으로 시작하는 이미지 리스트 표시
docker images -f reference='n*'

도커 컨테이너 중 이름에 in이 들어간 컨테이너 리스트 표시
docker ps -af name='in'

도커 이미지 node-app-image를 이용해 detached mode로 호스트포트 3001에 컨테이너포트 3001을 연결한 node-app이라는 이름의 컨테이너를 생성하고 실행
docker run -d -p 3001:3001 --name node-app node-app-image

도커 이미지 node-app-image를 이용해 detached mode로 현재 디렉토리와 컨테이너의 /app디렉토리를 바인드 마운트하고 호스트포트 3001에 컨테이너포트 4000을 연결한 node-app이라는 이름의 컨테이너를 생성하고 실행
docker run -d -v $(pwd):/app -p 3001:4000 --name node-app node-app-image

도커 이미지 node-app-image를 이용해 detached mode로 현재 디렉토리와 컨테이너의 /app디렉토리를 바인드 마운트하고 컨테이너의 /app/node_modules디렉토리는 anonymous volume으로 마운트하고 호스트포트 3001에 컨테이너포트 4000을 연결한 node-app이라는 이름의 컨테이너를 생성하고 실행
docker run -d -v $(pwd):/app -v /app/node_modules -p 3001:4000 --name node-app node-app-image

도커 이미지 node-app-image를 이용해 detached mode로 현재 디렉토리와 컨테이너의 /app디렉토리를 Read-Only로 바인드 마운트하고 컨테이너의 /app/node_modules디렉토리는 anonymous volume으로 마운트하고 호스트포트 3001에 컨테이너포트 4000을 연결한 node-app이라는 이름의 컨테이너를 생성하고 실행
docker run -d -v $(pwd):/app:ro -v /app/node_modules -p 3001:3033 --name node-app node-app-image

컨테이너 id가 d7e9 bb1c 93de인 컨테이너를 강제적으로 닫음
docker rm d7e9 bb1c 91de -f

컨테이너 이름이 node-app인 컨테이너를 강제적으로 닫음
docker rm node-app -f

컨테이너 이름이 node-app인 컨테이너를 강제적으로 닫고, 도커볼륨도 삭제
docker rm node-app -fv

컨테이너 node-app의 실행 로그를 보여줌
docker logs node-app

컨테이너 node-app의 bash프로그램은 interactive하게 실행
docker exec -it node-app bash

도커 이미지중 repository 이름이 없는(dangling) 이미지를 삭제
docker rmi $(docker images -f "dangling=true" -q)

도커 볼륨 리스트 표시
docker volume ls

사용되지 않는 도커 볼륨을 삭제
docker volume prune

도커컴포즈를 detached mode로 실행
도커컴포즈를 이용시 이미지이름은 도커컴포즈파일이 있는 디렉토리의 이름과 services의 이름이 조합돼어 생성됨.
현재 디렉토리가 node-app이고, services의 이름이 node-app이라면 이미지이름은 node-app-node-app이고 컨테이너 이름은 node-app-node-app-1임.
docker-compose up -d

도커컴포즈를 실행중지하고 해당 컨테이너를 삭제하고 볼륨을 삭제
docker-compose down -v

도커컴포즈에서 개발(development)와 배포(production)환경의 도커컴포즈파일을 개별적으로 실행할 때. 표기 순서가 중요함. --build옵션이 없을 경우 nodemon이 없다는 에러가 뜸.
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build


도커컴포즈 배포환경에서는 로컬환경의 소스코드변경이 빌드프로세스에서 캐치하지 못할 경우가 있으므로 --build옵션을 더해준다.
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

Dockerfile의 
ENV PORT 3000
EXPOSE $PORT

와 .env 파일의
PORT=4422
또는 docker-compose.yml의 
    environment:
      - PORT=3456
중 어떤 것이 우선권이 있나?
-> .env 또는 docker-compose 가 우선권이 있다.

도커 컨테이너의 environment variable 확인 방법
# printenv
```   


# 유투브 12 정리 - mongodb 컨테이너 설치
https://www.youtube.com/watch?v=wZZMuqDmNmU&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan

```dockerfile
version: "3"
services:
  node-app:
    build: .

  mongo:
    image: mongo:6   #mongo database
    environment:
      - MONGO_INITDB_ROOT_USERNAME=sanjeev
      - MONGO_INITDB_ROOT_PASSWORD=mypassword
    volumes:
      - mongo-db:/data/db    # named volume이름은 volume section에 그 이름을 미리 등록해야 한다.

volumes:
  mongo-db:
```

```
컨테이너 생성 및 실행
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

mongodb 컨테이너에 다음과 같이 접근 가능
1. bash를 통해서 접근
docker exec -it node-app-mongo-1 bash
# mongosh -u "sanjeev" -p "mypassword"

2. mongosh로 바로 접근
docker exec -it node-app-mongo-1 mongosh -u "sanjeev" -p "mypassword"

컨테이너 중지 및 삭제
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v

위와 같이 -v옵션을 주면 anonymous volume뿐만 아니라 named volume도 삭제한다. 따라서 컨테이너가 돌아가는 상태에서
docker volume prune
을 통해 컨테이너와 상관이 없는 볼륨만 삭제해야 한다.

그 다음 -v옵션이 없는 명령어로 컨테이너 중지를 한다.
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```


# 유투브 13 정리 - mongoose설치
https://www.youtube.com/watch?v=siSUyDzbe1E&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&index=14&ab_channel=SanjeevThiyagarajan

컨테이너 안에서 mongoose를 Local환경에서 npm i mongoose로 추가하려니 package.json에 다음과 같은 오류가 발생
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /home/ubuntu/dev/docker/node-app/node_modules/abbrev
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, mkdir '/home/ubuntu/dev/docker/node-app/node_modules/abbrev'

-> node_modules 디렉토리를 지우고, npm i mongoose로 추가 성공.

컨테이너를 돌리지 않는 상태에서 npm i mongoose를 하면 오류없이 설치됨. package.json에 dependency가 반영되었으므로 다음 docker compose up시에 관련 모듈이 설치될 것임.


docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build와 같이 컨테이너를 실행하니 다음과 같은 에러 발행

Error response from daemon: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "/var/lib/docker/volumes/25fd09b5310a74f2ae95664608726a46f21e3c9cd5589ceaf3a0cb57199b3c84/_data" to rootfs at "/app/node_modules": mkdir /var/lib/docker/overlay2/3a88ce02d2aafdf7d9d6358fb31ba8eed85547c3b887b4aa9b716a4fb3f0d3f4/merged/app/node_modules: read-only file system: unknown

docker-compose.yml에서 volumes에서 Read Only속성을 제거하고 다시 컨테이너를 생성하니 성공

```
변경전 
volumes:
  - ./:/app:ro

변경후 
volumes:
  - ./:/app
```
```
mongoose.connect('mongodb://sanjeev:mypassword@mongo:27017/mytestdb?authSource=admin')
위에서 mongo는 mongo컨테이너 서비스의 이름임. docker가 자체 dns를 이용하여 mongo가 돌아가는 컨테이너의 ip address를 입력해 줌.
```


<br><br>
# 유투브 14 정리 - Environment Variables
https://www.youtube.com/watch?v=siSUyDzbe1E&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan



<br><br>
# 유투브 15 정리 - depends_on property
https://www.youtube.com/watch?v=Xgcr0NLlJT4&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&index=15&ab_channel=SanjeevThiyagarajan

mongo를 node보다 먼저 로드되도록 해야 한다.

```
services:
  node-app:
    build: .
    depends_on:  # mongo가 먼저 로드되도록 한다
      - mongo
```

그러나 위와 같이 하더라도 실제로 mongodb가 작동상태인지는 확신할 수 없다. node에서 다음과 같이 하여 5초마다 접속시도를 하게 할 수 있다.

```JavaScript
변경전
mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
  .then(()=>console.log("successfully connected to DB"))
  .catch((e)=>console.log(e))

변경후
const connectWithRetry =  () => {
  mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(()=>console.log("successfully connected to DB"))
    .catch((e)=>{
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()
```

위와 같이 하고 다음과 같이 node-app만 실행하고 docker logs를 살펴본다.
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --no-deps node-app
위에서 --no-deps가 없다면, docker-compose.yml에 depends_on으로 mongo 컨테이너를 필요로 하므로 node-app 컨테이너만 실행할 수 없다.

다음 명령으로 도커 로그를 살펴본다.
docker logs node-app-node-app-1 -f 
-f옵션은 출력을 계속 모니터링할 수 있게 한다.
위와 같이 하면 mongo 컨테이너가 실행중이 아니므로 node 컨테이너가 계속해서 30초마다 접속을 시도한다.
```

mongo 컨테이너만 실행하고, docker logs를 다시 살펴본다.
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build mongo      

docker logs node-app-node-app-1 -f 
위와 같이 하면 log에서 successfully connected to DB 메시지를 볼 수 있다.
```



# 유투브 16 정리 - Demo Blog CRUD Application
https://www.youtube.com/watch?v=aJhJsimY2Jo&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan

mongodb의 test db에 posts collection에 db를 저장한다. 여기서 test db가 아닌 다른 db에 저장하려면?
-> connection string의 port뒤에 다음과 같이 넣는다. (mytestdb)
mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mytestdb?authSource=admin`)



# 유투브 17 정리 - Signup and Login
https://www.youtube.com/watch?v=AxMhLqZYPIg&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&index=17&t=518s&ab_channel=SanjeevThiyagarajan

bcrypt 대신 bcryptjs사용.




# 유투브 18 정리 - Express Sessions Authentication w/Redis
https://www.youtube.com/watch?v=ilucNEYQnZo&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&index=18&t=5s&ab_channel=SanjeevThiyagarajan

npm install redis connect-redis express-session

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --renew-anon-volumes
위와 같이 docker-compose down을 하고 다시 docker-compose up을 할 필요가 없다. 대신 --renew-anon-volumes를 적용하여 기존 anonymous volume을 재사용하는 대신 새로운 anonymous volume을 사용하도록 하여 위의 새로운 npm package를 반영하도록 한다.

```
docker exec -it node-app-redis-1 redis-cli
node-app-redis-1 컨테이너의 redis-cli를 실행

KEYS *
현재 저장된 모든 KEY를 보여줌

```
redis 컨테이너에 로그인 불가 -> 왜 그럴까?   

<br>
다음과 같이 해서 node-redis 4.6.5를 사용하여 redis:7.0.10 컨테이너에 연결 성공
------------------------------------------------------------------------------

```javascript
const {REDIS_URL, REDIS_PORT} = require('./config/config')

const app = express()
app.use(express.json())

const {createClient} = require('redis')

let redisClient = createClient({url:REDIS_URL})

async function connect() {
  redisClient.on('error', err => console.log('Redis Client Error', err));
  redisClient.on('ready', () => console.log('Redis is ready to use'));

  await redisClient.connect().catch(console.error)

  await redisClient.set('my_key', 'my value');
  const value = await redisClient.get('my_key');
  console.log('my_key : ', value)
}
connect()
```

named volume을 지워서 그런지 이번에는 mongodb가 접속이 안됨.   
node-app2를 새로 만들어 mongodb부터 redis, express-session까지 처음부터 해 보면 모두 접속이 잘됨.   

이후 다시 node-app도 잘됨. -> 원인은 잘 모르겠음.  

node-app2의 mongodb와 node-app의 mongodb는 같은 volume명 mongo-db를 가지고 있지만 별개임   
-> 컨테이너이름이 다르기 때문. node-app-mongo-1 vs node-app2-mongo-1
-> 포트를 같은 것을 쓰기 때문에 동시에 돌아가지는 못한다.

다음과 같이 makefile을 만들고 make {label}식으로 운용하면 편하다.
```makefile
build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

down:
	docker compose down

log-sh:
	docker logs node-app-node-app-1 -f

log-mongodb:
	docker logs node-app-mongo-1 -f

log-redis:
	docker logs node-app-redis-1 -f

exec-sh:
	docker exec -it node-app-node-app-1 bash

exec-mongodb:
	docker exec -it node-app-mongo-1 mongosh -u "sanjeev" -p "mypassword"

exec-redis:
	docker exec -it node-app-redis-1 redis-cli
```

login이 안되 있으면 작동하지 않는 middleware protect추가.
logout route 추가



# 유투브 19 정리 - Application Architecture Review
https://www.youtube.com/watch?v=EPbW6SBcA0U&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan

Load balancer 개념 설명



# 유투브 20 정리 - NGinx container Load Balancing
https://www.youtube.com/watch?v=uTstD7R2Wps&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan


https://expressjs.com/en/guide/behind-proxies.html   
위에 따라 app.set('trust proxy')설정을 한다. 

docker scale을 하면 처음에는 한쪽 server만 실행되지만 20번이상 sever를 실행하면 2개의 서버가 순차적으로 번갈아가면서 실행된다.



# 유투브 21 정리 - Express CORS configuration
https://www.youtube.com/watch?v=a4K0cntPw0E&list=PL8VzFQ8k4U1JEu7BLraz8MdKJILJir7oY&ab_channel=SanjeevThiyagarajan

frontend의 주소가 www.myhome.com이고 api의 주소가 www.myapi.com이라면, frontend에서 backend로의 request는 backend에서 차단된다.   
이를 해결하기 위한 cors middleware를 설치한다.   
```
npm i cors   
```
그런데 우리는 node_modules에 anonymous volume을 사용하고 있으므로, 새로 설치한 cors middleware를 포함한 node_modules가 anonymous volume에 재생성되도록 build option에 --renew-anon-volumes 또는 -V 을 줘야한다.   

