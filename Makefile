all:
	@echo make {dev,demo,prod} to deploy

test:
	@echo Unimplemented

dev:
	@echo $$AWS_ACCESS_KEY_ID
	apex -r ap-southeast-1 --env dev deploy

demo:
	@echo $$AWS_ACCESS_KEY_ID
	apex -r ap-southeast-1 --env demo deploy

prod:
	@echo $$AWS_ACCESS_KEY_ID
	apex -r ap-southeast-1 --env prod deploy

testdev:
	apex -r ap-southeast-1 --env dev invoke simple < event.json

testdemo:
	apex -r ap-southeast-1 --env demo invoke simple < event.json

testprod:
	apex -r ap-southeast-1 --env prod invoke simple < event.json


.PHONY: dev demo prod testdev testdemo testprod
