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