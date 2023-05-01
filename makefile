build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

build-renew:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V

build2:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --scale node-app=2


down:
	docker compose down

log-sh1:
	docker logs node-app-node-app-1 -f

log-sh2:
	docker logs node-app-node-app-2 -f

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