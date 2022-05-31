VOLUMES=${shell docker volume ls -q}
IMAGES=${shell docker images -q}
CONTAINERS=${shell docker ps -aq}
NETWORKS=${shell docker network ls -q}
all:
	cd apps && ./helper.sh && docker-compose up --build
clean:
	docker-compose -f apps/docker-compose.yml down
fclean:
	docker-compose -f apps/docker-compose.yml down
	docker rm -f $(CONTAINERS)
	docker rmi $(IMAGES)
	docker volume rm $(VOLUMES)
	docker network rm $(NETWORKS)

cleanc:
	docker rm -f $(CONTAINERS)
cleani:
	docker rmi $(IMAGES)
cleanv:
	docker volume rm $(VOLUMES)
cleann:
	docker network rm $(NETWORKS)
.PHONY: all fclean cleanc cleani cleanv cleann
