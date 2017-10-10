dcr = docker-compose run --rm

init:
	npm install

deploy: init
	./node_modules/.bin/serverless deploy

encrypt:
	$(dcr) shush --region ap-southeast-2 encrypt alias/devtest "yourpassword"
