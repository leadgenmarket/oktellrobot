include .env

up:
	@docker-compose up -d & disown
up-log:
	@docker-compose up
up-develop:
	@docker-compose -f docker-compose_develop.yml up & disown
run:
	@cd nodejs && npm run start