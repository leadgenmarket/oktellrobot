include .env

export APP_PORT
export APP_DSN
export APP_LOG_LEVEL
export DASHA_APIKEY
export DASHA_SERVER
export NGINX_PORT
export AMO_ID
export AMO_SECRET
export AMO_DOMAIN
export AMO_REDIRECT_URI

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