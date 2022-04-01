include .env

up:
	@docker-compose up -d & disown
up-develop:
	@docker-compose -f docker-compose_develop.yml up
run:
	@cd nodejs && npm run start