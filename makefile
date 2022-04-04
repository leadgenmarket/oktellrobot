include .env

up:
	@docker-compose up -d & disown
up-log:
	@cd nodejs && npm run build
	@docker-compose up
up-develop:
	@cd nodejs && npm run build
	@docker-compose -f docker-compose_develop.yml up & disown
run:
	@cd nodejs && npm run start