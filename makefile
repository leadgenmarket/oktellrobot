include .env

up:
	@docker-compose up -d & disown
run:
	@cd nodejs && npm run start