.PHONY: push
push:
	git push origin master
	curl http://marcuswest.in/pull/index.php
